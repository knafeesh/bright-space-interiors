"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Project } from "@/lib/cms";

interface ProjectCardProps {
  project: Project;
  idPrefix?: string;
}

export default function ProjectCard({ project, idPrefix = "project-card" }: ProjectCardProps) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);

  const images =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : [project.image || "/images/hero-luxury.jpg"];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };

  const handleDot = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImgIdx(idx);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    // horizontal swipe threshold: 35px
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        // Swiped Left -> Next image
        setActiveImgIdx((prev) => (prev + 1) % images.length);
      } else {
        // Swiped Right -> Prev image
        setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX.current !== null) {
      if (Math.abs(e.clientX - mouseStartX.current) > 8) {
        isDragging.current = true;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current !== null) {
      const diff = mouseStartX.current - e.clientX;
      if (Math.abs(diff) > 35) {
        e.preventDefault();
        e.stopPropagation();
        if (diff > 0) {
          setActiveImgIdx((prev) => (prev + 1) % images.length);
        } else {
          setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    }
    mouseStartX.current = null;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="project-card"
      id={`${idPrefix}-${project.id}`}
      onClick={(e) => {
        if (isDragging.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Horizontal Swipe Image Viewport */}
      <div
        className="project-card__image-wrap"
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/3",
          overflow: "hidden",
          background: "#161311",
          borderRadius: "4px",
          touchAction: "pan-y",
          userSelect: "none",
          cursor: isDragging.current ? "grabbing" : "pointer",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
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

        {/* Hover View Overlay */}
        <div className="project-card__overlay">
          <span className="project-card__view">View Project</span>
        </div>

        {/* Swipe Arrows & Indicator Dots (when project has multiple photos) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              style={{
                position: "absolute",
                left: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FAF7F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 4,
                transition: "background 0.2s ease, transform 0.2s ease",
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next photo"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#FAF7F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 4,
                transition: "background 0.2s ease, transform 0.2s ease",
              }}
            >
              <ChevronRight size={16} />
            </button>

            {/* Navigation Dots */}
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
                zIndex: 4,
              }}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => handleDot(i, e)}
                  aria-label={`Go to photo ${i + 1}`}
                  style={{
                    width: i === activeImgIdx ? "16px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background: i === activeImgIdx ? "#D4B87A" : "rgba(255, 255, 255, 0.45)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>
          </>
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
      </div>
    </Link>
  );
}
