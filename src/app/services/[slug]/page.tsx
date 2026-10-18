import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/data";
import ServiceDetailClient from "./ServiceDetailClient";
import { constructMetadata } from "@/lib/metadata";

export async function generateStaticParams() {
  return [
    { slug: "residential" },
    { slug: "commercial" },
    { slug: "turnkey" },
    { slug: "design-execution" },
  ];
}

const SERVICE_META: Record<
  string,
  { title: string; description: string; ogImage: string }
> = {
  residential: {
    title: "Residential Interior Design & Home Renovation",
    description:
      "Full-home residential interior design for apartments, villas, and builder floors across Delhi NCR. Bespoke layouts, premium materials, and flawless move-in handover.",
    ogImage: "/images/gurugram-manish-living-mirror-wall.jpg",
  },
  commercial: {
    title: "Commercial Interior Design & Office Fitouts",
    description:
      "Turnkey commercial interior design for corporate offices, retail spaces, and luxury salons across Delhi NCR and Gurugram, built around your brand and workflow.",
    ogImage: "/images/office-gurugram-open-floor.jpg",
  },
  turnkey: {
    title: "Turnkey Interior Design & Project Execution",
    description:
      "End-to-end turnkey interior solutions in Delhi NCR. Single contract, one team, zero vendor coordination — civil, electrical, modular, and luxury finishes.",
    ogImage: "/images/salon-rawls-mainhall.jpg",
  },
  "design-execution": {
    title: "Design & 3D Visualisation Services",
    description:
      "Architectural drawings, realistic 3D photorealistic visualization, and precision execution planning for residential and commercial interiors in Delhi NCR.",
    ogImage: "/images/design-philosophy/philosophy-3.jpg",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};

  const meta = SERVICE_META[slug] || {
    title: `${service.title} | Luxury Interior Design`,
    description: service.description,
    ogImage: service.image,
  };

  return constructMetadata({
    path: `/services/${slug}`,
    title: meta.title,
    description: meta.description,
    image: meta.ogImage,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return <ServiceDetailClient slug={slug} />;
}
