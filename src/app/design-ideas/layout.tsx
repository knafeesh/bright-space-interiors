import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...constructMetadata({
    path: "/design-ideas",
    title: "Interior Design Ideas",
    description:
      "Explore 32 curated interior design categories by Bright Space Interiors. Discover ideas for living room, kitchen, bedroom, and commercial spaces in Delhi NCR.",
  }),
  title: {
    default: "Interior Design Ideas",
    template: "%s | Bright Space Interiors",
  },
};

export default function DesignIdeasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
