import { constructMetadata, getCanonicalUrl } from "@/lib/metadata";

export { constructMetadata, getCanonicalUrl };

interface PageHeadProps {
  path: string;
}

/**
 * Shared head component for rendering self-referencing canonical and og:url tags
 * when rendered directly into a page/layout.
 * Pass the page path into this shared head component so a new page gets the right canonical automatically.
 */
export default function PageHead({ path }: PageHeadProps) {
  const canonicalUrl = getCanonicalUrl(path);
  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />
    </>
  );
}
