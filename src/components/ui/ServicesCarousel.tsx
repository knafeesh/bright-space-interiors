"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// ── Shared Services Carousel Items ──────────────────────────────────────────
// Keep the image paths in this array so they can be easily modified later.
export interface ServiceCarouselItem {
  title: string;
  slug: string;
  image: string;
  href: string;
  description: string;
}

export const SERVICE_CAROUSEL_ITEMS: ServiceCarouselItem[] = [
  {
    title: "Residential Interior",
    slug: "residential",
    image: "/images/gurugram-manish-living-mirror-wall.jpg",
    href: "/services/residential",
    description:
      "Full-home interiors for apartments, villas and builder floors, from floor plan to move-in.",
  },
  {
    title: "Modular Kitchen & Wardrobes",
    slug: "modular-kitchen-wardrobes",
    image: "/images/kitchen-delhi-ncr-modern-lshape.jpg",
    href: "/services#specialty",
    description:
      "Custom-fit kitchens and storage built around your layout and budget.",
  },
  {
    title: "Commercial Interior",
    slug: "commercial",
    image: "/images/office-gurugram-open-floor.jpg",
    href: "/services/commercial",
    description:
      "Offices, salons and retail spaces shaped around your brand and daily workflow.",
  },
  {
    title: "Civil & Renovation",
    slug: "civil-renovation",
    image: "/images/sushant-lok-vdeliver-grand-hall-cove.jpg",
    href: "/services#specialty",
    description:
      "Masonry, flooring, waterproofing and painting to make an older space feel new.",
  },
  {
    title: "Turnkey Projects",
    slug: "turnkey",
    image: "/images/salon-rawls-mainhall.jpg",
    href: "/services/turnkey",
    description:
      "Design, civil and interiors under one team and one contract.",
  },
  {
    title: "Design & 3D Visualisation",
    slug: "design-execution",
    image: "/images/design-philosophy/philosophy-3.jpg",
    href: "/services/design-execution",
    description:
      "Detailed drawings and realistic 3D views, so you see the result before work begins.",
  },
];

interface ServicesCarouselProps {
  showDetails?: boolean;
  controls?: "arrows" | "progress";
  showHeader?: boolean;
}

