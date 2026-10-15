"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";

// ── Configuration Constants ──────────────────────────────────────────────────
// "arch" is an upright semicircle (∩), "hanging" is an inverted one (∪).
// Switching the entire layout needs ONLY changing this single constant.
export const CURVE: "arch" | "hanging" = "arch";

// Five verified existing project photos
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

const PERIOD = 2.8; // Every 2.8s advances by exactly one photo
const MOVE_FRACTION = 0.34; // Move takes ~34% of the period (~0.952s)
const MOVE_DURATION = PERIOD * MOVE_FRACTION;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Ease-in-out cubic curve for organic, luxury deceleration into centre rest
function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export default function DesignPhilosophyCurvedStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stageWidth, setStageWidth] = useState(1080);
  const [isPlaying, setIsPlaying] = useState(true);
  const [centreAnnounce, setCentreAnnounce] = useState(PHOTOS[0].alt);

  // Interaction pause flags stored in refs so animation loop has instant access
  const isHoveredRef = useRef(false);
  const isFocusedRef = useRef(false);
  const isTouchedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const isIntersectingRef = useRef(true);
  const isPlayingRef = useRef(true);

  // Position and manual transition state
  const tRef = useRef(0);
  const accumulatorRef = useRef(0);
  const manualTargetRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const lastAnnouncedIdxRef = useRef<number>(-1);

  // Update isPlayingRef when state changes
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // ── Reduced Motion Preference & Initialization ─────────────────────────────
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      // Third photo (index 2) in centre, static arc with all 5 visible, no autoplay
      tRef.current = 2;
      accumulatorRef.current = 2 * PERIOD;
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCentreAnnounce(PHOTOS[2].alt);
      lastAnnouncedIdxRef.current = 2;
    }
  }, []);

  // ── Resize Observer for Stage Width ────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setStageWidth(w);
      }
    });
    ro.observe(el);
    setStageWidth(el.clientWidth || 1080);

    return () => ro.disconnect();
  }, []);

  // ── Intersection Observer: Pause off-screen ────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Page Visibility: Pause when tab is hidden ───────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
      if (document.hidden) {
        lastTimeRef.current = 0; // reset delta on return
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // ── Geometry Calculation Parameters ────────────────────────────────────────
  const m = CURVE === "arch" ? 1 : -1;
  const cy = CURVE === "arch" ? 265 : 60;
  const Ry = 190;
  const cx = stageWidth / 2;
  const Rx = Math.min(stageWidth * 0.4, 250);
  const isNarrow = stageWidth < 500;
  const cardW = isNarrow ? 84 : 110;
  const cardH = Math.round(cardW * 1.32);

  // ── Generate Thin Dashed SVG Curve ("String") ──────────────────────────────
  const svgSteps = 40;
  const pathDArray: string[] = [];
  for (let j = 0; j <= svgSteps; j++) {
    const sj = -2.6 + (5.2 * j) / svgSteps;
    const ang = Math.PI / 2 - sj * 0.55;
    const px = cx + Rx * Math.cos(ang);
    const py = cy - m * Ry * Math.sin(ang);
    pathDArray.push(`${j === 0 ? "M" : "L"} ${px.toFixed(2)} ${py.toFixed(2)}`);
  }
  const svgPathD = pathDArray.join(" ");

  // ── Render Card Styles (Transform & Opacity Only) ───────────────────────────
  const updateCardStyles = useCallback(
    (currentT: number) => {
      const activeIdx = Math.round(((currentT % 5) + 5) % 5);
      if (activeIdx !== lastAnnouncedIdxRef.current) {
        lastAnnouncedIdxRef.current = activeIdx;
        setCentreAnnounce(PHOTOS[activeIdx].alt);
      }

      PHOTOS.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;

        // Wrap offset s so loop is endless: range [-2.5, 2.5)
        let s = (((i - currentT) % 5) + 5) % 5;
        if (s >= 2.5) s -= 5;

        // Formula specification
        const angle = Math.PI / 2 - s * 0.55;
        const x = cx + Rx * Math.cos(angle);
        const y = cy - m * Ry * Math.sin(angle);
        const scale = Math.max(0.55, 1 - 0.17 * Math.abs(s));
        const rotationRad = m * s * 0.55;
        const rotDeg = rotationRad * (180 / Math.PI);
        const opacity = clamp(1 - (Math.abs(s) - 1.9) / 0.6, 0, 1);
        const zIndex = Math.round(100 - Math.abs(s) * 20);

        // Hardware accelerated transform only (no layout properties)
        el.style.transform = `translate3d(${(x - cardW / 2).toFixed(2)}px, ${(
          y -
          cardH / 2
        ).toFixed(2)}px, 0) rotate(${rotDeg.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = `${zIndex}`;

        // Subtle accent ring for centre card
        if (Math.abs(s) < 0.35) {
          el.style.boxShadow =
            "0 0 0 2.5px var(--gold, #B89762), 0 10px 28px rgba(184, 151, 98, 0.40)";
        } else {
          el.style.boxShadow = "0 4px 16px rgba(28, 24, 22, 0.14)";
        }
      });
    },
    [cx, cy, Rx, Ry, m, cardW, cardH]
  );

  // ── requestAnimationFrame Animation Loop ───────────────────────────────────
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Handle manual smooth animation to target step if triggered
      if (manualTargetRef.current !== null) {
        const target = manualTargetRef.current;
        const diff = target - tRef.current;
        if (Math.abs(diff) < 0.005) {
          tRef.current = target;
          manualTargetRef.current = null;
          accumulatorRef.current = target * PERIOD;
        } else {
          tRef.current += diff * Math.min(dt * 9, 0.3);
        }
        updateCardStyles(tRef.current);
      } else {
        // Automatic continuous loop
        const canAdvance =
          isPlayingRef.current &&
          !isHoveredRef.current &&
          !isFocusedRef.current &&
          !isTouchedRef.current &&
          isVisibleRef.current &&
          isIntersectingRef.current;

        if (canAdvance) {
          accumulatorRef.current += dt;
        }

        const acc = accumulatorRef.current;
        const k = Math.floor(acc / PERIOD);
        const remainder = acc - k * PERIOD;

        let computedT = k;
        if (remainder < MOVE_DURATION) {
          const p = remainder / MOVE_DURATION;
          computedT = k + easeInOutCubic(p);
        } else {
          computedT = k + 1; // Card rests completely stationary in the centre
        }

        tRef.current = computedT;
        updateCardStyles(computedT);
      }

      animId = requestAnimationFrame(tick);
      rafIdRef.current = animId;
    };

    animId = requestAnimationFrame(tick);
    rafIdRef.current = animId;

    return () => cancelAnimationFrame(animId);
  }, [updateCardStyles]);

  // ── Keyboard / Button Step Trigger ─────────────────────────────────────────
  const moveStep = useCallback((direction: 1 | -1) => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    const currentBase = Math.round(tRef.current);
    manualTargetRef.current = currentBase + direction;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveStep(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveStep(-1);
      }
    },
    [moveStep]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      isPlayingRef.current = next;
      if (next) {
        // Align accumulator to current position so movement resumes seamlessly
        accumulatorRef.current = Math.round(tRef.current) * PERIOD;
        manualTargetRef.current = null;
      }
      return next;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="curved-stage-container"
      role="region"
      aria-label="Our design philosophy gallery, use left and right arrow keys to navigate photos"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => {
        isHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false;
      }}
      onFocus={() => {
        isFocusedRef.current = true;
      }}
      onBlur={() => {
        isFocusedRef.current = false;
      }}
      onTouchStart={() => {
        isTouchedRef.current = true;
      }}
      onTouchEnd={() => {
        isTouchedRef.current = false;
      }}
      onTouchCancel={() => {
        isTouchedRef.current = false;
      }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1080px",
        height: "340px",
        margin: "0 auto",
        overflow: "hidden",
        borderRadius: "14px",
        background: "radial-gradient(ellipse at center, rgba(250,247,242,0.85) 0%, rgba(245,239,235,0.4) 100%)",
        border: "1px solid rgba(184, 151, 98, 0.15)",
        userSelect: "none",
        outline: "none",
      }}
    >
      {/* ── Screen Reader Announcement for Centre Photo ── */}
      <div
        aria-live="polite"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {centreAnnounce}
      </div>

      {/* ── Dashed String SVG Curve Behind Cards ── */}
      <svg
        width={stageWidth}
        height={340}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <path
          d={svgPathD}
          fill="none"
          stroke="rgba(184, 151, 98, 0.35)"
          strokeDasharray="5 5"
          strokeWidth="1.5"
        />
      </svg>

      {/* ── Absolutely Positioned Photo Cards ── */}
      {PHOTOS.map((photo, i) => (
        <div
          key={photo.src}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          tabIndex={-1}
          aria-hidden={true}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${cardW}px`,
            height: `${cardH}px`,
            borderRadius: "12px",
            overflow: "hidden",
            background: "var(--stone, #e8e4dc)",
            border: "1px solid rgba(184, 151, 98, 0.22)",
            willChange: "transform, opacity",
            pointerEvents: "none",
            transformOrigin: "center center",
          }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            loading={i === 0 ? "eager" : "lazy"}
            width={cardW}
            height={cardH}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ))}

      {/* ── Small Pause / Play Button in Site Style ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        aria-label={isPlaying ? "Pause design philosophy animation" : "Play design philosophy animation"}
        className="curved-stage-play-btn"
        style={{
          position: "absolute",
          bottom: "14px",
          right: "14px",
          zIndex: 120,
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid rgba(184, 151, 98, 0.40)",
          background: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(6px)",
          color: "var(--charcoal, #2C2420)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 10px rgba(28, 24, 22, 0.10)",
          transition: "all 0.2s ease",
          outline: "none",
        }}
      >
        {isPlaying ? (
          <Pause size={14} aria-hidden="true" />
        ) : (
          <Play size={14} aria-hidden="true" style={{ marginLeft: "1.5px" }} />
        )}
      </button>
    </div>
  );
}
