import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { getDb, isFirebaseConfigured, getBucket } from "./firebase-admin";
import {
  WHATSAPP_NUMBER,
  PHONE_NUMBER,
  ALT_PHONE_NUMBER,
  EMAIL,
  ADDRESS,
  TAGLINE,
  WHATSAPP_MESSAGE,
  INSTAGRAM_URL,
  YOUTUBE_URL,
  NAV_SERVICES,
  SERVICES as INITIAL_SERVICES,
  SPECIALTY_SERVICES as INITIAL_SPECIALTIES,
  PROJECTS as INITIAL_PROJECTS,
  TESTIMONIALS as INITIAL_TESTIMONIALS,
  TEAM_MEMBERS as INITIAL_TEAM,
  PROCESS_STEPS as INITIAL_PROCESS,
  WHY_US_PILLARS as INITIAL_PILLARS,
} from "../data";
import { DESIGN_CATEGORIES as INITIAL_CATEGORIES } from "../design-ideas-data";
import { INITIAL_MEDIA_ASSETS } from "../cms-types";
export * from "../site-types";
export { isFirebaseConfigured } from "./firebase-admin";
import type {
  SiteSettings,
  NavServiceItem,
  ServiceDetailItem,
  SpecialtyServiceItem,
  ProjectItem,
  CategoryItem,
  TestimonialItem,
  TeamMemberItem,
  PhilosophySlide,
  PageSeoItem,
  MediaAssetItem,
  EnquiryItem,
  FullSiteStore,
  SaveResult,
} from "../site-types";

// ─── Default Seed ───────────────────────────────────────────────────────────

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: "Bright Space Interiors",
  tagline: TAGLINE,
  phoneNumber: PHONE_NUMBER,
  altPhoneNumber: ALT_PHONE_NUMBER,
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappMessage: WHATSAPP_MESSAGE,
  email: EMAIL,
  address: ADDRESS,
  workingHours: "Mon – Sat: 10:00 AM – 7:30 PM (Sunday by Appointment)",
  instagramUrl: INSTAGRAM_URL,
  facebookUrl: "",
  youtubeUrl: YOUTUBE_URL,
  heroTitle: "Luxury Interiors, Crafted Around You.",
  heroSubtitle:
    "From bespoke residences to turnkey commercial spaces across Delhi NCR — we shape environments with quiet luxury, premium materials, and enduring craftsmanship.",
  yearsExperience: 9,
  projectsCompleted: 100,
  happyClients: 240,
  designersCount: 18,
  footerText:
    "Bright Space Interiors is a premier interior architecture and turnkey design-build practice based in New Delhi, serving luxury residential and commercial clients across Delhi NCR and Pan-India.",
};

const DEFAULT_PHILOSOPHY: PhilosophySlide[] = [
  { id: "phil-1", src: "/images/design-philosophy/philosophy-1.jpg", alt: "Luxury foyer with marble staircase and golden lighting", order: 1 },
  { id: "phil-2", src: "/images/design-philosophy/philosophy-2.jpg", alt: "Luxury modular kitchen with cream and gold finishes", order: 2 },
  { id: "phil-3", src: "/images/design-philosophy/philosophy-3.jpg", alt: "Luxury living room with geometric TV wall and elegant furniture", order: 3 },
  { id: "phil-4", src: "/images/design-philosophy/philosophy-4.jpg", alt: "Luxury master bedroom with warm lighting and a walk-in wardrobe", order: 4 },
  { id: "phil-5", src: "/images/design-philosophy/philosophy-5.jpg", alt: "Luxury foyer and living area with an illuminated staircase", order: 5 },
];

