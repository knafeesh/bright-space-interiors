import type { MetadataRoute } from "next";
import {
  getPublishedCategories,
  getPublishedProjects,
  getDetailedServices,
} from "@/lib/server/site-db";

const BASE_URL = "https://www.brightspaceinterior.in";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, projects, services] = await Promise.all([
    getPublishedCategories(),
    getPublishedProjects(),
    getDetailedServices(),
  ]);

  const today = new Date().toISOString().split("T")[0];

  // 1. Core Overview Pages (7)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/process`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/design-ideas`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // 2. Primary Service Pages (Published only)
  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: today,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 3. Portfolio Project Showcases (Published only - drafts strictly excluded)
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.status === "published")
    .map((project) => ({
      url: `${BASE_URL}/portfolio/${project.slug}`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  // 4. Design Ideas Categories (Published only - drafts strictly excluded)
  const designIdeaRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.published !== false)
    .map((category) => ({
      url: `${BASE_URL}/design-ideas/${category.slug}`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // 5. Legal & Policy Pages (2)
  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-conditions`,
      lastModified: today,
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
