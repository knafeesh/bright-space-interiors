import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { getDb, isFirebaseConfigured, getBucket } from "./firebase-admin";
import { DESIGN_CATEGORIES, DesignCategory, DesignCard } from "../design-ideas-data";

const FIRESTORE_COLLECTION = "site";
const FIRESTORE_DOC = "design_ideas";

const LOCAL_STORE_PATH = path.join(process.cwd(), "src", "data", "design-ideas-store.json");
const TMP_STORE_PATH = path.join("/tmp", "bright_space_design_ideas_store.json");

// In-memory cache for ultra-fast response and serverless continuity
let memoryCategories: DesignCategory[] | null = null;

/**
 * Deep clone initial default categories to avoid modifying the static import
 */
function getDefaultCategories(): DesignCategory[] {
  return JSON.parse(JSON.stringify(DESIGN_CATEGORIES));
}

/**
 * Read all categories from the primary database or resilient local storage fallback
 */
export async function getAllCategoriesFromDb(): Promise<DesignCategory[]> {
  // 1. Try Firebase Firestore in production
  if (isFirebaseConfigured()) {
    try {
      const snap = await getDb().collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC).get();
      if (snap.exists) {
        const data = snap.data();
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
          memoryCategories = data.categories as DesignCategory[];
          return memoryCategories;
        }
      }
    } catch (err) {
      console.warn("[design-ideas-db] Firestore read failed, checking local fallbacks:", err);
    }
  }

  // 2. Return memory cache if present
  if (memoryCategories && Array.isArray(memoryCategories) && memoryCategories.length > 0) {
    return memoryCategories;
  }

  // 3. Try serverless /tmp fallback
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const raw = fs.readFileSync(TMP_STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
        memoryCategories = parsed.categories;
        return parsed.categories;
      }
    }
  } catch {}

  // 4. Try local project file fallback
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
        memoryCategories = parsed.categories;
        return parsed.categories;
      }
    }
  } catch (err) {
    console.warn("[design-ideas-db] Failed reading local file store:", err);
  }

  // 5. Initialize from default categories & seed local file
  const initial = getDefaultCategories();
  memoryCategories = initial;

  // Persist initial data to local file asynchronously
  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify({ categories: initial, updatedAt: Date.now() }, null, 2), "utf-8");
  } catch {}

  return initial;
}

/**
 * Write updated categories to Firebase Firestore, memory, /tmp, and local storage
 */
export async function saveCategoriesToDb(categories: DesignCategory[]): Promise<boolean> {
  memoryCategories = categories;
  const payload = { categories, updatedAt: Date.now() };

  // 1. Save to Firebase Firestore if configured
  if (isFirebaseConfigured()) {
    try {
      await getDb()
        .collection(FIRESTORE_COLLECTION)
        .doc(FIRESTORE_DOC)
        .set(payload, { merge: true });
    } catch (err) {
      console.error("[design-ideas-db] Firestore write failed:", err);
    }
  }

  // 2. Save to /tmp (supported on Vercel serverless)
  try {
    fs.mkdirSync(path.dirname(TMP_STORE_PATH), { recursive: true });
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.warn("[design-ideas-db] Failed writing to /tmp:", err);
  }

  // 3. Save to local project directory
  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch {
    // Normal on read-only serverless filesystem
  }

  return true;
}

/**
 * Retrieve a single category by slug from database
 */
export async function getCategoryFromDbBySlug(slug: string): Promise<DesignCategory | null> {
  const categories = await getAllCategoriesFromDb();
  const found = categories.find((c) => c.slug === slug);
  return found || null;
}

/**
 * Add a new design card to a category
 */
export async function addDesignCardToDb(
  categorySlug: string,
  data: { title: string; image: string }
): Promise<{ success: boolean; design?: DesignCard; categories?: DesignCategory[]; error?: string }> {
  const categories = await getAllCategoriesFromDb();
  const categoryIndex = categories.findIndex((c) => c.slug === categorySlug);

  if (categoryIndex === -1) {
    return { success: false, error: `Category with slug "${categorySlug}" not found.` };
  }

  const newDesign: DesignCard = {
    id: `${categorySlug}-${Date.now()}`,
    title: data.title.trim(),
    image: data.image.trim(),
  };

  // Prepend so the newest design appears at the beginning of the category gallery
  categories[categoryIndex].designs = [newDesign, ...(categories[categoryIndex].designs || [])];

  await saveCategoriesToDb(categories);

  // Invalidate public page caches
  try {
    revalidatePath(`/design-ideas/${categorySlug}`, "page");
    revalidatePath("/design-ideas", "page");
    revalidatePath("/", "layout");
  } catch {}

  return { success: true, design: newDesign, categories };
}

/**
 * Update an existing design card (title, image, and optional category move)
 */
