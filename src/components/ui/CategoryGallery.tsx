"use client";

import { DesignCategory } from "@/lib/design-ideas-data";
import { useSyncedCategory } from "@/lib/design-ideas-client";

interface Props {
  category: DesignCategory;
}

export default function CategoryGallery({ category: initialCategory }: Props) {
  const category = useSyncedCategory(initialCategory);

  return (
    <div className="design-gallery-grid">
      {category.designs.map((design, index) => (
        <article
          key={design.id}
          className="design-gallery-card"
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(28, 24, 22, 0.06)",
            border: "1px solid rgba(184, 151, 90, 0.16)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* One Design Image - Clean, unobstructed, no text overlay */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 11",
              overflow: "hidden",
              background: "var(--ivory-dark, #ECE6DE)",
            }}
          >
            <img
              src={design.image}
              alt={design.title}
              loading={index < 4 ? "eager" : "lazy"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.45s ease",
              }}
              className="design-gallery-card__img"
            />
          </div>

          {/* One Design Title Directly Below the Image */}
          <div
            style={{
              padding: "18px 22px 22px",
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              background: "#FFFFFF",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
                fontSize: "clamp(16px, 1.4vw, 19px)",
                fontWeight: 600,
                color: "var(--charcoal, #1C1C1C)",
                lineHeight: 1.35,
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              {design.title}
            </h3>
          </div>
        </article>
      ))}
    </div>
  );
}
