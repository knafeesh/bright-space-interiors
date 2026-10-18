import type { MetadataRoute } from "next";
import { getAllCategoriesFromDb } from "@/lib/server/design-ideas-db";
import { DESIGN_CATEGORIES } from "@/lib/design-ideas-data";
import { getProjectsFromDb } from "@/lib/server/portfolio-db";
import { PROJECTS, SERVICES } from "@/lib/data";

const BASE_URL = "https://www.brightspaceinterior.in";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getAllCategoriesFromDb().catch(() => DESIGN_CATEGORIES);
  const projects = await getProjectsFromDb().catch(() => PROJECTS);

  // 1. Core Overview Pages (7)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: "2026-10-10",
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: "2026-10-07",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: "2026-10-07",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: "2026-10-07",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/process`,
      lastModified: "2026-10-07",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: "2026-10-07",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/design-ideas`,
      lastModified: "2026-10-10",
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // 2. Primary Service Categories (4)
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: "2026-10-07",
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 3. Portfolio Project Showcases (12)
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/portfolio/${project.slug}`,
    lastModified: "2026-10-07",
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 4. Design Ideas Categories (32)
  const designIdeaRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/design-ideas/${category.slug}`,
    lastModified: "2026-10-10",
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 5. Legal & Policy Pages (2)
  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: "2026-10-07",
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: "2026-10-07",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...designIdeaRoutes,
    ...legalRoutes,
  ];
}
