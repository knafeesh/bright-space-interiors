"use client";

import { useState, useRef } from "react";
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

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // Mouse tracking for desktop drag & click
  const mouseStartX = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isMouseDragging = useRef(false);

  // Navigate to next image
  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  // Navigate to previous image
  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (images.length <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (images.length <= 1 || touchStartX.current === null) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (images.length <= 1 || touchStartX.current === null) return;

    const startX = touchStartX.current;
    const startY = touchStartY.current ?? 0;
    const endX = touchEndX.current;
    const endY = touchEndY.current;

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;

    if (endX !== null && endY !== null) {
      const diffX = startX - endX;
      const diffY = Math.abs(startY - endY);

      // Horizontal swipe threshold: 35px and more horizontal than vertical
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
          // Swiped left -> next image
          nextImage();
        } else {
          // Swiped right -> previous image
          prevImage();
        }
        return;
      }

      // Tap if movement is minimal
      if (Math.abs(diffX) < 10 && diffY < 10) {
        nextImage();
        return;
      }
    } else {
      // Touch and release without move -> Tap to next image
      nextImage();
    }
  };

  // Desktop Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || images.length <= 1) return;
    mouseStartX.current = e.clientX;
    mouseStartY.current = e.clientY;
    isMouseDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const diffX = Math.abs(e.clientX - mouseStartX.current);
    const diffY = Math.abs(e.clientY - (mouseStartY.current ?? e.clientY));
    if (diffX > 8 && diffX > diffY) {
      isMouseDragging.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const diffX = mouseStartX.current - e.clientX;
    const diffY = Math.abs((mouseStartY.current ?? e.clientY) - e.clientY);
    const wasDragging = isMouseDragging.current;

    mouseStartX.current = null;
    mouseStartY.current = null;
    isMouseDragging.current = false;

    if (images.length <= 1) return;

    if (wasDragging && Math.abs(diffX) > 35 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        // Dragged left -> next image
        nextImage();
      } else {
        // Dragged right -> previous image
        prevImage();
      }
    } else if (!wasDragging && Math.abs(diffX) < 10 && diffY < 10) {
      // Click without drag -> next image
      nextImage();
    }
  };

  const handleDotClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx(idx);
  };

  return (
    <div
      className="project-card"
      id={`${idPrefix}-${project.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        cursor: "default",
      }}
    >
      {/* Clean User-Controlled Project Image Viewport (Does NOT open project) */}
      <div
        className="project-card__image-wrap"
        title={images.length > 1 ? "Click or swipe to view next image" : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
          cursor: images.length > 1 ? "pointer" : "default",
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
            pointerEvents: "none",
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
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            </div>
          ))}
        </div>

        {/* Manual Indicator Dots (when project has multiple photos) */}
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
            }}
            aria-hidden="true"
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => handleDotClick(i, e)}
                aria-label={`Go to image ${i + 1}`}
                style={{
                  width: i === activeImgIdx ? "16px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: i === activeImgIdx ? "#D4B87A" : "rgba(255, 255, 255, 0.45)",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  cursor: "pointer",
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