const DEFAULT_PAGE_SEO: PageSeoItem[] = [
  { path: "/", title: "Bright Space Interiors | Luxury Interior Design & Turnkey Execution", description: "Luxury Interior Designers in Delhi NCR, Gurugram, Faridabad, Haryana & Punjab — Bright Space Interiors brings premium home interiors tailored to your style." },
  { path: "/about", title: "About Us | Bright Space Interiors", description: "Learn the story behind Bright Space Interiors — our founding philosophy, team, and commitment to crafting luxury spaces with precision and heart." },
  { path: "/services", title: "Interior Design Services & Turnkey Solutions | Bright Space Interiors", description: "Explore our complete interior design and turnkey execution services across Delhi NCR — Residential, Commercial, Turnkey Projects, Modular Kitchens, Civil & Renovation, and 3D Visualisation." },
  { path: "/portfolio", title: "Portfolio | Bright Space Interiors", description: "Explore our bespoke interior design and turnkey execution portfolio across Delhi NCR, Gurugram, and pan-India." },
  { path: "/process", title: "From Design to Move-In | Bright Space Interiors", description: "Discover our seamless customer journey from initial design consultation to final installation and handover. Bright Space Interiors guarantees precision, quality, and complete peace of mind." },
  { path: "/contact", title: "Contact Us | Bright Space Interiors", description: "Book a free design consultation with Bright Space Interiors. Call or WhatsApp for bespoke residential and commercial luxury interiors across Delhi NCR." },
  { path: "/design-ideas", title: "Interior Design Ideas | Bright Space Interiors", description: "Explore 32 curated interior design categories by Bright Space Interiors. Discover ideas for living room, kitchen, bedroom, and commercial spaces in Delhi NCR." },
  { path: "/privacy-policy", title: "Privacy Policy | Bright Space Interiors", description: "Privacy policy and client data handling guidelines for Bright Space Interiors." },
  { path: "/terms-conditions", title: "Terms & Conditions | Bright Space Interiors", description: "Terms and conditions for interior design, turnkey projects, and services provided by Bright Space Interiors." },
];

export function getDefaultSiteStore(): FullSiteStore {
  // Load existing projects from local cms-store if present, else fallback to INITIAL_PROJECTS
  let projects: ProjectItem[] = [];
  try {
    const cmsStoreFile = path.join(process.cwd(), "src", "data", "cms-store.json");
    if (fs.existsSync(cmsStoreFile)) {
      const data = JSON.parse(fs.readFileSync(cmsStoreFile, "utf-8"));
      if (Array.isArray(data.projects)) {
        projects = data.projects.map((p: any, idx: number) => ({
          ...p,
          status: p.status === "draft" ? "draft" : "published",
          order: p.order || idx + 1,
        }));
      }
    }
  } catch {}
  if (projects.length === 0) {
    projects = INITIAL_PROJECTS.map((p, idx) => ({
      ...p,
      status: "published",
      order: idx + 1,
    }));
  }

  // Load categories from local design-ideas-store if present
  let categories: CategoryItem[] = [];
  try {
    const catFile = path.join(process.cwd(), "src", "data", "design-ideas-store.json");
    if (fs.existsSync(catFile)) {
      const data = JSON.parse(fs.readFileSync(catFile, "utf-8"));
      if (Array.isArray(data.categories)) {
        categories = data.categories.map((c: any, idx: number) => ({
          ...c,
          order: c.order || idx + 1,
          published: c.published !== false,
        }));
      }
    }
  } catch {}
  if (categories.length === 0) {
    categories = INITIAL_CATEGORIES.map((c, idx) => ({
      ...c,
      type: c.type || "residential",
      order: idx + 1,
      published: true,
    }));
  }

  return {
    settings: DEFAULT_SITE_SETTINGS,
    navServices: NAV_SERVICES.map((s, idx) => ({
      ...s,
      order: idx + 1,
      published: true,
    })),
    detailedServices: INITIAL_SERVICES.map((s, idx) => ({
      ...s,
      order: idx + 1,
      published: true,
    })),
    specialties: INITIAL_SPECIALTIES.map((s, idx) => ({
      ...s,
      order: idx + 1,
    })),
    projects,
    categories,
    testimonials: INITIAL_TESTIMONIALS.map((t, idx) => ({
      ...t,
      order: idx + 1,
      published: true,
    })),
    team: INITIAL_TEAM.map((m, idx) => ({
      ...m,
      order: idx + 1,
      published: true,
    })),
    philosophyCarousel: DEFAULT_PHILOSOPHY,
    pageSeo: DEFAULT_PAGE_SEO,
    media: INITIAL_MEDIA_ASSETS.map((m) => ({
      ...m,
    })),
    updatedAt: Date.now(),
  };
}

// ─── Persistence Paths & Firestore Config ───────────────────────────────────

const FIRESTORE_COLLECTION = "site";
const FIRESTORE_DOC = "content";
const LEADS_COLLECTION = "leads";

const LOCAL_STORE_PATH = path.join(process.cwd(), "src", "data", "site-store.json");
const TMP_STORE_PATH = path.join("/tmp", "bright_space_site_store.json");

