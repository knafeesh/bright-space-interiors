"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // Mouse tracking for desktop drag & click
  const mouseStartX = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isMouseDragging = useRef(false);

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
  };

  // Reset to first slide if category changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [category]);

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (total <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (total <= 1 || touchStartX.current === null) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (total <= 1 || touchStartX.current === null) return;

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

      if (Math.abs(diffX) > 35 && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        return;
      }

      if (Math.abs(diffX) < 10 && diffY < 10) {
        nextSlide();
        return;
      }
    } else {
      nextSlide();
    }
  };

  // Desktop Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || total <= 1) return;
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

    if (total <= 1) return;

    if (wasDragging && Math.abs(diffX) > 35 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else if (!wasDragging && Math.abs(diffX) < 10 && diffY < 10) {
      nextSlide();
    }
  };

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
      {/* ── Carousel Viewport Frame (User controlled: click or swipe to change) ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(280px, 46vw, 520px)",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1.5px solid rgba(184, 151, 90, 0.35)",
          background: "#0D0B0A",
          boxShadow: "0 18px 45px rgba(0, 0, 0, 0.25)",
          cursor: total > 1 ? "pointer" : "default",
          touchAction: "pan-y",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        title={total > 1 ? "Click or swipe to view next image" : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
            pointerEvents: "none",
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
                draggable={false}
                loading={idx === 0 ? "eager" : "lazy"}
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
            pointerEvents: "none",
          }}
        >
          0{currentIdx + 1} / 0{total}
        </div>

        {/* Bottom Clean Caption */}
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
            pointerEvents: "none",
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
        </div>
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
              type="button"
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
