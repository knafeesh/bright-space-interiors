import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data";
import { getProjectFromDbBySlug } from "@/lib/server/portfolio-db";
import type { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";
import { Project } from "@/lib/cms";

import { constructMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const SHORT_PROJECT_TITLES: Record<string, string> = {
  "rawls-salon-luxury": "Rawls Salon Luxury",
  "gurugram-corporate-office": "Gurugram Corporate Office",
  "shri-ram-complex-v-deliver-sushant-lok": "Shri Ram Complex",
  "turnkey-modular-kitchens-delhi-ncr": "Bespoke Modular Kitchens NCR",
  "mr-manish-singh-home-gurugram": "Mr. Manish Singh's Home",
  "the-hair-palace-london": "The Hair Palace London",
  "hair-palace-salon-lounge": "L'Oréal & Kérastase Retail Lounge",
  "hair-palace-vip-pedispa": "Executive Waiting Suite & Pedispa",
  "hair-palace-royal-styling": "Royal Styling Stations & Suites",
  "bespoke-turnkey-modular-kitchen": "Saket Dual-Tone Modular Kitchen",
  "contemporary-turnkey-kitchen": "Contemporary Turnkey Kitchen",
  "agarwal-residence-ranchi": "Agarwal Family Turnkey Residence",
};

export function getShortProjectTitle(slug: string, fullTitle: string): string {
  if (SHORT_PROJECT_TITLES[slug]) {
    return SHORT_PROJECT_TITLES[slug];
  }
  const clean = fullTitle.replace(/\s*\|\s*(The\s+)?Bright Space Interiors.*$/i, "").trim();
  if (clean.length + 24 <= 60) {
    return clean;
  }
  if (clean.includes(" — ")) {
    const beforeDash = clean.split(" — ")[0].trim();
    if (beforeDash.length + 24 <= 60) {
      return beforeDash;
    }
  }
  return clean.slice(0, 36).trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjectFromDbBySlug(slug)) || PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    return constructMetadata({
      path: `/portfolio/${slug}`,
      title: "Portfolio",
    });
  }

  const shortTitle = getShortProjectTitle(slug, project.title);

  return constructMetadata({
    path: `/portfolio/${slug}`,
    title: shortTitle,
    description: project.description,
    image: project.image,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getProjectFromDbBySlug(slug)) || PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient initialProject={project as Project} slug={slug} />;
}
