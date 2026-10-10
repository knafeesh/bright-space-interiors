import { getProjectsFromDb } from "@/lib/server/portfolio-db";
import { PROJECTS } from "@/lib/data";
import PortfolioClient from "./PortfolioClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Portfolio | The Bright Space Interiors",
  description:
    "Explore our bespoke interior design and turnkey execution portfolio across Delhi NCR, Gurugram, and pan-India.",
};

export default async function PortfolioPage() {
  const initialProjects = await getProjectsFromDb().catch(() => PROJECTS);
  return <PortfolioClient initialProjects={initialProjects} />;
}
