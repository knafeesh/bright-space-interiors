import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data";
import { getProjectFromDbBySlug, getProjectsFromDb } from "@/lib/server/portfolio-db";
import type { Metadata } from "next";
import ProjectDetailClient from "./ProjectDetailClient";
import { Project } from "@/lib/cms";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjectFromDbBySlug(slug)) || PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: `${project.title} | The Bright Space Interiors`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image }],
    },
  };
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
