"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Award, ShieldCheck } from "lucide-react";

interface ClientItem {
  id: string;
  name: string;
  category: string;
  shortCode: string;
  badgeBg: string;
  badgeColor: string;
  accentBorder: string;
  tag: string;
}

const CLIENTS: ClientItem[] = [
  {
    id: "rapsus",
    name: "Rapsus Technologies Pvt. Ltd.",
    category: "Technology & Software",
    shortCode: "RT",
    badgeBg: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    badgeColor: "#60A5FA",
    accentBorder: "rgba(96, 165, 250, 0.3)",
    tag: "Corporate Tech",
  },
  {
    id: "ibs",
    name: "IBS",
    category: "Enterprise Systems & IT",
    shortCode: "IBS",
    badgeBg: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)",
    badgeColor: "#A78BFA",
    accentBorder: "rgba(167, 139, 250, 0.3)",
    tag: "Enterprise IT",
  },
  {
    id: "unitech",
    name: "Unitech",
    category: "Real Estate & Infrastructure",
    shortCode: "UT",
    badgeBg: "linear-gradient(135deg, #2A2118 0%, #17120E 100%)",
    badgeColor: "#F59E0B",
    accentBorder: "rgba(245, 158, 11, 0.3)",
    tag: "Infrastructure",
  },
  {
    id: "look-salon",
    name: "Look Salon",
    category: "Luxury Salon Chain",
    shortCode: "LS",
    badgeBg: "linear-gradient(135deg, #2E1065 0%, #17072B 100%)",
    badgeColor: "#E879F9",
    accentBorder: "rgba(232, 121, 249, 0.3)",
    tag: "Luxury Salon",
  },
  {
    id: "msv-group",
    name: "MSV Group of Companies",
    category: "Corporate Conglomerate",
    shortCode: "MSV",
    badgeBg: "linear-gradient(135deg, #18181B 0%, #09090B 100%)",
    badgeColor: "#E4E4E7",
    accentBorder: "rgba(228, 228, 231, 0.3)",
    tag: "Conglomerate",
  },
  {
    id: "idea",
    name: "Idea",
    category: "Telecommunications",
    shortCode: "IDEA",
    badgeBg: "linear-gradient(135deg, #312E81 0%, #1E1B4B 100%)",
    badgeColor: "#FBBF24",
    accentBorder: "rgba(251, 191, 36, 0.3)",
    tag: "Telecom",
  },
  {
    id: "vdeliver",
    name: "Vdeliver.online",
    category: "Commercial Kitchens & E-Commerce",
    shortCode: "VD",
    badgeBg: "linear-gradient(135deg, #064E3B 0%, #022C22 100%)",
    badgeColor: "#34D399",
    accentBorder: "rgba(52, 211, 153, 0.3)",
    tag: "Commercial Culinary",
  },
  {
    id: "geetanjali-studio",
    name: "Geetanjali Studio",
    category: "Premium Hair & Beauty",
    shortCode: "GS",
    badgeBg: "linear-gradient(135deg, #2C1810 0%, #180D08 100%)",
    badgeColor: "#F59E0B",
    accentBorder: "rgba(245, 158, 11, 0.3)",
    tag: "Beauty Studio",
  },
  {
    id: "hairplace-london",
    name: "The Hairplace.London Luxury Salon",
    category: "European Flagship Salon & Academy",
    shortCode: "HL",
    badgeBg: "linear-gradient(135deg, #241E15 0%, #14100B 100%)",
    badgeColor: "#D4AF37",
    accentBorder: "rgba(212, 175, 55, 0.4)",
    tag: "Luxury Salon",
  },
];

// Repeat list 4 times for infinite seamless loop without jump
const MARQUEE_CLIENTS = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