// In-memory cache for ultra-fast server response within request context
let memoryStore: FullSiteStore | null = null;

// ─── Core Database Operations ───────────────────────────────────────────────

/**
 * Retrieve the entire site store from Firestore (with local fallback).
 * If Firestore is configured and empty, automatically seeds it once.
 */
export async function getFullSiteStore(): Promise<FullSiteStore> {
  // 1. Try Firebase Firestore in production
  if (isFirebaseConfigured()) {
    try {
      const snap = await getDb().collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC).get();
      if (snap.exists) {
        const data = snap.data();
        if (data && data.settings && Array.isArray(data.projects)) {
          memoryStore = data as FullSiteStore;
          return memoryStore;
        }
      }
      // If Firestore doc does not exist yet, seed it automatically
      const initialSeed = readLocalOrInitialSeed();
      await getDb()
        .collection(FIRESTORE_COLLECTION)
        .doc(FIRESTORE_DOC)
        .set(initialSeed, { merge: true });
      memoryStore = initialSeed;
      return initialSeed;
    } catch (err) {
      console.warn("[site-db] Firestore read failed, falling back to local file store:", err);
    }
  }

  // 2. Return memory cache if present
  if (memoryStore && memoryStore.settings) {
    return memoryStore;
  }

  // 3. Fallback to local store or default seed
  const store = readLocalOrInitialSeed();
  memoryStore = store;
  return store;
}

function readLocalOrInitialSeed(): FullSiteStore {
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const raw = fs.readFileSync(TMP_STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.settings && Array.isArray(parsed.projects)) {
        return parsed;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const raw = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.settings && Array.isArray(parsed.projects)) {
        return parsed;
      }
    }
  } catch {}

  const defaultStore = getDefaultSiteStore();
  // Persist default store locally
  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(defaultStore, null, 2), "utf-8");
  } catch {}

  return defaultStore;
}



/**
 * Persist the entire site store to Firestore and local disk,
 * and trigger instant Next.js on-demand revalidation.
 */
