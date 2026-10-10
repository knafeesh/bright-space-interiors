"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

export interface DesignIdea {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  slug?: string;
}

export const DESIGN_IDEAS: DesignIdea[] = [
  {
    id: "modern-living-room",
    title: "Modern Living Room",
    category: "Living Space",
    image: "/images/hero-luxury.jpg",
    alt: "Modern luxury living room interior with contemporary aesthetic",
    slug: "living-room-designs",
  },
  {
    id: "luxury-bedroom",
    title: "Luxury Bedroom",
    category: "Master Suite",
    image: "/images/res-bedroom.jpg",
    alt: "Luxury bedroom with bespoke panelling and warm ambient illumination",
    slug: "master-bedroom-designs",
  },
  {
    id: "modular-kitchen",
    title: "Modular Kitchen",
    category: "Kitchen & Culinary",
    image: "/images/kitchen-delhi-ncr-modern-lshape.jpg",
    alt: "Modern modular L-shaped luxury kitchen with integrated lighting",
    slug: "modular-kitchen-designs",
  },
  {
    id: "elegant-dining-room",
    title: "Elegant Dining Room",
    category: "Dining Suite",
    image: "/images/ranchi-agarwal-dining-hall.jpg",
    alt: "Elegant dining room interior with designer lighting and luxury furnishings",
    slug: "dining-room-designs",
  },
  {
    id: "contemporary-living-room",
    title: "Contemporary Living Room",
    category: "Living Space",
    image: "/images/gurugram-manish-fluted-wall-console.jpg",
    alt: "Contemporary living room with fluted wall panel and suspended console",
    slug: "living-room-designs",
  },
  {
    id: "luxury-bathroom",
    title: "Luxury Bathroom",
    category: "Bath Suite",
    image: "/images/res-bathroom.jpg",
    alt: "Luxury marble-clad modern bathroom with backlit vanity",
    slug: "bathroom-designs",
  },
  {
    id: "modern-wardrobe",
    title: "Modern Wardrobe",
    category: "Walk-in & Storage",
    image: "/images/modular-wardrobe.jpg",
    alt: "Custom modern modular wardrobe with fluted panels and warm lighting",
    slug: "wardrobe-designs",
  },
  {
    id: "premium-home-office",
    title: "Premium Home Office",
    category: "Executive Workspace",
    image: "/images/office-gurugram-executive-cabin.jpg",
    alt: "Premium executive home office and study cabin with skyline views",
    slug: "office-interiors",
  },
];

// Repeat 4 times for a seamless, glitch-free infinite continuous loop
const MARQUEE_ITEMS = [
  ...DESIGN_IDEAS,
  ...DESIGN_IDEAS,
  ...DESIGN_IDEAS,
  ...DESIGN_IDEAS,
];

