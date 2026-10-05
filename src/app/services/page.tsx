import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our interior design services — Residential, Commercial, Turnkey Projects, and Design & Execution. Premium quality, transparent pricing.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