export default function ClientListSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const resumeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start in the middle so bidirectional dragging always has buffer
    const halfWidth = el.scrollWidth / 2;
    if (el.scrollLeft === 0) {
      el.scrollLeft = halfWidth / 2;
    }

    let animationFrameId: number;
    const speed = 0.65; // ~39px per second, elegant luxury pace

    const step = () => {
      if (el && !isHovered.current && !isDragging.current) {
        el.scrollLeft += speed;

        const loopBound = el.scrollWidth / 2;
        if (el.scrollLeft >= loopBound) {
          el.scrollLeft -= loopBound / 2;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += loopBound / 2;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  // Manual arrow controls
  const handleScrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -320, behavior: "smooth" });
    pauseTemporarily();
  };

  const handleScrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: 320, behavior: "smooth" });
    pauseTemporarily();
  };

  const pauseTemporarily = () => {
    isHovered.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      isHovered.current = false;
    }, 2500);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollStart.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    el.scrollLeft = scrollStart.current - walk;
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      pauseTemporarily();
    }
  };

  // Touch Handlers
  const handleTouchStart = () => {
    isDragging.current = true;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    pauseTemporarily();
  };

  return (
    <section
      className="clients-group-section section"
      id="clients-group-list"
      aria-label="Our Group and Client List"
      style={{
        padding: "90px 0 100px",
        background: "var(--ivory)",
        borderTop: "1px solid rgba(216, 208, 196, 0.4)",
        borderBottom: "1px solid rgba(216, 208, 196, 0.4)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-title--center" style={{ marginBottom: "45px" }}>
          <span
            className="eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              letterSpacing: "0.18em",
            }}
          >
            <ShieldCheck size={14} style={{ color: "var(--gold)" }} />
            TRUSTED BY INDUSTRY LEADERS
          </span>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontFamily: "var(--font-serif)",
              color: "var(--charcoal)",
              marginTop: "8px",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            OUR GROUP / CLIENT LIST
          </h2>
          <div className="title-line--center title-line" />
          <p
            style={{
              textAlign: "center",
              maxWidth: "680px",
              margin: "14px auto 0",
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Proudly delivering turnkey architectural, interior, and civil execution for India’s premier enterprises, luxury retail brands, and corporate groups.
          </p>
        </div>
      </div>

      {/* Carousel Container with Gradient Masks & Navigation Controls */}
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "10px 0",
        }}
        onMouseEnter={() => {
          isHovered.current = true;
        }}
        onMouseLeave={() => {
          isHovered.current = false;
        }}
      >
        {/* Left Gradient Edge Fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: "clamp(40px, 10vw, 120px)",
            background: "linear-gradient(to right, var(--ivory) 20%, rgba(248, 244, 236, 0) 100%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Right Gradient Edge Fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "clamp(40px, 10vw, 120px)",
            background: "linear-gradient(to left, var(--ivory) 20%, rgba(248, 244, 236, 0) 100%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Left Arrow Button */}
        <button
          onClick={handleScrollLeft}
          aria-label="Scroll clients left"
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            color: "var(--charcoal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 5,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleScrollRight}
          aria-label="Scroll clients right"
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
            color: "var(--charcoal)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 5,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          <ChevronRight size={18} />
        </button>

        {/* Scrollable / Draggable Track */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            display: "flex",
            gap: "22px",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "16px 40px",
            cursor: isDragging.current ? "grabbing" : "grab",
            userSelect: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {MARQUEE_CLIENTS.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="client-card"
              style={{
                flex: "0 0 290px",
                width: "290px",
                background: "var(--white)",
                borderRadius: "8px",
                padding: "24px 22px",
                border: "1px solid rgba(216, 208, 196, 0.7)",
                boxShadow: "0 4px 18px rgba(28, 28, 28, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px",
                transition: "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "var(--gold)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(184, 151, 90, 0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(216, 208, 196, 0.7)";
                e.currentTarget.style.boxShadow = "0 4px 18px rgba(28, 28, 28, 0.04)";
              }}
            >
              {/* Header with Monogram Emblem and Sector Pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                {/* Monogram Badge */}
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: client.badgeBg,
                    border: `1px solid ${client.accentBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: client.badgeColor,
                    fontWeight: 700,
                    fontSize: client.shortCode.length > 3 ? "11px" : "13px",
                    letterSpacing: "0.05em",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                    flexShrink: 0,
                  }}
                >
                  {client.shortCode}
                </div>

                {/* Sector / Industry Pill */}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--bronze)",
                    background: "rgba(184, 151, 90, 0.1)",
                    border: "1px solid rgba(184, 151, 90, 0.2)",
                    padding: "3px 9px",
                    borderRadius: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {client.tag}
                </span>
              </div>

              {/* Company Name */}
              <div style={{ flexGrow: 1 }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "var(--font-sans)",
                    color: "var(--charcoal)",
                    lineHeight: 1.35,
                    marginBottom: "4px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {client.name}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {client.category}
                </p>
              </div>

              {/* Verified Execution Status Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  paddingTop: "10px",
                  borderTop: "1px solid rgba(216, 208, 196, 0.45)",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--gold)",
                  }}
                />
                <span>Turnkey Fitout & Civil Client</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Trust Stat Bar */}
      <div className="container" style={{ marginTop: "36px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(20px, 4vw, 48px)",
            flexWrap: "wrap",
            padding: "16px 24px",
            background: "rgba(255, 255, 255, 0.55)",
            backdropFilter: "blur(6px)",
            borderRadius: "6px",
            border: "1px solid rgba(216, 208, 196, 0.6)",
            maxWidth: "760px",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--charcoal)" }}>
            <Award size={15} style={{ color: "var(--gold)" }} />
            <span style={{ fontWeight: 600 }}>50+ Turnkey Deliveries</span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--charcoal)" }}>
            <Building2 size={15} style={{ color: "var(--gold)" }} />
            <span style={{ fontWeight: 600 }}>Commercial, Salon & Residential</span>
          </div>
          <div style={{ width: "1px", height: "16px", background: "var(--border)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--charcoal)" }}>
            <ShieldCheck size={15} style={{ color: "var(--gold)" }} />
            <span style={{ fontWeight: 600 }}>100% On-Time Handover</span>
          </div>
        </div>
      </div>
    </section>
  );
}