export async function saveFullSiteStore(store: FullSiteStore): Promise<SaveResult> {
  const timestamp = Date.now();
  const payload: FullSiteStore = {
    ...store,
    updatedAt: timestamp,
  };
  memoryStore = payload;

  let persisted = false;
  let storage: "firestore" | "local_disk" | "ephemeral_tmp" = "local_disk";

  // 1. Write to Firebase Firestore
  if (isFirebaseConfigured()) {
    try {
      await getDb()
        .collection(FIRESTORE_COLLECTION)
        .doc(FIRESTORE_DOC)
        .set(payload, { merge: true });
      persisted = true;
      storage = "firestore";

      // Also sync to legacy site/cms collection to guarantee all public hooks stay in sync
      await getDb()
        .collection("site")
        .doc("cms")
        .set(
          {
            projects: payload.projects || [],
            services: payload.detailedServices || [],
            specialties: payload.specialties || [],
            media: payload.media || [],
            updatedAt: timestamp,
          },
          { merge: true }
        )
        .catch(() => {});
    } catch (err: any) {
      console.error("[site-db] Firestore write failed:", err);
      return {
        success: false,
        persisted: false,
        storage: "local_disk",
        updatedAt: timestamp,
        error: `Firestore persistence failed: ${err.message || String(err)}`,
      };
    }
  }

  // 2. Persist locally to server disk
  try {
    fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
    if (!persisted) {
      persisted = true;
      storage = "local_disk";
    }
  } catch {}

  // 3. Persist to /tmp for serverless continuity
  try {
    fs.mkdirSync(path.dirname(TMP_STORE_PATH), { recursive: true });
    fs.writeFileSync(TMP_STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch {}

  // 4. Trigger Next.js On-Demand Revalidation across all public pages
  triggerRevalidation(payload);

  // 5. Update static public/sitemap.xml
  try {
    updateStaticSitemapFile(payload);
  } catch (err) {
    console.warn("[site-db] Sitemap file write skipped:", err);
  }

  return { success: true, persisted, storage, updatedAt: timestamp };
}

// ─── On-Demand Revalidation & Sitemap Sync ─────────────────────────────────

export function triggerRevalidation(store?: FullSiteStore) {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/services/[slug]");
    revalidatePath("/portfolio");
    revalidatePath("/portfolio/[slug]");
    revalidatePath("/design-ideas");
    revalidatePath("/design-ideas/[slug]");
    revalidatePath("/process");
    revalidatePath("/contact");
    revalidatePath("/sitemap.xml");
  } catch (err) {
    console.warn("[site-db] revalidatePath notice:", err);
  }
}

export function updateStaticSitemapFile(store: FullSiteStore) {
  const BASE_URL = "https://www.brightspaceinterior.in";

  const staticUrls = [
    { loc: `${BASE_URL}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${BASE_URL}/services`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE_URL}/portfolio`, priority: "0.9", changefreq: "weekly" },
    { loc: `${BASE_URL}/about`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/process`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/contact`, priority: "0.8", changefreq: "monthly" },
    { loc: `${BASE_URL}/design-ideas`, priority: "0.9", changefreq: "weekly" },
  ];

  // Only published items appear in sitemap
  const serviceUrls = (store.detailedServices || [])
    .filter((s) => s.published !== false)
    .map((s) => ({ loc: `${BASE_URL}/services/${s.slug}`, priority: "0.8", changefreq: "monthly" }));

  const projectUrls = (store.projects || [])
    .filter((p) => p.status === "published")
    .map((p) => ({ loc: `${BASE_URL}/portfolio/${p.slug}`, priority: "0.7", changefreq: "monthly" }));

  const categoryUrls = (store.categories || [])
    .filter((c) => c.published !== false)
    .map((c) => ({ loc: `${BASE_URL}/design-ideas/${c.slug}`, priority: "0.7", changefreq: "weekly" }));

  const legalUrls = [
    { loc: `${BASE_URL}/privacy-policy`, priority: "0.3", changefreq: "yearly" },
    { loc: `${BASE_URL}/terms-conditions`, priority: "0.3", changefreq: "yearly" },
  ];

  const allUrls = [...staticUrls, ...serviceUrls, ...projectUrls, ...categoryUrls, ...legalUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml, "utf-8");
}

// ─── Entity Getters & Operations ────────────────────────────────────────────

// 1. Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  const store = await getFullSiteStore();
  return store.settings || DEFAULT_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.settings = { ...store.settings, ...settings };
  return saveFullSiteStore(store);
}

// 2. Projects
export async function getProjects(): Promise<ProjectItem[]> {
  const store = await getFullSiteStore();
  return (store.projects || []).sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getPublishedProjects(): Promise<ProjectItem[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.status === "published");
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const projects = await getProjects();
  const clean = slug.toLowerCase().trim();
  const found = projects.find(
    (p) => p.slug.toLowerCase() === clean || String(p.id) === clean
  );
  return found || null;
}

export async function saveProject(project: Partial<ProjectItem> & { title: string }): Promise<SaveResult & { project?: ProjectItem }> {
  const store = await getFullSiteStore();
  const projects = [...(store.projects || [])];

  const existingIndex = projects.findIndex(
    (p) => (project.id !== undefined && p.id === project.id) || (project.slug && p.slug === project.slug)
  );

  let finalProject: ProjectItem;
  if (existingIndex !== -1) {
    finalProject = {
      ...projects[existingIndex],
      ...project,
      categories: project.categories || projects[existingIndex].categories || [project.category || "RESIDENTIAL"],
    };
    projects[existingIndex] = finalProject;
  } else {
    const slug =
      project.slug?.trim() ||
      project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    finalProject = {
      id: project.id || Date.now(),
      slug,
      title: project.title.trim(),
      category: project.category?.trim() || "RESIDENTIAL",
      categories: project.categories || [project.category?.trim() || "RESIDENTIAL"],
      location: project.location?.trim() || "Delhi NCR",
      area: project.area?.trim() || "2,000 sq ft",
      year: project.year?.trim() || new Date().getFullYear().toString(),
      duration: project.duration?.trim() || "8 weeks",
      featured: typeof project.featured === "boolean" ? project.featured : true,
      status: project.status || "published",
      image: project.image?.trim() || "/images/hero-luxury.jpg",
      gallery: Array.isArray(project.gallery) && project.gallery.length > 0 ? project.gallery : [project.image || "/images/hero-luxury.jpg"],
      description: project.description?.trim() || "",
      challenge: project.challenge?.trim() || "",
      solution: project.solution?.trim() || "",
      clientQuote: project.clientQuote?.trim() || "",
      clientName: project.clientName?.trim() || "",
      materials: project.materials || [],
      bgGradient: project.bgGradient || "linear-gradient(135deg, #1C1917 0%, #2A231E 100%)",
      order: project.order !== undefined ? project.order : projects.length + 1,
    };
    projects.push(finalProject);
  }

  store.projects = projects;
  const res = await saveFullSiteStore(store);
  return { ...res, project: finalProject };
}

export async function deleteProject(id: number | string): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const idNum = Number(id);
  const target = store.projects.find((p) => p.id === idNum || p.slug === String(id));
  if (!target) {
    return { success: false, persisted: false, storage: "local_disk", updatedAt: Date.now(), error: "Project not found" };
  }

  store.projects = store.projects.filter((p) => p.id !== target.id);
  try {
    revalidatePath(`/portfolio/${target.slug}`);
  } catch {}
  return saveFullSiteStore(store);
}

// 3. Services (Core 6 & Detailed 4)
export async function getNavServices(): Promise<NavServiceItem[]> {
  const store = await getFullSiteStore();
  return (store.navServices || []).sort((a, b) => a.order - b.order);
}

export async function getPublishedNavServices(): Promise<NavServiceItem[]> {
  const list = await getNavServices();
  return list.filter((s) => s.published !== false);
}

export async function getDetailedServices(): Promise<ServiceDetailItem[]> {
  const store = await getFullSiteStore();
  return (store.detailedServices || []).sort((a, b) => a.order - b.order);
}

export async function getDetailedServiceBySlug(slug: string): Promise<ServiceDetailItem | null> {
  const list = await getDetailedServices();
  const clean = slug.toLowerCase().trim();
  const found = list.find((s) => s.slug.toLowerCase() === clean);
  return found || null;
}

export async function saveNavService(service: Partial<NavServiceItem> & { slug: string; title: string }): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.navServices || [])];
  const idx = list.findIndex((s) => s.slug === service.slug);

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...service };
  } else {
    list.push({
      slug: service.slug,
      title: service.title,
      description: service.description || "",
      image: service.image || "/images/hero-luxury.jpg",
      caption: service.caption || "",
      href: service.href || `/services/${service.slug}`,
      whatsappMsg: service.whatsappMsg || `Hello Bright Space Interiors, I am interested in ${service.title}.`,
      order: service.order || list.length + 1,
      published: service.published !== false,
    });
  }

  store.navServices = list;
  return saveFullSiteStore(store);
}

export async function saveNavServices(services: NavServiceItem[]): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.navServices = services;
  return saveFullSiteStore(store);
}

export async function saveDetailedService(service: Partial<ServiceDetailItem> & { slug: string; title: string }): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.detailedServices || [])];
  const idx = list.findIndex((s) => s.slug === service.slug);

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...service };
  } else {
    list.push({
      slug: service.slug,
      title: service.title,
      subtitle: service.subtitle || "",
      image: service.image || "/images/hero-luxury.jpg",
      description: service.description || "",
      subServices: service.subServices || [],
      bgColor: service.bgColor || "#2E2826",
      faqs: service.faqs || [],
      order: service.order || list.length + 1,
      published: service.published !== false,
    });
  }

  store.detailedServices = list;
  return saveFullSiteStore(store);
}

export async function deleteService(slug: string): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.navServices = (store.navServices || []).filter((s) => s.slug !== slug);
  store.detailedServices = (store.detailedServices || []).filter((s) => s.slug !== slug);
  try {
    revalidatePath(`/services/${slug}`);
  } catch {}
  return saveFullSiteStore(store);
}

export async function getSpecialties(): Promise<SpecialtyServiceItem[]> {
  const store = await getFullSiteStore();
  return (store.specialties || []).sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function saveSpecialties(specialties: SpecialtyServiceItem[]): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.specialties = specialties;
  return saveFullSiteStore(store);
}

export async function saveSpecialty(specialty: Partial<SpecialtyServiceItem> & { name: string }): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.specialties || [])];
  const idx = list.findIndex(
    (s) => (specialty.id && s.id === specialty.id) || s.name.toLowerCase() === specialty.name.toLowerCase()
  );

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...specialty };
  } else {
    list.push({
      id: specialty.id || `spec-${Date.now()}`,
      name: specialty.name.trim(),
      tagline: specialty.tagline?.trim() || "",
      description: specialty.description?.trim() || "",
      image: specialty.image?.trim() || "",
      icon: specialty.icon?.trim() || "Sparkles",
      order: specialty.order !== undefined ? specialty.order : list.length + 1,
      published: specialty.published !== false,
    });
  }

  store.specialties = list;
  return saveFullSiteStore(store);
}

export async function deleteSpecialty(idOrName: string): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.specialties = (store.specialties || []).filter(
    (s) => s.id !== idOrName && s.name.toLowerCase() !== idOrName.toLowerCase()
  );
  return saveFullSiteStore(store);
}

// 4. Categories (32 Design Ideas)
export async function getCategories(): Promise<CategoryItem[]> {
  const store = await getFullSiteStore();
  return (store.categories || []).sort((a, b) => a.order - b.order);
}

export async function getPublishedCategories(): Promise<CategoryItem[]> {
  const list = await getCategories();
  return list.filter((c) => c.published !== false);
}

export async function getCategoryBySlug(slug: string): Promise<CategoryItem | null> {
  const list = await getCategories();
  const clean = slug.toLowerCase().trim();
  const found = list.find((c) => c.slug.toLowerCase() === clean);
  return found || null;
}

export async function saveCategory(category: Partial<CategoryItem> & { slug: string; name: string }): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.categories || [])];
  const idx = list.findIndex((c) => c.slug === category.slug);

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...category };
  } else {
    list.push({
      slug: category.slug,
      name: category.name,
      group: category.group || "Living & Lounge",
      type: category.type || "residential",
      heroTitle: category.heroTitle || category.name,
      heroSubtitle: category.heroSubtitle || "",
      heroImage: category.heroImage || "/images/hero-luxury.jpg",
      metaTitle: category.metaTitle || `${category.name} | Bright Space Interiors`,
      metaDescription: category.metaDescription || "",
      designs: category.designs || [],
      order: category.order || list.length + 1,
      published: category.published !== false,
    });
  }

  store.categories = list;
  return saveFullSiteStore(store);
}

export async function deleteCategory(slug: string): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.categories = (store.categories || []).filter((c) => c.slug !== slug);
  try {
    revalidatePath(`/design-ideas/${slug}`);
  } catch {}
  return saveFullSiteStore(store);
}

// 5. Testimonials
export async function getTestimonials(): Promise<TestimonialItem[]> {
  const store = await getFullSiteStore();
  return (store.testimonials || []).sort((a, b) => a.order - b.order);
}

export async function getPublishedTestimonials(): Promise<TestimonialItem[]> {
  const list = await getTestimonials();
  return list.filter((t) => t.published !== false);
}

export async function saveTestimonial(testimonial: Partial<TestimonialItem> & { name: string; quote: string }): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.testimonials || [])];
  const idx = list.findIndex((t) => testimonial.id && t.id === testimonial.id);

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...testimonial };
  } else {
    list.push({
      id: testimonial.id || Date.now(),
      name: testimonial.name,
      project: testimonial.project || "",
      rating: testimonial.rating || 5,
      quote: testimonial.quote,
      order: testimonial.order || list.length + 1,
      published: testimonial.published !== false,
    });
  }

  store.testimonials = list;
  return saveFullSiteStore(store);
}

export async function deleteTestimonial(id: number): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.testimonials = (store.testimonials || []).filter((t) => t.id !== id);
  return saveFullSiteStore(store);
}

// 6. Team Members
export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  const store = await getFullSiteStore();
  return (store.team || []).sort((a, b) => a.order - b.order);
}

export async function getPublishedTeamMembers(): Promise<TeamMemberItem[]> {
  const list = await getTeamMembers();
  return list.filter((m) => m.published !== false);
}

export async function saveTeamMember(member: Partial<TeamMemberItem> & { name: string; role: string }): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.team || [])];
  const idx = list.findIndex((m) => member.id && m.id === member.id);

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...member };
  } else {
    list.push({
      id: member.id || Date.now(),
      name: member.name,
      role: member.role,
      image: member.image || "",
      bio: member.bio || "",
      order: member.order || list.length + 1,
      published: member.published !== false,
    });
  }

  store.team = list;
  return saveFullSiteStore(store);
}

export async function deleteTeamMember(id: number): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.team = (store.team || []).filter((m) => m.id !== id);
  return saveFullSiteStore(store);
}

// 7. Philosophy Carousel
export async function getPhilosophyCarousel(): Promise<PhilosophySlide[]> {
  const store = await getFullSiteStore();
  return (store.philosophyCarousel || []).sort((a, b) => a.order - b.order);
}

export async function savePhilosophyCarousel(slides: PhilosophySlide[]): Promise<SaveResult> {
  const store = await getFullSiteStore();
  store.philosophyCarousel = slides;
  return saveFullSiteStore(store);
}

export const getPhilosophySlides = getPhilosophyCarousel;
export const savePhilosophySlides = savePhilosophyCarousel;

// 8. Page SEO
export async function getPageSeoList(): Promise<PageSeoItem[]> {
  const store = await getFullSiteStore();
  return store.pageSeo || DEFAULT_PAGE_SEO;
}

export async function savePageSeo(seoItem: PageSeoItem): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.pageSeo || [])];
  const idx = list.findIndex((s) => s.path === seoItem.path);

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...seoItem };
  } else {
    list.push(seoItem);
  }

  store.pageSeo = list;
  return saveFullSiteStore(store);
}

// 9. Media Assets & Usage Detection
export async function getMediaAssets(): Promise<MediaAssetItem[]> {
  const store = await getFullSiteStore();
  return store.media || [];
}

export async function saveMediaAsset(asset: MediaAssetItem): Promise<SaveResult> {
  const store = await getFullSiteStore();
  const list = [...(store.media || [])];
  const idx = list.findIndex((m) => m.id === asset.id || m.url === asset.url);

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...asset };
  } else {
    list.unshift(asset);
  }

  store.media = list;
  return saveFullSiteStore(store);
}

export const addMediaAsset = saveMediaAsset;

/**
 * Scan all collections to find where an image URL is used.
 */
export async function findImageUsage(imageUrl: string): Promise<string[]> {
  const store = await getFullSiteStore();
  const cleanUrl = imageUrl.trim();
  const usage: string[] = [];

  // 1. Projects
  for (const p of store.projects || []) {
    if (p.image === cleanUrl) usage.push(`Project "${p.title}" (Hero Image)`);
    if (Array.isArray(p.gallery) && p.gallery.includes(cleanUrl)) {
      usage.push(`Project "${p.title}" (Gallery)`);
    }
  }

  // 2. Services
  for (const s of store.navServices || []) {
    if (s.image === cleanUrl) usage.push(`Service "${s.title}" (Card Photo)`);
  }
  for (const s of store.detailedServices || []) {
    if (s.image === cleanUrl) usage.push(`Service Detail "${s.title}"`);
  }

  // 3. Categories
  for (const c of store.categories || []) {
    if (c.heroImage === cleanUrl) usage.push(`Category "${c.name}" (Hero Banner)`);
    for (const d of c.designs || []) {
      if (d.image === cleanUrl) usage.push(`Category "${c.name}" (Design: ${d.title})`);
    }
  }

  // 4. Team
  for (const t of store.team || []) {
    if (t.image === cleanUrl) usage.push(`Team Member "${t.name}" (Portrait)`);
  }

  // 5. Philosophy Carousel
  for (const sl of store.philosophyCarousel || []) {
    if (sl.src === cleanUrl) usage.push(`Design Philosophy Carousel (Slide ${sl.order})`);
  }

  return usage;
}

export async function deleteMediaAsset(assetIdOrUrl: string): Promise<{ success: boolean; error?: string; usedIn?: string[] }> {
  const store = await getFullSiteStore();
  const target = (store.media || []).find((m) => m.id === assetIdOrUrl || m.url === assetIdOrUrl);
  if (!target) {
    return { success: false, error: "Media asset not found" };
  }

  // Block deletion if image is in use elsewhere
  const usage = await findImageUsage(target.url);
  if (usage.length > 0) {
    return {
      success: false,
      error: `Cannot delete image because it is currently used on the website.`,
      usedIn: usage,
    };
  }

  // Delete from Firebase Storage if it's stored in Firebase
  if (isFirebaseConfigured() && target.url.includes("firebasestorage.googleapis.com")) {
    try {
      const match = target.url.match(/\/o\/(.+?)\?/);
      if (match && match[1]) {
        const filePath = decodeURIComponent(match[1]);
        const bucket = getBucket();
        await bucket.file(filePath).delete({ ignoreNotFound: true }).catch(() => {});
      }
    } catch (storageErr) {
      console.warn("[site-db] Storage delete failed:", storageErr);
    }
  }

  store.media = (store.media || []).filter((m) => m.id !== target.id && m.url !== target.url);
  await saveFullSiteStore(store);
  return { success: true };
}

// 10. Enquiries / Leads
const TMP_LEADS_FILE = path.join("/tmp", "bright_space_enquiries.json");
const LOCAL_LEADS_FILE = path.join(process.cwd(), "src", "data", "leads.json");

export async function getEnquiries(): Promise<EnquiryItem[]> {
  if (isFirebaseConfigured()) {
    try {
      const snap = await getDb().collection(LEADS_COLLECTION).orderBy("createdAt", "desc").get();
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          projectType: data.projectType || data.project || "General Enquiry",
          location: data.location || "Delhi NCR",
          budget: data.budget || "Not Specified",
          message: data.message || data.notes || "",
          time: data.time || data.date || new Date(data.createdAt || Date.now()).toLocaleString("en-IN"),
          status: data.status || "New",
          notes: data.notes || "",
          createdAt: data.createdAt || Date.now(),
        } as EnquiryItem;
      });
    } catch (err) {
      console.warn("[site-db] Firestore enquiries fetch error:", err);
    }
  }

  // Local fallback
  try {
    if (fs.existsSync(LOCAL_LEADS_FILE)) {
      const raw = fs.readFileSync(LOCAL_LEADS_FILE, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.map((l: any) => ({
          id: String(l.id),
          name: l.name || "",
          phone: l.phone || "",
          email: l.email || "",
          projectType: l.project || l.projectType || "General Enquiry",
          location: l.location || "Delhi NCR",
          budget: l.budget || "Not Specified",
          message: l.notes || l.message || "",
          time: l.date || l.time || new Date().toLocaleString("en-IN"),
          status: l.status || "New",
          notes: l.notes || "",
          createdAt: typeof l.id === "number" ? l.id : Date.now(),
        }));
      }
    }
  } catch {}

  return [];
}

export async function saveEnquiry(enquiry: Omit<EnquiryItem, "id" | "createdAt"> & { id?: string }): Promise<{ success: boolean; id: string }> {
  const id = enquiry.id || `lead-${Date.now()}`;
  const now = Date.now();
  const timeFormatted =
    enquiry.time ||
    new Date().toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

  const payload: EnquiryItem = {
    id,
    name: enquiry.name.trim(),
    phone: enquiry.phone.trim(),
    email: (enquiry.email || "").trim(),
    projectType: enquiry.projectType || "General Enquiry",
    location: enquiry.location || "Delhi NCR",
    budget: enquiry.budget || "Not Specified",
    message: (enquiry.message || "").trim(),
    time: timeFormatted,
    status: enquiry.status || "New",
    notes: enquiry.notes || "",
    createdAt: now,
  };

  if (isFirebaseConfigured()) {
    try {
      await getDb().collection(LEADS_COLLECTION).doc(id).set(payload);
    } catch (err) {
      console.error("[site-db] Firestore lead save error:", err);
    }
  }

  // Save to local file
  try {
    const list = await getEnquiries();
    const updated = [payload, ...list.filter((l) => l.id !== id)];
    fs.mkdirSync(path.dirname(LOCAL_LEADS_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_LEADS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch {}

  return { success: true, id };
}

export async function updateEnquiryStatus(id: string, status: "New" | "Contacted" | "Won" | "Lost", notes?: string): Promise<{ success: boolean }> {
  if (isFirebaseConfigured()) {
    try {
      await getDb().collection(LEADS_COLLECTION).doc(id).set({ status, ...(notes !== undefined ? { notes } : {}) }, { merge: true });
    } catch (err) {
      console.error("[site-db] Firestore lead status update error:", err);
    }
  }

  try {
    const list = await getEnquiries();
    const updated = list.map((l) => (l.id === id ? { ...l, status, ...(notes !== undefined ? { notes } : {}) } : l));
    fs.mkdirSync(path.dirname(LOCAL_LEADS_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_LEADS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch {}

  return { success: true };
}

export async function deleteEnquiry(id: string): Promise<{ success: boolean }> {
  if (isFirebaseConfigured()) {
    try {
      await getDb().collection(LEADS_COLLECTION).doc(id).delete();
    } catch (err) {
      console.error("[site-db] Firestore lead delete error:", err);
    }
  }

  try {
    const list = await getEnquiries();
    const updated = list.filter((l) => l.id !== id);
    fs.mkdirSync(path.dirname(LOCAL_LEADS_FILE), { recursive: true });
    fs.writeFileSync(LOCAL_LEADS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch {}

  return { success: true };
}
