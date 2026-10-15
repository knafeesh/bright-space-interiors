// ═══════════════════════════════════════════
// CANONICAL PROJECT CATEGORIES & FILTER LOGIC
// ═══════════════════════════════════════════

export const PROJECT_FILTER_TABS = [
  "ALL",
  "RESIDENTIAL",
  "MODULAR KITCHEN",
  "WARDROBES",
  "COMMERCIAL",
  "CIVIL & RENOVATION",
  "TURNKEY",
  "DESIGN & VISUALISATION",
] as const;

export type ProjectFilterCategory = (typeof PROJECT_FILTER_TABS)[number];

/**
 * Returns an array of uppercase category strings for a given project.
 * Uses `categories` array if available, falling back to `[category]`.
 */
export function getProjectCategories(project: {
  categories?: string[];
  category?: string;
}): string[] {
  if (Array.isArray(project.categories) && project.categories.length > 0) {
    return project.categories.map((c) => c.toUpperCase());
  }
  if (project.category) {
    return [project.category.toUpperCase()];
  }
  return [];
}

/**
 * Determines which filter tabs to display.
 * - "ALL" is always visible.
 * - A category tab is only visible if at least one project has that category.
 * - Tabs with 0 projects (e.g. WARDROBES, DESIGN & VISUALISATION) are automatically hidden
 *   until a project with that category is added.
 * - Preserves the exact canonical order.
 */
export function getVisibleFilterTabs(
  projects: Array<{ categories?: string[]; category?: string }>
): string[] {
  return PROJECT_FILTER_TABS.filter((tab) => {
    if (tab === "ALL") return true;
    return projects.some((p) => {
      const cats = getProjectCategories(p);
      return cats.includes(tab);
    });
  });
}