export async function updateDesignCardInDb(
  id: string,
  data: { title: string; image: string; categorySlug: string; oldCategorySlug?: string }
): Promise<{ success: boolean; design?: DesignCard; categories?: DesignCategory[]; error?: string }> {
  const categories = await getAllCategoriesFromDb();
  const currentCategorySlug = data.oldCategorySlug || data.categorySlug;

  // Find source category
  const sourceCatIndex = categories.findIndex((c) => c.slug === currentCategorySlug);
  if (sourceCatIndex === -1) {
    // If not found in stated category, search across all categories
    for (let i = 0; i < categories.length; i++) {
      const designIdx = categories[i].designs.findIndex((d) => d.id === id);
      if (designIdx !== -1) {
        return updateDesignCardInDb(id, { ...data, oldCategorySlug: categories[i].slug });
      }
    }
    return { success: false, error: "Design card not found in any category." };
  }

  const designIndex = categories[sourceCatIndex].designs.findIndex((d) => d.id === id);
  if (designIndex === -1) {
    return { success: false, error: `Design card with ID "${id}" not found in category.` };
  }

  const existingDesign = categories[sourceCatIndex].designs[designIndex];
  const updatedDesign: DesignCard = {
    ...existingDesign,
    title: data.title.trim(),
    image: data.image.trim(),
  };

  const sourceCatSlug = categories[sourceCatIndex].slug;
  const targetCatSlug = data.categorySlug || sourceCatSlug;

  // Check if moving to a different category
  if (targetCatSlug !== sourceCatSlug) {
    const targetCatIndex = categories.findIndex((c) => c.slug === targetCatSlug);
    if (targetCatIndex === -1) {
      return { success: false, error: `Target category "${targetCatSlug}" does not exist.` };
    }
    // Remove from source category
    categories[sourceCatIndex].designs.splice(designIndex, 1);
    // Add to target category
    categories[targetCatIndex].designs = [updatedDesign, ...(categories[targetCatIndex].designs || [])];
  } else {
    // Update in-place
    categories[sourceCatIndex].designs[designIndex] = updatedDesign;
  }

  // 1. Await database persistence FIRST
  await saveCategoriesToDb(categories);

  // 2. Invalidate server-side page caches
  try {
    revalidatePath(`/design-ideas/${sourceCatSlug}`, "page");
    if (targetCatSlug !== sourceCatSlug) {
      revalidatePath(`/design-ideas/${targetCatSlug}`, "page");
    }
    revalidatePath("/design-ideas", "page");
    revalidatePath("/", "layout");
  } catch (revErr) {
    console.warn("[design-ideas-db] revalidatePath warning:", revErr);
  }

  return { success: true, design: updatedDesign, categories };
}

/**
 * Delete a design card by ID from a category
 */
export async function deleteDesignCardFromDb(
  id: string,
  categorySlug?: string
): Promise<{ success: boolean; categories?: DesignCategory[]; error?: string }> {
  const categories = await getAllCategoriesFromDb();

  let targetCatIndex = -1;
  let designIndex = -1;
  let deletedImageUrl = "";

  if (categorySlug) {
    targetCatIndex = categories.findIndex((c) => c.slug === categorySlug);
    if (targetCatIndex !== -1) {
      designIndex = categories[targetCatIndex].designs.findIndex((d) => d.id === id);
    }
  }

  // If not found with categorySlug, search across all categories
  if (targetCatIndex === -1 || designIndex === -1) {
    for (let i = 0; i < categories.length; i++) {
      const idx = categories[i].designs.findIndex((d) => d.id === id);
      if (idx !== -1) {
        targetCatIndex = i;
        designIndex = idx;
        break;
      }
    }
  }

  if (targetCatIndex === -1 || designIndex === -1) {
    return { success: false, error: `Design with ID "${id}" was not found.` };
  }

  deletedImageUrl = categories[targetCatIndex].designs[designIndex].image;
  const deletedCatSlug = categories[targetCatIndex].slug;

  // Remove the design card
  categories[targetCatIndex].designs.splice(designIndex, 1);
  await saveCategoriesToDb(categories);

  // If stored in Firebase Storage, safely delete ONLY if no other design uses this image
  if (isFirebaseConfigured() && deletedImageUrl && deletedImageUrl.includes("firebasestorage.googleapis.com")) {
    try {
      // Check if image is still referenced anywhere
      let inUse = false;
      for (const cat of categories) {
        if (cat.designs.some((d) => d.image === deletedImageUrl) || cat.heroImage === deletedImageUrl) {
          inUse = true;
          break;
        }
      }
      if (!inUse) {
        // Extract storage path from Firebase Storage URL
        const match = deletedImageUrl.match(/\/o\/(.+?)\?/);
        if (match && match[1]) {
          const filePath = decodeURIComponent(match[1]);
          const bucket = getBucket();
          await bucket.file(filePath).delete({ ignoreNotFound: true }).catch(() => {});
        }
      }
    } catch (storageErr) {
      console.warn("[design-ideas-db] Cloud storage cleanup skipped:", storageErr);
    }
  }

  try {
    revalidatePath(`/design-ideas/${deletedCatSlug}`, "page");
    revalidatePath("/design-ideas", "page");
    revalidatePath("/", "layout");
  } catch {}

  return { success: true, categories };
}