export default function ServicesCarousel({
  showDetails = false,
  controls = "arrows",
  showHeader = true,
}: ServicesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Drag interaction refs for desktop
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Scroll boundary state for "<" and ">" buttons
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Progress metrics state for progress bar (when controls === "progress")
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidthRatio, setThumbWidthRatio] = useState(0.5);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Boundary check with 2px tolerance
    setCanScrollPrev(scrollLeft > 2);
    setCanScrollNext(scrollLeft < maxScroll - 2);

    // Update progress bar metrics if enabled
    if (controls === "progress") {
      if (maxScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
      } else {
        setScrollProgress(0);
      }
      if (track.scrollWidth > 0) {
        const ratio = track.clientWidth / track.scrollWidth;
        setThumbWidthRatio(Math.min(1, Math.max(0.16, ratio)));
      }
    }
  }, [controls]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // Button navigation: scroll by exactly one card (card width + gap)
  const scrollByCard = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const slide = track.querySelector<HTMLDivElement>(
      ".services-carousel-slide"
    );
    if (!slide) return;

    const slideWidth = slide.offsetWidth;
    const computedGap =
      parseInt(window.getComputedStyle(track).gap || "24", 10) || 24;
    const step = slideWidth + computedGap;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    track.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  // Click on progress bar jumps directly to that position
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const bar = progressBarRef.current;
    if (!track || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.min(1, Math.max(0, clickX / rect.width));

    const maxScroll = track.scrollWidth - track.clientWidth;
    const targetScroll = clickRatio * maxScroll;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    track.scrollTo({
      left: targetScroll,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  // Keyboard navigation on progress bar slider
  const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const slide = track.querySelector<HTMLDivElement>(
      ".services-carousel-slide"
    );
    const step = slide ? slide.offsetWidth : 300;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      track.scrollBy({
        left: -step,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      track.scrollBy({
        left: step,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    }
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - track.offsetLeft;
    scrollLeftRef.current = track.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const x = e.pageX - track.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }

    track.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Handle card click: smooth scroll to #specialty if on /services, prevent click if user dragged
  const handleCardClick = (
    e: React.MouseEvent,
    service: ServiceCarouselItem
  ) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      return;
    }

    if (service.href.includes("#specialty")) {
      const specialtySection = document.getElementById("specialty");
      if (specialtySection) {
        e.preventDefault();
        const prefersReduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        specialtySection.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
        });
        window.history.pushState(null, "", "#specialty");
      }
    }
  };

  return (
    <section
      className="services-carousel-section"
      aria-label="Our services"
    >
      <div className="container services-carousel-container">
        {/* ── Section Header Row (Home Page) ── */}
        {showHeader && (
          <div className="services-carousel-header">
            <div>
              <span className="eyebrow" style={{ display: "block", marginBottom: "8px" }}>
                What we do
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 500,
                  letterSpacing: "0.03em",
                  margin: 0,
                  color: "var(--charcoal)",
                  lineHeight: 1.15,
                }}
              >
                Interiors from concept
                <br />
                to handover
              </h2>
            </div>
            <Link
              href="/services"
              id="home-services-all-link"
              className="services-carousel-all-link"
            >
              All services <ArrowUpRight size={14} aria-hidden="true" style={{ marginLeft: "4px" }} />
            </Link>
          </div>
        )}

        {/* ── Carousel Track ── */}
        <div
          ref={trackRef}
          className="services-carousel-track"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {SERVICE_CAROUSEL_ITEMS.map((service, index) => (
            <div
              key={service.slug}
              className="services-carousel-slide"
              id={`service-slide-${service.slug}`}
            >
              {/* ── Portrait Photo Card (Aspect Ratio 3:4) ── */}
              <Link
                href={service.href}
                className="services-carousel-card"
                aria-label={`${service.title} - View service details`}
                onClick={(e) => handleCardClick(e, service)}
              >
                <img
                  src={service.image}
                  alt={`${service.title} interior design by Bright Space Interiors`}
                  loading={index === 0 ? "eager" : "lazy"}
                  width={600}
                  height={800}
                  className="services-carousel-card-img"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0";
                  }}
                />

                {/* Dark Gradient Overlay (transparent to 75% black, covering lower 45-50%) */}
                <div className="services-carousel-card-overlay" />

                {/* Service title: bottom-left, large, white, uppercase, light weight */}
                <span className="services-carousel-card-title">
                  {service.title}
                </span>

                {/* Circular up-right arrow bottom-right (44x44px, thin white outline) */}
                <div
                  className="services-carousel-arrow-btn"
                  aria-hidden="true"
                >
                  <ArrowUpRight size={20} strokeWidth={1.75} />
                </div>
              </Link>

              {/* ── Details Block Below Each Card (when showDetails is true) ── */}
              {showDetails && (
                <div className="services-carousel-details">
                  <h3 className="services-carousel-detail-title">
                    {service.title}
                  </h3>
                  <p className="services-carousel-detail-desc">
                    {service.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Navigation Controls: "<" and ">" Buttons ── */}
        {controls === "arrows" && (
          <div className="services-carousel-nav">
            <button
              type="button"
              className="services-carousel-nav-btn"
              onClick={() => scrollByCard("prev")}
              disabled={!canScrollPrev}
              aria-label="Previous service"
              id="services-carousel-prev"
            >
              {/* Simple chevron left inline SVG */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="services-carousel-nav-btn"
              onClick={() => scrollByCard("next")}
              disabled={!canScrollNext}
              aria-label="Next service"
              id="services-carousel-next"
            >
              {/* Simple chevron right inline SVG */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Progress Bar Slider (when controls === "progress") ── */}
        {controls === "progress" && (
          <div className="services-carousel-progress-wrap">
            <div
              ref={progressBarRef}
              className="services-carousel-progress-bar"
              onClick={handleProgressBarClick}
              onKeyDown={handleProgressKeyDown}
              role="slider"
              aria-label="Services carousel navigation slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(scrollProgress * 100)}
              tabIndex={0}
            >
              <div
                className="services-carousel-progress-thumb"
                style={{
                  width: `${thumbWidthRatio * 100}%`,
                  transform: `translateX(${
                    scrollProgress *
                    ((1 - thumbWidthRatio) / thumbWidthRatio) *
                    100
                  }%)`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
