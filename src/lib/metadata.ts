import type { Metadata } from "next";

export const SITE_URL = "https://www.brightspaceinterior.in";
export const BRAND_NAME = "Bright Space Interiors";

export interface PageMetadataInput {
  path: string;
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Clean path to ensure:
 * - no query string
 * - no hash
 * - no trailing slash (unless root "/")
 * - leading slash preserved
 */
export function cleanCanonicalPath(path: string): string {
  if (!path) return "/";
  const withoutQuery = path.split("?")[0].split("#")[0];
  const trimmed = withoutQuery.trim();
  if (trimmed === "" || trimmed === "/") return "/";
  const noTrailing = trimmed.replace(/\/+$/, "");
  return noTrailing.startsWith("/") ? noTrailing : `/${noTrailing}`;
}

export function getCanonicalUrl(path: string): string {
  const clean = cleanCanonicalPath(path);
  if (clean === "/") {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${clean}`;
}

export function constructMetadata({
  path,
  title,
  description,
  image = "/logo.png",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;

  const formattedOgTitle = title
    ? `${title} | ${BRAND_NAME}`
    : `${BRAND_NAME} | Luxury Interior Design & Turnkey Execution`;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: formattedOgTitle,
      ...(description ? { description } : {}),
      url: canonicalUrl,
      images: [
        {
          url: fullImageUrl,
          alt: title || BRAND_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: formattedOgTitle,
      ...(description ? { description } : {}),
      images: [fullImageUrl],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}
