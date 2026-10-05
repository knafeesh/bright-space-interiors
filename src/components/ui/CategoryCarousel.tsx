"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  projectSlug?: string;
}

export interface CategoryData {
  title: string;
  subtitle: string;
  defaultProjectSlug: string;
  slides: CarouselSlide[];
}

export const CATEGORY_CAROUSELS: Record<string, CategoryData> = {
  office: {
    title: "Corporate Workspaces & Offices",
    subtitle: "Turnkey Commercial Office Interiors",
    defaultProjectSlug: "gurugram-corporate-office",
    slides: [
      {
        id: "off-1",
        image: "/images/office-gurugram-open-floor.jpg",
        title: "Open Workspace & Collaborative Desking",
        subtitle: "Gurugram Corporate Office",
        projectSlug: "gurugram-corporate-office",
      },
      {
        id: "off-2",
        image: "/images/office-gurugram-workstations-lighting.jpg",
        title: "Suspended Geometric LED Profiles & Team Pods",
        subtitle: "Gurugram Corporate Office",
        projectSlug: "gurugram-corporate-office",
      },
      {
        id: "off-3",
        image: "/images/office-gurugram-executive-cabin.jpg",
        title: "Executive Director Cabin & Skyline View",
        subtitle: "Gurugram Corporate Office",
        projectSlug: "gurugram-corporate-office",
      },
      {
        id: "off-4",
        image: "/images/com-office.jpg",
        title: "Modern Executive Workspace & Acoustic Partitions",
        subtitle: "Atelier Corporate Office",
        projectSlug: "gurugram-corporate-office",
      },
      {
        id: "off-5",
        image: "/images/office-gurugram-conference-room.jpg",
        title: "Boardroom & Video-Conferencing Suite",
        subtitle: "Gurugram Corporate Office",
        projectSlug: "gurugram-corporate-office",
      },
    ],
  },
  salon: {
    title: "Luxury Salons & Academies",
    subtitle: "Turnkey High-End Beauty Spaces",
    defaultProjectSlug: "rawls-salon-luxury",
    slides: [
      {
        id: "sal-1",
        image: "/images/salon-rawls-reception.jpg",
        title: "Client Reception & Illuminated 3D Shield Crest",
        subtitle: "Rawls Luxury Salon",
        projectSlug: "rawls-salon-luxury",
      },
      {
        id: "sal-2",
        image: "/images/real-salon-facade.jpg",
        title: "Grand Double-Height Glass Facade & Floral Arches",
        subtitle: "The Hair Palace London",
        projectSlug: "the-hair-palace-london",
      },
      {
        id: "sal-3",
        image: "/images/salon-rawls-mainhall.jpg",
        title: "Grand Styling Hall & Arched Mirrors",
        subtitle: "Rawls Luxury Salon",
        projectSlug: "rawls-salon-luxury",
      },
      {
        id: "sal-4",
        image: "/images/salon-rawls-styling-suites.jpg",
        title: "VIP Styling Stations & Cognac Leather Chairs",
        subtitle: "Rawls Luxury Salon",
        projectSlug: "rawls-salon-luxury",
      },
      {
        id: "sal-5",
        image: "/images/real-salon-chesterfield.jpg",
        title: "VIP Chesterfield Waiting Lounge & Halo Lighting",
        subtitle: "The Hair Palace London",
        projectSlug: "the-hair-palace-london",
      },
    ],
  },
  hotel: {
    title: "Luxury Hotels & Hospitality",
    subtitle: "Five-Star Suites, Lobbies & Fine Dining",
    defaultProjectSlug: "gurugram-corporate-office",
    slides: [
      {
        id: "hot-1",
        image: "/images/project-hotel.jpg",
        title: "Executive Luxury Hotel Suite",
        subtitle: "Grand Horizon Hotel",
        projectSlug: "the-hair-palace-london",
      },
      {
        id: "hot-2",
        image: "/images/com-hotel.jpg",
        title: "Boutique Hospitality Room & Ambient Lighting",
        subtitle: "The Grand Suites",
        projectSlug: "the-hair-palace-london",
      },
      {
        id: "hot-3",
        image: "/images/com-lobby.jpg",
        title: "Grand Hotel Lobby & Atrium Welcome",
        subtitle: "Boutique Hotel Delhi NCR",
        projectSlug: "the-hair-palace-london",
      },
      {
        id: "hot-4",
        image: "/images/hero-luxury.jpg",
        title: "Presidential Lounge & Statement Architecture",
        subtitle: "Luxury Hospitality",
        projectSlug: "the-hair-palace-london",
      },
      {
        id: "hot-5",
        image: "/images/com-restaurant.jpg",
        title: "Fine Dining Restaurant & Bar Lounge",
        subtitle: "Hotel Restaurant & Lounge",
        projectSlug: "the-hair-palace-london",
      },
    ],
  },
};

