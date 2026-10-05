"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
} from "lucide-react";

export interface OfficeSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
}

export const OFFICE_SLIDES: OfficeSlide[] = [
  {
    id: "slide-1",
    image: "/images/office-gurugram-open-floor.jpg",
    title: "Open Workspace & Collaborative Desking",
    subtitle: "Gurugram Corporate Office",
  },
  {
    id: "slide-2",
    image: "/images/office-gurugram-workstations-lighting.jpg",
    title: "Suspended Geometric LED Profiles & Team Pods",
    subtitle: "Gurugram Corporate Office",
  },
  {
    id: "slide-3",
    image: "/images/office-gurugram-executive-cabin.jpg",
    title: "Executive Director Cabin & Skyline View",
    subtitle: "Gurugram Corporate Office",
  },
  {
    id: "slide-4",
    image: "/images/office-gurugram-conference-room.jpg",
    title: "Boardroom & Video-Conferencing Suite",
    subtitle: "Gurugram Corporate Office",
  },
  {
    id: "slide-5",
    image: "/images/office-gurugram-modular-desks.jpg",
    title: "Turnkey Desk Assembly & Cable Management",
    subtitle: "Gurugram Corporate Office",
  },
];

export default function OfficeCategorySlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const slideDuration = 5500; // 5.5s slow slide
  const stepInterval = 50;

  // Auto-advance slow slider
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIdx((curr) => (curr + 1) % OFFICE_SLIDES.length);
          return 0;
        }
        return prev + (stepInterval / slideDuration) * 100;
      });
    }, stepInterval);

    return () => clearInterval(timer);
  }, [isPlaying, currentIdx]);

  const goToSlide = (index: number) => {
    setCurrentIdx(index);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % OFFICE_SLIDES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + OFFICE_SLIDES.length) % OFFICE_SLIDES.length);
    setProgress(0);
  };

  const current = OFFICE_SLIDES[currentIdx];

  return (
    <div
      style={{
        marginBottom: "45px",
        borderRadius: "6px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        background: "#0D0B0A",
        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.35)",
        color: "#FFFFFF",
      }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      id="office-showcase-slideshow"
    >
      {/* ── Slide Viewport: Clean, real-photo presentation ── */}
      <div
        style={{
          position: "relative",
          height: "520px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Background Images with Slow Cross-Fade & Natural Clarity */}
        {OFFICE_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: idx === currentIdx ? 1 : 0,
              visibility: idx === currentIdx ? "visible" : "hidden",
              transition: "opacity 1.1s ease-in-out, visibility 1.1s ease-in-out",
              zIndex: 1,
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transform: idx === currentIdx ? "scale(1.025)" : "scale(1)",
                transition: "transform 6s ease-out",
              }}
            />
          </div>
        ))}

        {/* Minimal Bottom Fade — keeps 80% of photo completely clear */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(12, 10, 9, 0.88) 0%, rgba(12, 10, 9, 0.4) 22%, transparent 48%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Top Floating Counter & Play/Pause */}
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            padding: "5px 14px",
            borderRadius: "50px",
            zIndex: 3,
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#D4B87A", letterSpacing: "0.08em" }}>
            0{currentIdx + 1} / 0{OFFICE_SLIDES.length}
          </span>
          <div style={{ width: "1px", height: "13px", background: "rgba(255, 255, 255, 0.2)" }} />
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause slide" : "Play slide"}
            style={{
              background: "transparent",
              border: "none",
              color: "#FAF7F2",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "2px",
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
        </div>

        {/* Clean Caption Overlay */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            padding: "28px 30px",
            width: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div>
            <div
              style={{
                color: "#D4B87A",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              {current.subtitle}
            </div>

            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(20px, 2.4vw, 30px)",
                color: "#FFFFFF",
                fontWeight: 500,
                letterSpacing: "0.02em",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {current.title}
            </h3>
          </div>

          <Link
            href="/portfolio/gurugram-corporate-office"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              background: "rgba(184, 151, 98, 0.9)",
              color: "#FFFFFF",
              padding: "9px 20px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: "2px",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
          >
            View Project Details
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#FAF7F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 4,
            transition: "all 0.2s ease",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#FAF7F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 4,
            transition: "all 0.2s ease",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── Continuous Slow Slide Progress Bar ── */}
      <div
        style={{
          width: "100%",
          height: "3px",
          background: "rgba(255, 255, 255, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #9A7A45, #D4B87A)",
            transition: isPlaying ? "width 0.05s linear" : "none",
          }}
        />
      </div>

      {/* ── 5 Pure Photo Thumbnails Navigation Strip ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          background: "#0E0C0B",
          padding: "10px 12px",
          gap: "8px",
        }}
      >
        {OFFICE_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              style={{
                position: "relative",
                height: "64px",
                borderRadius: "3px",
                overflow: "hidden",
                border: isActive ? "2px solid #D4B87A" : "1px solid rgba(255, 255, 255, 0.12)",
                opacity: isActive ? 1 : 0.6,
                cursor: "pointer",
                padding: 0,
                background: "transparent",
                transition: "all 0.25s ease",
              }}
              title={slide.title}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
