"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Project } from "@/lib/cms";

interface ProjectCardProps {
  project: Project;
  idPrefix?: string;
}

export default function ProjectCard({ project, idPrefix = "project-card" }: ProjectCardProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : [project.image || "/images/hero-luxury.jpg"];

  // Automatic gentle image transition when project has multiple photos
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveImgIdx((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div
      className="project-card"
      id={`${idPrefix}-${project.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Clean Project Image Viewport (non-clickable) */}
      <div
        className="project-card__image-wrap"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 10",
          overflow: "hidden",
          background: "#161311",
          borderRadius: "9px",
          touchAction: "pan-y",
          WebkitUserSelect: "none",
          userSelect: "none",
          cursor: "default",
        }}
      >
        {/* Top-Left Category Badge */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 3,
            background: "rgba(20, 18, 16, 0.82)",
            WebkitBackdropFilter: "blur(6px)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(212, 184, 122, 0.5)",
            color: "#E5D2A4",
            padding: "3.5px 10px",
            borderRadius: "50px",
            fontFamily: "var(--font-sans)",
            fontSize: "9.5px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {project.category}
        </div>

        {/* Horizontal Sliding Track */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            transform: `translateX(-${activeImgIdx * 100}%)`,
            transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {images.map((imgSrc, i) => (
            <div
              key={i}
              style={{
                minWidth: "100%",
                width: "100%",
                height: "100%",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <img
                src={imgSrc}
                alt={`${project.title} - Image ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>

        {/* Indicator Dots (when project has multiple photos) */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              zIndex: 3,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {images.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeImgIdx ? "16px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === activeImgIdx ? "#D4B87A" : "rgba(255, 255, 255, 0.45)",
                  transition: "all 0.25s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Details */}
      <div className="project-card__info" style={{ paddingTop: "14px" }}>
        <div className="project-card__category">{project.category}</div>
        <div
          className="project-card__title"
          style={{
            fontSize: "17px",
            fontWeight: 500,
            lineHeight: 1.35,
            margin: "4px 0 6px",
          }}
        >
          {project.title}
        </div>
        <div className="project-card__meta">
          {project.location} · {project.area}
        </div>
        <div className="project-card__btn-wrap">
          <Link
            href={`/portfolio/${project.slug}`}
            className="project-card__btn"
            id={`${idPrefix}-btn-${project.id}`}
            style={{ textDecoration: "none" }}
          >
            Explore Project <ChevronRight size={13} style={{ marginLeft: "4px" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
