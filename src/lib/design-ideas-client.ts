"use client";

import { useEffect, useState } from "react";
import { DesignCategory, DesignCard } from "./design-ideas-data";

export const DESIGN_IDEAS_STORAGE_KEY = "bright_space_design_ideas_store";
export const DESIGN_IDEAS_UPDATE_EVENT = "bright_space_design_ideas_updated";

/**
 * Load Design Ideas categories from localStorage (instant client paint and sync)
 */
export function loadStoredDesignCategories(): DesignCategory[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DESIGN_IDEAS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      if (parsed && Array.isArray(parsed.categories) && parsed.categories.length > 0) {
        return parsed.categories;
      }
    }
  } catch (err) {
    console.warn("[design-ideas-client] Failed reading localStorage:", err);
  }
  return null;
}

/**
 * Save updated Design Ideas categories to localStorage and broadcast update event
 */
export function saveStoredDesignCategories(categories: DesignCategory[]): void {
  if (typeof window === "undefined" || !Array.isArray(categories)) return;
  try {
    localStorage.setItem(DESIGN_IDEAS_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.warn("[design-ideas-client] Failed writing to localStorage:", err);
  }

  try {
    window.dispatchEvent(
      new CustomEvent(DESIGN_IDEAS_UPDATE_EVENT, { detail: categories })
    );
  } catch {}
}

/**
 * Hook to reactively subscribe to a category's designs across admin saves and client updates
 */
export function useSyncedCategory(initialCategory: DesignCategory): DesignCategory {
  const [category, setCategory] = useState<DesignCategory>(initialCategory);

  useEffect(() => {
    let active = true;

    // Helper to find and apply updated category designs
    const syncFromList = (list: DesignCategory[] | null) => {
      if (!list || !Array.isArray(list)) return;
      const found = list.find((c) => c.slug === initialCategory.slug);
      if (found && active) {
        setCategory(found);
      }
    };

    // 1. Check local storage immediately (instant sync from admin edits)
    const stored = loadStoredDesignCategories();
    syncFromList(stored);

    // 2. Fetch fresh data from API with no-store
    fetch("/api/design-ideas", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          syncFromList(data.categories);
          saveStoredDesignCategories(data.categories);
        }
      })
      .catch(() => {});

    // 3. Listen to local updates within same window
    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent<DesignCategory[]>).detail;
      if (detail) syncFromList(detail);
    };
    window.addEventListener(DESIGN_IDEAS_UPDATE_EVENT, handleUpdate);

    // 4. Listen to storage events across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === DESIGN_IDEAS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const list = Array.isArray(parsed) ? parsed : parsed.categories;
          syncFromList(list);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      active = false;
      window.removeEventListener(DESIGN_IDEAS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [initialCategory.slug]);

  return category;
}
