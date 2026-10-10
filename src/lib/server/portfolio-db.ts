import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { getDb, isFirebaseConfigured } from "./firebase-admin";
import { Project, CmsStore, getDefaultCmsStore } from "../cms-types";

const CMS_COLLECTION = "site";
const CMS_DOC = "cms";

const LOCAL_STORE_PATH = path.join(process.cwd(), "src", "data", "cms-store.json");
const TMP_STORE_PATH = path.join("/tmp", "bright_space_cms_store.json");

// In-memory cache for ultra-fast response and serverless continuity
let memoryStore: CmsStore | null = null;

function cloneDefaultStore(): CmsStore {
  return JSON.parse(JSON.stringify(getDefaultCmsStore()));
}

/**
 * Retrieve the full CMS store (projects, services, specialties, media)
 * from Firebase Firestore, local disk fallback, or default seed.
 */
export async function getFullStoreFromDb(): Promise<CmsStore> {
  // 1. Try Firebase Firestore in production
  if (isFirebaseConfigured()) {
    try {
      const snap = await getDb().collection(CMS_COLLECTION).doc(CMS_DOC).get();
      if (snap.exists) {
        const data = snap.data();
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
          const store: CmsStore = {
            projects: data.projects as Project[],
            services: Array.isArray(data.services) ? data.services : cloneDefaultStore().services,
            specialties: Array.isArray(data.specialties) ? data.specialties : cloneDefaultStore().specialties,
            media: Array.isArray(data.media) ? data.media : cloneDefaultStore().media,
          };
          memoryStore = store;
          return store;
        }
      }
    } catch (err) {
      console.warn("[portfolio-db] Firestore read failed, checking local fallbacks:", err);
    }
  }

  // 2. Return memory cache if present
  if (memoryStore && Array.isArray(memoryStore.projects) && memoryStore.projects.length > 0) {
    return memoryStore;
  }

  // 3. Try serverless /tmp fallback
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const raw = fs.readFileSync(TMP_STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        memoryStore = parsed;
        return parsed;
      }
    }
  } catch {}

  // 4. Try local project file fallback
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        memoryStore = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[portfolio-db] Failed reading local file store:", err);
  }

  // 5. Initialize from default seed & persist locally
  const initial = cloneDefaultStore();
  memoryStore = initial;

  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
  } catch {}

  return initial;
}

/**
 * Persist the entire CMS store to Firestore, memory, /tmp, and local storage.
 * Revalidates Next.js pages across portfolio, services, and homepage.
 */
export async function saveFullStoreToDb(store: CmsStore): Promise<boolean> {
  memoryStore = store;
  const payload = {
    ...store,
    updatedAt: Date.now(),
  };

  // 1. Save to Firebase Firestore if configured
  if (isFirebaseConfigured()) {
    try {
      await getDb()
        .collection(CMS_COLLECTION)
        .doc(CMS_DOC)
        .set(payload, { merge: true });
    } catch (err) {
      console.error("[portfolio-db] Firestore write failed:", err);
    }
  }

  // 2. Save to /tmp (supported on Vercel serverless)
  try {
    fs.mkdirSync(path.dirname(TMP_STORE_PATH), { recursive: true });
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.warn("[portfolio-db] Failed writing to /tmp:", err);
  }

  // 3. Save to local project directory
  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch {
    // Normal on read-only serverless filesystem
  }

  // 4. Revalidate public website pages
  try {
    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath("/services");
  } catch (err) {
    console.warn("[portfolio-db] revalidatePath warning:", err);
  }

  return true;
}

/**
 * Retrieve all projects from database
 */
export async function getProjectsFromDb(): Promise<Project[]> {
  const store = await getFullStoreFromDb();
  return store.projects;
}

/**
 * Retrieve a single project by slug or numeric ID
 */
export async function getProjectFromDbBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjectsFromDb();
  const cleanSlug = slug.toLowerCase().trim();
  const found = projects.find(
    (p) => p.slug.toLowerCase() === cleanSlug || p.id.toString() === cleanSlug
  );
  return found || null;
}

export async function getProjectFromDbById(id: number): Promise<Project | null> {
  const projects = await getProjectsFromDb();
  const found = projects.find((p) => p.id === id);
  return found || null;
}

