import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  path: "/contact",
  title: "Contact Us",
  description:
    "Book a free design consultation with Bright Space Interiors. Call or WhatsApp +91 98111 60129 for premium residential and commercial interiors in Delhi NCR.",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
