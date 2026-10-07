"use client";
import { useState, useEffect } from "react";
import {
  Project,
  Service,
  SpecialtyService,
  MediaAsset,
  CmsStore,
  INITIAL_MEDIA_ASSETS,
  getDefaultCmsStore,
} from "./cms-types";

export type { Project, Service, SpecialtyService, MediaAsset, CmsStore };
export { INITIAL_MEDIA_ASSETS, getDefaultCmsStore };

const STORAGE_KEY = "bright_space_cms_data";
const CMS_UPDATE_EVENT = "bright_space_cms_updated";

export function loadCmsStore(): CmsStore {
  if (typeof window === "undefined") {
    return getDefaultCmsStore();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.projects)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to read CMS from localStorage", err);
  }
  return getDefaultCmsStore();
}

export const CMS_SAVE_STATUS_EVENT = "bright_space_cms_save_status";

export type CmsSaveStatus =
  | { state: "saving" }
  | { state: "saved" }
  | { state: "error"; message: string };

function emitSaveStatus(status: CmsSaveStatus) {
  window.dispatchEvent(new CustomEvent<CmsSaveStatus>(CMS_SAVE_STATUS_EVENT, { detail: status }));
}

// Serialize saves so a slow request can never overwrite a newer one.
let saveQueue: Promise<unknown> = Promise.resolve();

export function saveCmsStore(store: CmsStore): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);

  // Optimistic local update so the admin UI reacts instantly
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn("Failed to cache CMS store locally", err);
  }
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: store }));
  emitSaveStatus({ state: "saving" });

  const run = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
        cache: "no-store",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        emitSaveStatus({
          state: "error",
          message: data.error || `Save failed (HTTP ${res.status}). Changes are NOT live yet.`,
        });
        return false;
      }
      emitSaveStatus({ state: "saved" });
      return true;
    } catch {
      emitSaveStatus({ state: "error", message: "Network error — changes are NOT live yet. Please retry." });
      return false;
    }
  };

  const result = saveQueue.then(run, run);
  saveQueue = result;
  return result;
}

function isSameImage(url1?: string, url2?: string): boolean {
  if (!url1 || !url2) return false;
  const clean = (u: string) =>
    u.trim().replace(/^https?:\/\/[^\/]+/, "").replace(/^\/+/, "").toLowerCase();
  const c1 = clean(url1);
  const c2 = clean(url2);
  return c1 === c2 || c1.endsWith(c2) || c2.endsWith(c1);
}

// ─── Reactive Hooks ─────────────────────────────────────────────────────────

// One shared server request per page load, no matter how many components use the hooks.
let serverFetch: Promise<CmsStore | null> | null = null;
let serverLoaded = false;

function fetchServerStore(): Promise<CmsStore | null> {
  if (!serverFetch) {
    serverFetch = fetch("/api/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.projects)) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch {}
          return data as CmsStore;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        serverLoaded = true;
      });
  }
  return serverFetch;
}

function useCmsStoreState() {
  const [store, setStore] = useState<CmsStore>(getDefaultCmsStore);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    // 1. Instant paint from local cache
    setStore(loadCmsStore());
    if (serverLoaded) setLoaded(true);

    // 2. Fresh data from the server (source of truth)
    fetchServerStore().then((serverData) => {
      if (!active) return;
      if (serverData) setStore(serverData);
      setLoaded(true);
    });

    // 3. Listen to local updates across components / tabs
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent<CmsStore>).detail;
      if (detail) setStore(detail);
      else setStore(loadCmsStore());
    };

    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return { store, loaded };
}

export function useCmsStore() {
  return useCmsStoreState().store;
}

/** True once the latest content has been fetched from the server. */
export function useCmsLoaded(): boolean {
  return useCmsStoreState().loaded;
}

export function useCmsProjects(): Project[] {
  const store = useCmsStore();
  return store.projects;
}

export function useCmsServices(): Service[] {
  const store = useCmsStore();
  return store.services;
}

export function useCmsSpecialties(): SpecialtyService[] {
  const store = useCmsStore();
  return store.specialties;
}

export function useCmsMedia(): MediaAsset[] {
  const store = useCmsStore();
  return store.media;
}

// ─── Mutation Helpers ────────────────────────────────────────────────────────

// Projects
export function cmsUpdateProject(updated: Project): Promise<boolean> {
  const current = loadCmsStore();
  const nextProjects = current.projects.map((p) => (p.id === updated.id ? updated : p));
  return saveCmsStore({ ...current, projects: nextProjects });
}

export function cmsDeleteProject(projectId: number): Promise<boolean> {
  const current = loadCmsStore();
  const nextProjects = current.projects.filter((p) => p.id !== projectId);
  return saveCmsStore({ ...current, projects: nextProjects });
}

export function cmsAddProject(newProject: Project): Promise<boolean> {
  const current = loadCmsStore();
  return saveCmsStore({ ...current, projects: [newProject, ...current.projects] });
}

