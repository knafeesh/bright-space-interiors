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

export function saveCmsStore(store: CmsStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: store }));
    // Asynchronously sync to server API
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    }).catch((e) => console.warn("Server sync error:", e));
  } catch (err) {
    console.error("Failed to save CMS store", err);
  }
}

// ─── Reactive Hooks ─────────────────────────────────────────────────────────

export function useCmsStore() {
  const [store, setStore] = useState<CmsStore>(getDefaultCmsStore);

  useEffect(() => {
    // 1. Initial read from local storage
    const current = loadCmsStore();
    setStore(current);

    // 2. Fetch from server to ensure fresh data
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((serverData) => {
        if (serverData && Array.isArray(serverData.projects)) {
          setStore(serverData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData));
        }
      })
      .catch(() => {});

    // 3. Listen to local updates across components
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent<CmsStore>).detail;
      if (detail) setStore(detail);
      else setStore(loadCmsStore());
    };

    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return store;
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
export function cmsUpdateProject(updated: Project): void {
  const current = loadCmsStore();
  const nextProjects = current.projects.map((p) => (p.id === updated.id ? updated : p));
  saveCmsStore({ ...current, projects: nextProjects });
}

export function cmsDeleteProject(projectId: number): void {
  const current = loadCmsStore();
  const nextProjects = current.projects.filter((p) => p.id !== projectId);
  saveCmsStore({ ...current, projects: nextProjects });
}

export function cmsAddProject(newProject: Project): void {
  const current = loadCmsStore();
  saveCmsStore({ ...current, projects: [newProject, ...current.projects] });
}

// Services
export function cmsUpdateService(updated: Service): void {
  const current = loadCmsStore();
  const nextServices = current.services.map((s) => (s.slug === updated.slug ? updated : s));
  saveCmsStore({ ...current, services: nextServices });
}

export function cmsDeleteService(slug: string): void {
  const current = loadCmsStore();
  const nextServices = current.services.filter((s) => s.slug !== slug);
  saveCmsStore({ ...current, services: nextServices });
}

export function cmsAddService(newService: Service): void {
  const current = loadCmsStore();
  saveCmsStore({ ...current, services: [...current.services, newService] });
}

// Specialties
export function cmsUpdateSpecialty(originalName: string, updated: SpecialtyService): void {
  const current = loadCmsStore();
  const nextSpecialties = current.specialties.map((s) => (s.name === originalName ? updated : s));
  saveCmsStore({ ...current, specialties: nextSpecialties });
}

export function cmsDeleteSpecialty(name: string): void {
  const current = loadCmsStore();
  const nextSpecialties = current.specialties.filter((s) => s.name !== name);
  saveCmsStore({ ...current, specialties: nextSpecialties });
}

export function cmsAddSpecialty(newSpecialty: SpecialtyService): void {
  const current = loadCmsStore();
  saveCmsStore({ ...current, specialties: [...current.specialties, newSpecialty] });
}

// Media
export function cmsUpdateMedia(updated: MediaAsset): void {
  const current = loadCmsStore();
  const nextMedia = current.media.map((m) => (m.id === updated.id ? updated : m));
  saveCmsStore({ ...current, media: nextMedia });
}

export function cmsDeleteMedia(mediaId: string): void {
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
      const isMain = p.image === asset.url;
      const updatedGallery = p.gallery.filter((g) => g !== asset.url);
      const newMain = isMain ? updatedGallery[0] || fallbackImage : p.image;
      return {
        ...p,
        image: newMain,
        gallery: updatedGallery.length > 0 ? updatedGallery : [newMain],
      };
    });

    nextServices = current.services.map((s) => {
      if (s.image === asset.url) {
        return { ...s, image: fallbackImage };
      }
      return s;
    });

    nextSpecialties = current.specialties.map((spec) => {
      if (spec.image === asset.url) {
        return { ...spec, image: fallbackImage };
      }
      return spec;
    });
  }

  saveCmsStore({
    ...current,
    media: nextMedia,
    projects: nextProjects,
    services: nextServices,
    specialties: nextSpecialties,
  });
}

export function cmsAddMedia(newAsset: MediaAsset): void {
  const current = loadCmsStore();
  saveCmsStore({ ...current, media: [newAsset, ...current.media] });
}
