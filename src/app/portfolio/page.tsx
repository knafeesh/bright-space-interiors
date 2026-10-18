import { getProjectsFromDb } from "@/lib/server/portfolio-db";
import { PROJECTS } from "@/lib/data";
import PortfolioClient from "./PortfolioClient";
import type { Metadata } from "next";

import { constructMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = constructMetadata({
  path: "/portfolio",
  title: "Portfolio",
  description:
    "Explore our bespoke interior design and turnkey execution portfolio across Delhi NCR, Gurugram, and pan-India.",
});

export default async function PortfolioPage() {
  const initialProjects = await getProjectsFromDb().catch(() => PROJECTS);
  return <PortfolioClient initialProjects={initialProjects} />;
}
