import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  path: "/contact",
  title: "Contact Us",
  description:
    "Book a free design consultation with Bright Space Interiors. Call or WhatsApp for bespoke residential and commercial luxury interiors across Delhi NCR.",
});

export default function ContactPage() {
  return <ContactClient />;
}
