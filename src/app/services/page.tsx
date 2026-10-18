import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  path: "/services",
  title: "Interior Design Services & Turnkey Solutions",
  description:
    "Explore our complete interior design and turnkey execution services across Delhi NCR — Residential, Commercial, Turnkey Projects, Modular Kitchens, Civil & Renovation, and 3D Visualisation.",
  image: "/images/salon-rawls-mainhall.jpg",
});

export default function ServicesPage() {
  return <ServicesClient />;
}