/**
 * Update an existing project in the database with complete field mapping
 */
export async function updateProjectInDb(
  updated: Partial<Project> & { id?: number; slug?: string }
): Promise<{ success: boolean; project?: Project; projects?: Project[]; error?: string }> {
  const store = await getFullStoreFromDb();

  // Find existing project by ID first, then by slug
  const index = store.projects.findIndex(
    (p) => (updated.id !== undefined && p.id === updated.id) || (updated.slug && p.slug === updated.slug)
  );

  if (index === -1) {
    return { success: false, error: `Project with ID "${updated.id}" not found.` };
  }

  const existing = store.projects[index];

  // Map every editable field and preserve unchanged fields
  const finalProject: Project = {
    ...existing,
    id: existing.id,
    slug: updated.slug?.trim() || existing.slug,
    title: updated.title?.trim() !== undefined && updated.title.trim() !== "" ? updated.title.trim() : existing.title,
    category: updated.category || existing.category,
    location: updated.location !== undefined ? updated.location.trim() : existing.location,
    area: updated.area !== undefined ? updated.area.trim() : existing.area,
    year: updated.year !== undefined ? updated.year.trim() : existing.year,
    duration: updated.duration !== undefined ? updated.duration.trim() : existing.duration,
    status: updated.status !== undefined ? updated.status : (existing.status || "Completed"),
    featured: typeof updated.featured === "boolean" ? updated.featured : existing.featured,
    image: updated.image?.trim() ? updated.image.trim() : existing.image,
    gallery: Array.isArray(updated.gallery) && updated.gallery.length > 0 ? updated.gallery : existing.gallery,
    description: updated.description !== undefined ? updated.description.trim() : existing.description,
    challenge: updated.challenge !== undefined ? updated.challenge.trim() : existing.challenge,
    solution: updated.solution !== undefined ? updated.solution.trim() : existing.solution,
    clientQuote: updated.clientQuote !== undefined ? updated.clientQuote.trim() : existing.clientQuote,
    clientName: updated.clientName !== undefined ? updated.clientName.trim() : existing.clientName,
    materials: Array.isArray(updated.materials) ? updated.materials : existing.materials,
    bgGradient: updated.bgGradient || existing.bgGradient || "linear-gradient(135deg, #1C1917 0%, #2A231E 100%)",
  };

  // Replace in projects array
  const nextProjects = [...store.projects];
  nextProjects[index] = finalProject;

  await saveFullStoreToDb({
    ...store,
    projects: nextProjects,
  });

  // Revalidate specific project detail page
  try {
    revalidatePath(`/portfolio/${finalProject.slug}`);
    if (existing.slug !== finalProject.slug) {
      revalidatePath(`/portfolio/${existing.slug}`);
    }
  } catch {}

  return {
    success: true,
    project: finalProject,
    projects: nextProjects,
  };
}

/**
 * Add a new project to the database
 */
export async function addProjectToDb(
  newProject: Project
): Promise<{ success: boolean; project?: Project; projects?: Project[]; error?: string }> {
  const store = await getFullStoreFromDb();

  const projectWithId: Project = {
    ...newProject,
    id: newProject.id || Date.now(),
    status: newProject.status || "Completed",
  };

  const nextProjects = [projectWithId, ...store.projects];
  await saveFullStoreToDb({
    ...store,
    projects: nextProjects,
  });

  try {
    revalidatePath(`/portfolio/${projectWithId.slug}`);
  } catch {}

  return {
    success: true,
    project: projectWithId,
    projects: nextProjects,
  };
}

/**
 * Delete a project by ID from the database
 */
export async function deleteProjectFromDb(
  id: number
): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
  const store = await getFullStoreFromDb();
  const target = store.projects.find((p) => p.id === id);

  if (!target) {
    return { success: false, error: `Project with ID ${id} not found.` };
  }

  const nextProjects = store.projects.filter((p) => p.id !== id);
  await saveFullStoreToDb({
    ...store,
    projects: nextProjects,
  });

  try {
    revalidatePath(`/portfolio/${target.slug}`);
  } catch {}

  return {
    success: true,
    projects: nextProjects,
  };
}
