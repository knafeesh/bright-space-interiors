import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Interior Design Services & Turnkey Solutions",
  description:
    "Explore our complete interior design and turnkey execution services across Delhi NCR — Residential, Commercial, Turnkey Projects, Modular Kitchens, Civil & Renovation, and 3D Visualisation.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Interior Design Services & Turnkey Solutions | Bright Space Interiors",
    description:
      "Explore our complete interior design and turnkey execution services across Delhi NCR — Residential, Commercial, Turnkey Projects, Modular Kitchens, Civil & Renovation, and 3D Visualisation.",
    url: "https://www.brightspaceinterior.in/services",
    images: [
      {
        url: "https://www.brightspaceinterior.in/images/salon-rawls-mainhall.jpg",
        width: 1200,
        height: 630,
        alt: "Bright Space Interiors Services Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Design Services & Turnkey Solutions | Bright Space Interiors",
    description:
      "Explore our complete interior design and turnkey execution services across Delhi NCR — Residential, Commercial, Turnkey Projects, Modular Kitchens, Civil & Renovation, and 3D Visualisation.",
    images: ["https://www.brightspaceinterior.in/images/salon-rawls-mainhall.jpg"],
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