interface CategoryCarouselProps {
  category: "office" | "salon" | "hotel" | string;
}

export default function CategoryCarousel({ category }: CategoryCarouselProps) {
  const normalizedKey = category.toLowerCase().trim();
  const data = CATEGORY_CAROUSELS[normalizedKey];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // If category not supported, return null
  if (!data || !data.slides || data.slides.length === 0) {
    return null;
  }

  const total = data.slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleDotClick = (idx: number) => {
    setCurrentIdx(idx);
    pauseAndScheduleResume();
  };

  const handlePrev = () => {
    prevSlide();
    pauseAndScheduleResume();
  };

  const handleNext = () => {
    nextSlide();
    pauseAndScheduleResume();
  };

  // Pause on manual interaction and automatically resume after 4 seconds
  const pauseAndScheduleResume = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // 3-second auto-slide interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  // Reset to first slide if category changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [category]);

  const currentSlide = data.slides[currentIdx];

  return (
    <div
      style={{
        marginBottom: "45px",
        width: "100%",
      }}
      id={`category-carousel-${normalizedKey}`}
      aria-label={`${data.title} Image Carousel`}
    >
      {/* ── Carousel Viewport Frame ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(280px, 46vw, 520px)",
          borderRadius: "6px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          background: "#0D0B0A",
          boxShadow: "0 18px 45px rgba(0, 0, 0, 0.35)",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {/* Horizontal Smooth Slide Track */}
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            transform: `translateX(-${currentIdx * 100}%)`,
            transition: "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {data.slides.map((slide, idx) => (
            <div
              key={slide.id}
              style={{
                minWidth: "100%",
                width: "100%",
                height: "100%",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                loading={idx === 0 ? "eager" : "lazy"}
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

        {/* Minimal Bottom Vignette Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(12, 10, 9, 0.88) 0%, rgba(12, 10, 9, 0.35) 24%, transparent 50%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Top-Right Floating Slide Counter */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "18px",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            color: "#D4B87A",
            padding: "5px 14px",
            borderRadius: "50px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            zIndex: 4,
          }}
        >
          0{currentIdx + 1} / 0{total}
        </div>

        {/* Bottom Clean Caption & Quick Link */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            padding: "24px 28px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
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
              {currentSlide.subtitle}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(18px, 2.2vw, 28px)",
                color: "#FFFFFF",
                fontWeight: 500,
                letterSpacing: "0.02em",
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {currentSlide.title}
            </h3>
          </div>

          {currentSlide.projectSlug && (
            <Link
              href={`/portfolio/${currentSlide.projectSlug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(184, 151, 98, 0.9)",
                color: "#FFFFFF",
                padding: "8px 18px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderRadius: "2px",
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              View Project
              <ArrowRight size={13} />
            </Link>
          )}
        </div>

        {/* Left Arrow for Manual Control */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(8px)",
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
          <ChevronLeft size={22} />
        </button>

        {/* Right Arrow for Manual Control */}
        <button
          onClick={handleNext}
          aria-label="Next slide"
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(8px)",
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
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ── Small Navigation Dots Below the Image ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginTop: "16px",
        }}
        role="tablist"
        aria-label="Carousel navigation dots"
      >
        {data.slides.map((slide, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={slide.id}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              aria-selected={isActive}
              role="tab"
              style={{
                height: "8px",
                width: isActive ? "28px" : "8px",
                borderRadius: "4px",
                background: isActive ? "#D4B87A" : "rgba(255, 255, 255, 0.25)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
