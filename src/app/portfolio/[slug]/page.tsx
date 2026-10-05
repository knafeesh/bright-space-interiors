import { notFound } from "next/navigation";
import { PROJECTS } from "@/lib/data";
import type { Metadata } from "next";
import { use } from "react";
import ProjectDetailClient from "./ProjectDetailClient";
import { Project } from "@/lib/cms";

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return <ProjectDetailClient initialProject={project as Project} />;
}
