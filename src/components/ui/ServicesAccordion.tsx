"use client";
import { useState, useId, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { NAV_SERVICES, WHATSAPP_NUMBER } from "@/lib/data";

// ── Arrow-up-right icon that lives in each row header ────────────────────────
function DiagonalArrow({ active }: { active: boolean }) {
  return (
    <ArrowUpRight
      size={18}
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transition: "transform 0.22s ease, opacity 0.22s ease",
        transform: active ? "translate(3px,-3px)" : "translate(0,0)",
        opacity: active ? 1 : 0.45,
        color: active ? "var(--gold)" : "var(--text-secondary)",
      }}
    />
  );
}

// ── Cross-fading photo panel (right column / top on mobile) ──────────────────
function PhotoPanel({
  activeIndex,
  id,
  services,
}: {
  activeIndex: number;
  id: string;
  services: any[];
}) {
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const currentService = services[activeIndex] || services[0];

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <div
        id={id}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 5",
          borderRadius: "12px",
          overflow: "hidden",
          background: "var(--stone, #e8e4dc)",
          flexShrink: 0,
        }}
      >
        {services.map((svc, i) => (
          <Link
            key={svc.slug || i}
            href={svc.href || svc.link || "/services"}
            tabIndex={i === activeIndex ? 0 : -1}
            aria-label={`View ${svc.title} project`}
            style={{
              position: i === 0 ? "relative" : "absolute",
              inset: 0,
              display: "block",
              width: "100%",
              height: "100%",
              textDecoration: "none",
            }}
          >
            <img
              src={svc.image}
              alt={svc.caption || svc.title}
              loading={i === 0 ? "eager" : "lazy"}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                opacity: i === activeIndex ? 1 : 0,
                transition: prefersReduced
                  ? "none"
                  : "opacity 0.25s ease",
                willChange: "opacity",
              }}
            />
          </Link>
        ))}
      </div>
      {/* Caption below photo */}
      <div
        aria-live="polite"
        style={{
          marginTop: "12px",
          padding: "2px 4px 0",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-sans)",
            display: "block",
            lineHeight: 1.4,
          }}
        >
          {currentService?.caption || currentService?.title}
        </span>
      </div>
    </div>
  );
}

// ── Main accordion component ─────────────────────────────────────────────────
export default function ServicesAccordion() {
  const [services, setServices] = useState(NAV_SERVICES);
  const [waNumber, setWaNumber] = useState(WHATSAPP_NUMBER);
  const [active, setActive] = useState(0);
  const baseId = useId();
  const photoId = `${baseId}-photo`;

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.store?.navServices && Array.isArray(data.store.navServices)) {
          const published = data.store.navServices.filter((s: any) => s.published !== false);
          if (published.length > 0) {
            setServices(
              published.map((s: any) => ({
                title: s.title,
                slug: s.slug,
                href: s.link || `/services`,
                description: s.description || "",
                image: s.image,
                caption: `${s.title} — Bright Space Interiors`,
              }))
            );
          }
        }
        if (data?.store?.settings?.whatsapp) {
          setWaNumber(data.store.settings.whatsapp.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  const activate = useCallback((i: number) => setActive(i), []);

  // Keyboard navigation on the list: up/down arrows move between rows
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (i + 1) % services.length;
        setActive(next);
        (
          document.getElementById(`${baseId}-btn-${next}`) as HTMLElement
        )?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev =
          (i - 1 + services.length) % services.length;
        setActive(prev);
        (
          document.getElementById(`${baseId}-btn-${prev}`) as HTMLElement
        )?.focus();
      }
    },
    [baseId, services.length]
  );

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      style={{
        background: "var(--cream, #F4EFEB)",
        padding: "clamp(60px, 8vw, 100px) 0",
        borderTop: "1px solid rgba(44,36,32,0.06)",
        borderBottom: "1px solid rgba(44,36,32,0.06)",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Section Header */}
        <div style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}>
          <span
            className="eyebrow"
            style={{
              display: "block",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--gold)",
              marginBottom: "8px",
            }}
          >
            What We Do
          </span>
          <h2
            id={`${baseId}-heading`}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "var(--charcoal)",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Our Services
          </h2>
          <div
            className="title-line"
            style={{ marginTop: "16px", marginBottom: 0 }}
          />
        </div>

        {/* Two-column layout: Left rows, Right photo */}
        <div
          className="services-split-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(24px, 4vw, 48px)",
            alignItems: "start",
          }}
        >
          {/* On mobile: Photo rendered on top via CSS order or media query */}
          <div className="services-split-photo-col">
            <PhotoPanel activeIndex={active} id={photoId} services={services} />
          </div>

          {/* Rows */}
          <div
            role="region"
            aria-label="Services list"
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(44,36,32,0.12)",
            }}
          >
            {services.map((svc, i) => {
              const isActive = i === active;
              const rowId = `${baseId}-row-${i}`;
              const descId = `${baseId}-desc-${i}`;
              const btnId = `${baseId}-btn-${i}`;

              return (
                <div
                  key={svc.slug || i}
                  id={rowId}
                  onMouseEnter={() => activate(i)}
                  style={{
                    borderBottom: "1px solid rgba(44,36,32,0.12)",
                    transition: "background-color 0.2s ease",
                    background: isActive
                      ? "rgba(197, 168, 128, 0.08)"
                      : "transparent",
                  }}
                >
                  {/* Row Button */}
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={descId}
                    onClick={() => activate(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      padding: "20px 12px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "18px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontFamily: "var(--font-sans)",
                          letterSpacing: "0.1em",
                          color: isActive ? "var(--gold)" : "rgba(44,36,32,0.4)",
                          fontWeight: 600,
                        }}
                      >
                        0{i + 1}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "clamp(19px, 2.2vw, 24px)",
                          fontWeight: 500,
                          letterSpacing: "0.02em",
                          margin: 0,
                          color: isActive ? "var(--gold)" : "var(--charcoal)",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {svc.title}
                      </h3>
                    </div>

                    <DiagonalArrow active={isActive} />
                  </button>

                  {/* Expandable description panel */}
                  <div
                    id={descId}
                    role="region"
                    aria-labelledby={btnId}
                    style={{
                      maxHeight: isActive ? "300px" : "0",
                      opacity: isActive ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.28s ease, opacity 0.22s ease",
                      padding: isActive ? "0 12px 20px 42px" : "0 12px 0 42px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.7,
                        color: "var(--text-secondary)",
                        margin: "0 0 16px",
                        maxWidth: "520px",
                      }}
                    >
                      {svc.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Link
                        href={svc.href || (svc as any).link || "/services"}
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          fontWeight: 600,
                          color: "var(--gold)",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span>Explore Details</span>
                        <ChevronRight size={14} />
                      </Link>

                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello, I'd like to consult on your ${svc.title} service.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontWeight: 500,
                          color: "var(--text-secondary)",
                          textDecoration: "none",
                          opacity: 0.8,
                        }}
                      >
                        Quick Consultation →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
