"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Existing project photos in specified order with exact alt text
const PHOTOS = [
  {
    src: "/images/design-philosophy/philosophy-1.jpg",
    alt: "Luxury foyer with marble staircase and golden lighting",
  },
  {
    src: "/images/design-philosophy/philosophy-2.jpg",
    alt: "Luxury modular kitchen with cream and gold finishes",
  },
  {
    src: "/images/design-philosophy/philosophy-3.jpg",
    alt: "Luxury living room with geometric TV wall and elegant furniture",
  },
  {
    src: "/images/design-philosophy/philosophy-4.jpg",
    alt: "Luxury master bedroom with warm lighting and a walk-in wardrobe",
  },
  {
    src: "/images/design-philosophy/philosophy-5.jpg",
    alt: "Luxury foyer and living area with an illuminated staircase",
  },
];

export default function DesignPhilosophyShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Single timer reference and pause control refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveredRef = useRef(false);
  const isTabHiddenRef = useRef(false);
  const isIntersectingRef = useRef(true);
  const lastTouchTimeRef = useRef(0);
  const programmaticScrollEndTimeRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

  // Smooth scroll carousel to target slide on mobile
  const scrollToSlide = useCallback((index: number) => {
    const container = mobileCarouselRef.current;
    const slide = slideRefs.current[index];
    if (!container || !slide) return;

    programmaticScrollEndTimeRef.current = Date.now() + 600;

    const targetLeft =
      slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2;

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotionRef.current ? "auto" : "smooth",
    });
  }, []);

  // Track touch/swipe interaction on phone (pauses auto-advance for 5 seconds)
  const handleTouchStart = () => {
    lastTouchTimeRef.current = Date.now();
  };

  const handleTouchMove = () => {
    lastTouchTimeRef.current = Date.now();
  };

  const handleTouchEnd = () => {
    lastTouchTimeRef.current = Date.now();
  };

  // Track scroll position to update dots and photo name during native swipe
  const handleScroll = useCallback(() => {
    // Ignore programmatic smooth scroll movements
    if (Date.now() < programmaticScrollEndTimeRef.current) return;

    const container = mobileCarouselRef.current;
    if (!container) return;

    // Mark active touch/swipe interaction
    lastTouchTimeRef.current = Date.now();

    const scrollLeft = container.scrollLeft;
    const containerCenter = scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    slideRefs.current.forEach((el, idx) => {
      if (!el) return;
      const slideCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(slideCenter - containerCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  }, [activeIndex]);

  // Single timer loop, visibility listener, intersection observer & reduced motion
  useEffect(() => {
    // 1. Reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleMediaChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
      if (e.matches) {
        setActiveIndex(0);
        scrollToSlide(0);
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // 2. Tab visibility change (pause when tab hidden)
    const handleVisibility = () => {
      isTabHiddenRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 3. Intersection observer (pause when section off-screen)
    const el = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersectingRef.current = entry.isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
    }

    // 4. Single timer loop
    const scheduleNext = () => {
      const isMobile = window.innerWidth < 768;
      // Desktop: 2.5s (2500ms); Phone: 3s (3000ms)
      const intervalMs = isMobile ? 3000 : 2500;

      timerRef.current = setTimeout(() => {
        const isPausedByMotion = prefersReducedMotionRef.current;
        const isPausedByTab = isTabHiddenRef.current;
        const isPausedByOffscreen = !isIntersectingRef.current;
        const isPausedByHover = isHoveredRef.current;
        // Pause auto-advance for 5 seconds after touch/swipe
        const isPausedByTouch = Date.now() - lastTouchTimeRef.current < 5000;

        if (
          !isPausedByMotion &&
          !isPausedByTab &&
          !isPausedByOffscreen &&
          !isPausedByHover &&
          !isPausedByTouch
        ) {
          setActiveIndex((prev) => {
            const next = (prev + 1) % PHOTOS.length;
            if (window.innerWidth < 768) {
              scrollToSlide(next);
            }
            return next;
          });
        }

        scheduleNext();
      }, intervalMs);
    };

    scheduleNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      mediaQuery.removeEventListener("change", handleMediaChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (observer) observer.disconnect();
    };
  }, [scrollToSlide]);

  return (
    <div
      ref={containerRef}
      className="philosophy-wrapper"
      role="region"
      aria-label="Our Design Philosophy gallery"
    >
      {/* Polite announcer for screen readers */}
      <div aria-live="polite" className="sr-only">
        {PHOTOS[activeIndex].alt}
      </div>

      {/* ══════════════ DESKTOP VIEW (>= 768px): 5 Panels, flex 4 vs flex 1 ══════════════ */}
      <div
        className="philosophy-desktop-stage"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
      >
        {PHOTOS.map((photo, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={photo.src}
              className={`philosophy-desktop-panel ${
                isActive ? "philosophy-desktop-panel--active" : ""
              }`}
              style={{
                flex: isActive ? 4 : 1,
              }}
              onMouseEnter={() => {
                isHoveredRef.current = true;
                setActiveIndex(i);
              }}
              tabIndex={0}
              onFocus={() => {
                isHoveredRef.current = true;
                setActiveIndex(i);
              }}
              onBlur={() => {
                isHoveredRef.current = false;
              }}
              role="button"
              aria-label={photo.alt}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={i === 0 ? "eager" : "lazy"}
                width={800}
                height={340}
                className="philosophy-panel-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
              {/* Luxury dark gradient overlay */}
              <div
                className="philosophy-panel-overlay"
                style={{
                  background: isActive
                    ? "linear-gradient(to top, rgba(20,15,12,0.82) 0%, rgba(20,15,12,0.20) 55%, transparent 100%)"
                    : "rgba(20,15,12,0.30)",
                }}
              />
              {/* Photo title badge inside active expanded panel */}
              <div
                className="philosophy-panel-caption"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateY(0)" : "translateY(8px)",
                }}
              >
                <span className="philosophy-panel-text">
                  {photo.alt}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════ PHONE VIEW (< 768px): 86% Width Horizontal Carousel ══════════════ */}
      <div className="philosophy-mobile-wrapper">
        <div
          ref={mobileCarouselRef}
          className="philosophy-mobile-carousel"
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {PHOTOS.map((photo, i) => (
            <div
              key={photo.src}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="philosophy-mobile-slide"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={i === 0 ? "eager" : "lazy"}
                width={400}
                height={500}
                className="philosophy-slide-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0";
                }}
              />
            </div>
          ))}
        </div>

        {/* Small non-clickable indicator dots and Photo Name */}
        <div className="philosophy-mobile-footer">
          <div className="philosophy-dots" aria-hidden="true">
            {PHOTOS.map((_, idx) => (
              <span
                key={idx}
                className={`philosophy-dot ${
                  idx === activeIndex ? "philosophy-dot--active" : ""
                }`}
              />
            ))}
          </div>
          <p className="philosophy-mobile-caption" aria-live="polite">
            {PHOTOS[activeIndex].alt}
          </p>
        </div>
      </div>
    </div>
  );
}