// Services
export function cmsUpdateService(updated: Service): Promise<boolean> {
  const current = loadCmsStore();
  const nextServices = current.services.map((s) => (s.slug === updated.slug ? updated : s));
  return saveCmsStore({ ...current, services: nextServices });
}

export function cmsDeleteService(slug: string): Promise<boolean> {
  const current = loadCmsStore();
  const nextServices = current.services.filter((s) => s.slug !== slug);
  return saveCmsStore({ ...current, services: nextServices });
}

export function cmsAddService(newService: Service): Promise<boolean> {
  const current = loadCmsStore();
  return saveCmsStore({ ...current, services: [...current.services, newService] });
}

// Specialties
export function cmsUpdateSpecialty(originalName: string, updated: SpecialtyService): Promise<boolean> {
  const current = loadCmsStore();
  const nextSpecialties = current.specialties.map((s) => (s.name === originalName ? updated : s));
  return saveCmsStore({ ...current, specialties: nextSpecialties });
}

export function cmsDeleteSpecialty(name: string): Promise<boolean> {
  const current = loadCmsStore();
  const nextSpecialties = current.specialties.filter((s) => s.name !== name);
  return saveCmsStore({ ...current, specialties: nextSpecialties });
}

export function cmsAddSpecialty(newSpecialty: SpecialtyService): Promise<boolean> {
  const current = loadCmsStore();
  return saveCmsStore({ ...current, specialties: [...current.specialties, newSpecialty] });
}

// Media
export function cmsUpdateMedia(updated: MediaAsset): Promise<boolean> {
  const current = loadCmsStore();
  const oldAsset = current.media.find((m) => m.id === updated.id);
  const nextMedia = current.media.map((m) => (m.id === updated.id ? updated : m));

  let nextProjects = current.projects;
  let nextServices = current.services;
  let nextSpecialties = current.specialties;

  // When an admin updates an image's URL, propagate that update live across all projects and services
  if (oldAsset && oldAsset.url !== updated.url) {
    nextProjects = current.projects.map((p) => {
      const isMain = isSameImage(p.image, oldAsset.url) || isSameImage(p.image, oldAsset.name);
      const nextGallery = p.gallery.map((g) =>
        isSameImage(g, oldAsset.url) || isSameImage(g, oldAsset.name) ? updated.url : g
      );
      return {
        ...p,
        image: isMain ? updated.url : p.image,
        gallery: nextGallery,
      };
    });

    nextServices = current.services.map((s) => {
      if (isSameImage(s.image, oldAsset.url) || isSameImage(s.image, oldAsset.name)) {
        return { ...s, image: updated.url };
      }
      return s;
    });

    nextSpecialties = current.specialties.map((spec) => {
      if (isSameImage(spec.image, oldAsset.url) || isSameImage(spec.image, oldAsset.name)) {
        return { ...spec, image: updated.url };
      }
      return spec;
    });
  }

  return saveCmsStore({
    ...current,
    media: nextMedia,
    projects: nextProjects,
    services: nextServices,
    specialties: nextSpecialties,
  });
}

export function cmsDeleteMedia(mediaId: string): Promise<boolean> {
  const current = loadCmsStore();
  const asset = current.media.find((m) => m.id === mediaId);
  const nextMedia = current.media.filter((m) => m.id !== mediaId);

  // If this media URL was used in any project, remove it from the gallery or swap it gracefully
  let nextProjects = current.projects;
  let nextServices = current.services;
  let nextSpecialties = current.specialties;

  if (asset) {
    const fallbackImage = "/images/hero-luxury.jpg";

    nextProjects = current.projects.map((p) => {
      const isMain = isSameImage(p.image, asset.url) || isSameImage(p.image, asset.name);
      const updatedGallery = p.gallery.filter(
        (g) => !isSameImage(g, asset.url) && !isSameImage(g, asset.name)
      );
      const newMain = isMain ? updatedGallery[0] || fallbackImage : p.image;
      return {
        ...p,
        image: newMain,
        gallery: updatedGallery.length > 0 ? updatedGallery : [newMain],
      };
    });

    nextServices = current.services.map((s) => {
      if (isSameImage(s.image, asset.url) || isSameImage(s.image, asset.name)) {
        return { ...s, image: fallbackImage };
      }
      return s;
    });

    nextSpecialties = current.specialties.map((spec) => {
      if (isSameImage(spec.image, asset.url) || isSameImage(spec.image, asset.name)) {
        return { ...spec, image: fallbackImage };
      }
      return spec;
    });
  }

  return saveCmsStore({
    ...current,
    media: nextMedia,
    projects: nextProjects,
    services: nextServices,
    specialties: nextSpecialties,
  });
}

export function cmsAddMedia(newAsset: MediaAsset): Promise<boolean> {
  const current = loadCmsStore();
  return saveCmsStore({ ...current, media: [newAsset, ...current.media] });
}
