"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/data";

export interface OfficeSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  stage: string;
  description: string;
  details: string[];
}

export const OFFICE_SLIDES: OfficeSlide[] = [
  {
    id: "slide-1",
    image: "/images/office-gurugram-open-floor.jpg",
    title: "Gurugram Corporate Office — Open Floor & Collaborative Workstations",
    subtitle: "High-Density Linear Desking, Acoustic Glazing & Exposed Industrial Ceiling",
    stage: "Open Workspace Floor",
    description:
      "Expansive open-plan corporate floorplate in Gurugram featuring suspended acoustic dome pendant lights, central spinal circulation corridor, frameless glass executive cabins, and ergonomic modular desking systems.",
    details: ["Acoustic Red Pendants", "Frameless Glass Cabins", "Spinal Walkway Corridor", "Exposed HVAC Ducting"],
  },
  {
    id: "slide-2",
    image: "/images/office-gurugram-workstations-lighting.jpg",
    title: "Geometric Suspended LED Profile Lighting & Team Pods",
    subtitle: "Vibrant Ochre Acoustic Partition Screens & Ribbon Glazing",
    stage: "Team Collaboration Pods",
    description:
      "Custom modular team pods highlighted by architecturally suspended square LED frame fixtures, dual-tone acoustic privacy baffles, perimeter ribbon windows, and concealed power raceways.",
    details: ["Suspended Square LED Fixtures", "Acoustic Partition Screens", "Exposed Dark Ceiling", "Integrated Power Modules"],
  },
  {
    id: "slide-3",
    image: "/images/office-gurugram-executive-cabin.jpg",
    title: "Director's Executive Suite & Panoramic Window Cabin",
    subtitle: "L-Shaped Oak Veneer Executive Desk & Integrated Storage Credenza",
    stage: "Executive Director Cabin",
    description:
      "Corner managerial cabin with floor-to-ceiling panoramic skyline views, bespoke L-shaped executive desk with cable grommets, full-height architectural panelled storage credenza, and sound-insulated double glazing.",
    details: ["Corner Skyline View", "L-Shaped Executive Desk", "Full-Height Storage Wall", "Acoustic Double Glazing"],
  },
  {
    id: "slide-4",
    image: "/images/office-gurugram-conference-room.jpg",
    title: "Boardroom & Video-Conferencing Suite Fitout",
    subtitle: "Custom Heavy-Duty Steel Leg Conference Table & Glass Enclosure",
    stage: "Boardroom & Conference",
    description:
      "State-of-the-art conference room engineered with a custom 12-seater timber and powder-coated steel meeting table with integrated audio-visual floor raceways and acoustic perimeter glass partition.",
    details: ["12-Seater Board Table", "Integrated Floor Raceways", "Acoustic Glass Envelope", "Cable-Managed Steel Base"],
  },
  {
    id: "slide-5",
    image: "/images/office-gurugram-modular-desks.jpg",
    title: "Turnkey Desk Assembly & Precision Cable Management",
    subtitle: "Heavy-Gauge Steel Frame Understructure & Dual-Sided Wire Trays",
    stage: "Fitout & Modular Joinery",
    description:
      "Precision on-site assembly of commercial workstation clusters with dual cable distribution trays, modular power distribution junction boxes, upholstered acoustic dividers, and floor protection.",
    details: ["Heavy-Gauge Steel Frames", "Dual Wire Trays", "Acoustic Fabric Dividers", "Turnkey Site Delivery"],
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
        marginBottom: "50px",
        borderRadius: "4px",
        overflow: "hidden",
        border: "1px solid rgba(184, 151, 98, 0.3)",
        background: "#181513",
        boxShadow: "0 16px 45px rgba(24, 21, 19, 0.18)",
        color: "#FFFFFF",
      }}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      id="office-showcase-slideshow"
    >
      {/* ── Slide Viewport ── */}
      <div
        style={{
          position: "relative",
          minHeight: "480px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Background Images with Slow Cross-Fade */}
        {OFFICE_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: idx === currentIdx ? 1 : 0,
              visibility: idx === currentIdx ? "visible" : "hidden",
              transition: "opacity 1.2s ease-in-out, visibility 1.2s ease-in-out",
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
                transform: idx === currentIdx ? "scale(1.03)" : "scale(1)",
                transition: "transform 6s ease-out",
                filter: "brightness(0.82)",
              }}
            />
          </div>
        ))}

        {/* Gradient Overlay for Readable Typography */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(16, 13, 11, 0.95) 0%, rgba(16, 13, 11, 0.6) 45%, rgba(16, 13, 11, 0.25) 100%), linear-gradient(to right, rgba(16, 13, 11, 0.75) 0%, transparent 60%)",
            zIndex: 2,
          }}
        />

        {/* Top Control Bar: Stage Badge + Counter + Play/Pause */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "24px",
            right: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 3,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(184, 151, 98, 0.4)",
              color: "#D4B87A",
              padding: "6px 14px",
              borderRadius: "50px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <Briefcase size={13} />
            {current.stage}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "4px 12px",
              borderRadius: "50px",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#D4B87A", letterSpacing: "0.08em" }}>
              0{currentIdx + 1} / 0{OFFICE_SLIDES.length}
            </span>
            <div style={{ width: "1px", height: "14px", background: "rgba(255, 255, 255, 0.2)" }} />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause slow slide" : "Play slow slide"}
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
        </div>

        {/* Content on Slide */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            padding: "36px 32px 28px",
            maxWidth: "850px",
          }}
        >
          <div
            style={{
              color: "#D4B87A",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            {current.subtitle}
          </div>

          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(24px, 3.2vw, 38px)",
              color: "#FFFFFF",
              fontWeight: 500,
              letterSpacing: "0.03em",
              margin: "0 0 12px",
              lineHeight: 1.25,
            }}
          >
            {current.title}
          </h3>

          <p
            style={{
              fontSize: "clamp(13px, 1.3vw, 15px)",
              lineHeight: 1.65,
              color: "rgba(250, 247, 242, 0.85)",
              maxWidth: "680px",
              margin: "0 0 18px",
            }}
          >
            {current.description}
          </p>

          {/* Key Specifications Chips */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {current.details.map((detail) => (
              <span
                key={detail}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#FAF7F2",
                  fontSize: "11px",
                  padding: "4px 10px",
                  borderRadius: "2px",
                }}
              >
                <CheckCircle2 size={11} color="#D4B87A" />
                {detail}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/portfolio/gurugram-corporate-office"
              className="btn"
              style={{
                background: "#B89762",
                color: "#FFFFFF",
                padding: "10px 22px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "2px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Explore Office Project
              <ArrowRight size={13} />
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                "Hello The Bright Space Interiors, I saw the Gurugram Corporate Office slideshow on your website and would like to discuss interior fitout for my office space."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#FAF7F2",
                padding: "10px 20px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                borderRadius: "2px",
              }}
            >
              Consult On WhatsApp
            </a>
          </div>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "42px",
            height: "42px",
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
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "42px",
            height: "42px",
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
          <ChevronRight size={22} />
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

      {/* ── 5 Thumbnail Strip for Quick Navigation ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          background: "#120F0D",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {OFFICE_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 16px",
                background: isActive ? "rgba(184, 151, 98, 0.12)" : "transparent",
                border: "none",
                borderRight: idx < OFFICE_SLIDES.length - 1 ? "1px solid rgba(255, 255, 255, 0.06)" : "none",
                borderBottom: isActive ? "2px solid #D4B87A" : "2px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.25s ease",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "36px",
                  borderRadius: "2px",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: isActive ? "1px solid #D4B87A" : "1px solid rgba(255, 255, 255, 0.2)",
                  opacity: isActive ? 1 : 0.65,
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.stage}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ overflow: "hidden", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: isActive ? "#D4B87A" : "rgba(255, 255, 255, 0.5)",
                    marginBottom: "2px",
                  }}
                >
                  {slide.stage}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: isActive ? "#FAF7F2" : "rgba(255, 255, 255, 0.75)",
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {slide.title.split("—")[0]}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