export default function DesignIdeasSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const dragDistance = useRef(0);
  const posRef = useRef(0);
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimeout.current) {
      clearTimeout(resumeTimeout.current);
      resumeTimeout.current = null;
    }
  }, []);

  const resumeAfterDelay = useCallback(
    (delayMs = 2000) => {
      clearResumeTimer();
      resumeTimeout.current = setTimeout(() => {
        isInteracting.current = false;
      }, delayMs);
    },
    [clearResumeTimer]
  );

  const pauseInteraction = useCallback(() => {
    isInteracting.current = true;
    clearResumeTimer();
  }, [clearResumeTimer]);

  useEffect(() => {
    setMounted(true);
    const track = scrollRef.current;
    if (!track) return;

    // Center in the second set on mount
    const initTimer = setTimeout(() => {
      if (!track) return;
      const setWidth = track.scrollWidth / 4;
      if (track.scrollLeft === 0 && setWidth > 0) {
        track.scrollLeft = setWidth;
        posRef.current = setWidth;
      }
    }, 120);

    let animId: number;
    const speed = 0.65; // ~39px/sec: smooth, elegant, and comfortable to view

    const step = () => {
      if (track && !isInteracting.current) {
        posRef.current += speed;
        const setWidth = track.scrollWidth / 4;
        if (setWidth > 0) {
          if (posRef.current >= setWidth * 2) {
            posRef.current -= setWidth;
          } else if (posRef.current <= 0) {
            posRef.current += setWidth;
          }
          track.scrollLeft = posRef.current;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      clearTimeout(initTimer);
      cancelAnimationFrame(animId);
      clearResumeTimer();
    };
  }, [clearResumeTimer]);

  // Handle native touch scroll and wrap-around buffer check
  const handleScroll = () => {
    const track = scrollRef.current;
    if (!track) return;

    if (isInteracting.current) {
      posRef.current = track.scrollLeft;
    }

    const setWidth = track.scrollWidth / 4;
    if (setWidth > 0) {
      if (track.scrollLeft >= setWidth * 2.8) {
        track.scrollLeft -= setWidth;
        posRef.current = track.scrollLeft;
      } else if (track.scrollLeft < setWidth * 0.4) {
        track.scrollLeft += setWidth;
        posRef.current = track.scrollLeft;
      }
    }
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const track = scrollRef.current;
    if (!track) return;
    pauseInteraction();
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = track.scrollLeft;
    dragDistance.current = 0;
    track.style.cursor = "grabbing";
    track.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const track = scrollRef.current;
    if (!track) return;
    e.preventDefault();
    const diff = e.pageX - startX.current;
    dragDistance.current = Math.abs(diff);
    track.scrollLeft = scrollStart.current - diff;
    posRef.current = track.scrollLeft;
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      const track = scrollRef.current;
      if (track) {
        track.style.cursor = "grab";
        track.style.removeProperty("user-select");
      }
      resumeAfterDelay(2000);
    }
  };

  // Hover Handlers
  const handleMouseEnter = () => {
    isHovered.current = true;
    pauseInteraction();
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    if (isDragging.current) {
      isDragging.current = false;
      const track = scrollRef.current;
      if (track) {
        track.style.cursor = "grab";
        track.style.removeProperty("user-select");
      }
    }
    resumeAfterDelay(1200);
  };

  // Touch Handlers
  const handleTouchStart = () => {
    pauseInteraction();
    dragDistance.current = 0;
  };

  const handleTouchEnd = () => {
    resumeAfterDelay(2200);
  };

  // Arrow Navigation
  const handleArrowScroll = (direction: "left" | "right") => {
    const track = scrollRef.current;
    if (!track) return;
    pauseInteraction();
    const scrollAmount = Math.max(track.clientWidth * 0.72, 280);
    track.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
    resumeAfterDelay(2600);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If the user was dragging the carousel, cancel click navigation
    if (dragDistance.current > 7) {
      e.preventDefault();
    }
  };

  return (
    <section
      className="design-ideas-section section"
      id="design-ideas"
      aria-label="Design Ideas and Inspiration"
      style={{
        padding: "85px 0 95px",
        background: "var(--ivory, #FAF7F2)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        borderTop: "1px solid rgba(216, 208, 196, 0.5)",
        borderBottom: "1px solid rgba(216, 208, 196, 0.5)",
      }}
    >
      <div className="container" style={{ position: "relative" }}>
        {/* Section Header */}
        <div className="section-title--center" style={{ marginBottom: "32px" }}>
          <span
            className="eyebrow"
            style={{
              color: "var(--gold-dark, #8C7148)",
              letterSpacing: "0.22em",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "8px",
            }}
          >
            Inspiration Gallery
          </span>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(26px, 3.4vw, 38px)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--charcoal, #1C1C1C)",
              textTransform: "uppercase",
              margin: "0 0 14px",
            }}
          >
            DESIGN IDEAS
          </h2>
          <div className="title-line--center title-line" />
          <p
            style={{
              textAlign: "center",
              maxWidth: "680px",
              margin: "16px auto 0",
              fontSize: "clamp(14px, 1.1vw, 16px)",
              lineHeight: 1.6,
              color: "var(--charcoal-muted, #666059)",
              letterSpacing: "0.015em",
            }}
          >
            “Explore inspiring designs to enhance every corner of your home.”
          </p>
        </div>

        {/* Top Controls Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            padding: "0 4px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--gold-dark, #8C7148)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--gold, #B8975A)",
                boxShadow: "0 0 8px rgba(184, 151, 90, 0.7)",
              }}
            />
            <span>Auto-Scrolling Inspiration • Drag or Swipe</span>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => handleArrowScroll("left")}
              aria-label="Previous Design Idea"
              className="design-ideas-arrow-btn"
              type="button"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleArrowScroll("right")}
              aria-label="Next Design Idea"
              className="design-ideas-arrow-btn"
              type="button"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track Container (Bleeds naturally to viewport edges with internal margins) */}
      <div
        className="design-ideas-track-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Left & Right Soft Edge Fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "36px",
            background:
              "linear-gradient(to right, var(--ivory, #FAF7F2), rgba(250, 247, 242, 0))",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "36px",
            background:
              "linear-gradient(to left, var(--ivory, #FAF7F2), rgba(250, 247, 242, 0))",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Scrollable Carousel Track */}
        <div
          ref={scrollRef}
          className="design-ideas-carousel"
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleScroll}
          onTouchEnd={handleTouchEnd}
        >
          {MARQUEE_ITEMS.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={item.slug ? `/design-ideas/${item.slug}` : "/design-ideas"}
              onClick={handleCardClick}
              className="design-idea-card"
              aria-label={`View ${item.title}`}
            >
              {/* Image Frame */}
              <div className="design-idea-card__media">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading={index < 8 ? "eager" : "lazy"}
                  draggable={false}
                  className="design-idea-card__img"
                />

                {/* Subtle bottom gradient on the image */}
                <div className="design-idea-card__gradient" />

                {/* Corner luxury accent badge */}
                <div className="design-idea-card__arrow-badge">
                  <ArrowUpRight size={13} />
                </div>

                {/* Design title displayed over the lower part of the image */}
                <div className="design-idea-card__content">
                  <span className="design-idea-card__category">
                    {item.category}
                  </span>
                  <h3 className="design-idea-card__title">{item.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Explore All 32 Categories Link */}
      <div style={{ textAlign: "center", marginTop: "32px", padding: "0 20px" }}>
        <Link
          href="/design-ideas"
          className="btn btn--outline"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 600,
            padding: "11px 26px",
          }}
        >
          <span>Explore All 32 Design Categories</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </section>
  );
}
