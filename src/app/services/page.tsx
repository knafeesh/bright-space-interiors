import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import { getSpecialties } from "@/lib/server/site-db";
import { constructMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = constructMetadata({
  path: "/services",
  title: "Interior Design Services & Turnkey Solutions",
  description:
    "Explore our complete interior design and turnkey execution services across Delhi NCR — Residential, Commercial, Turnkey Projects, Modular Kitchens, Civil & Renovation, and 3D Visualisation.",
  image: "/images/salon-rawls-mainhall.jpg",
});

export default async function ServicesPage() {
  const specialties = await getSpecialties();
  return <ServicesClient initialSpecialties={specialties as any} />;
}
