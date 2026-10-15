"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NAV_SERVICES, NavService } from "@/lib/data";

interface ServicesCarouselProps {
  showDetails?: boolean;
}

export default function ServicesCarousel({
  showDetails = false,
}: ServicesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Drag interaction refs for desktop
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Scroll progress state (0 to 1) and visible card ratio for thumb width
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidthRatio, setThumbWidthRatio] = useState(0.5); // Default desktop 3/6

  // Calculate thumb width ratio and update progress based on container size
  const updateMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollWidth = track.scrollWidth;
    const clientWidth = track.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll > 0) {
      const progress = track.scrollLeft / maxScroll;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    } else {
      setScrollProgress(0);
    }

    // Ratio of visible cards to total cards (determines thumb width)
    if (scrollWidth > 0) {
      const ratio = clientWidth / scrollWidth;
      setThumbWidthRatio(Math.min(1, Math.max(0.16, ratio)));
    }
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateMetrics();

    const handleScroll = () => {
      updateMetrics();
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateMetrics);

    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [updateMetrics]);

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
  const handleCardClick = (e: React.MouseEvent, service: NavService) => {
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
    <div
      className="services-carousel-wrapper"
      role="region"
      aria-label="Core Services Carousel"
    >
      {/* ── Carousel Track ── */}
      <div
        ref={trackRef}
        className="services-carousel-track"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {NAV_SERVICES.map((service, index) => (
          <div
            key={service.slug}
            className="services-carousel-slide"
            id={`service-slide-${service.slug}`}
          >
            {/* ── Portrait Photo Card (Aspect Ratio 3:4) ── */}
            <Link
              href={service.href}
              className="services-carousel-card"
              aria-label={`${service.title} - View details and portfolio`}
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

              {/* Dark Gradient Overlay */}
              <div className="services-carousel-card-overlay" />

              {/* White uppercase light-weight title bottom-left */}
              <span className="services-carousel-card-title">
                {service.title}
              </span>

              {/* Circular up-right arrow bottom-right */}
              <div
                className="services-carousel-arrow-btn"
                aria-hidden="true"
              >
                <ArrowUpRight size={20} strokeWidth={2} />
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

      {/* ── Interactive Progress Bar ── */}
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
                scrollProgress * ((1 - thumbWidthRatio) / thumbWidthRatio) * 100
              }%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
