"use client";
import { useState, useId, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { NAV_SERVICES, WHATSAPP_NUMBER } from "@/lib/data";

const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

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
function PhotoPanel({ activeIndex, id }: { activeIndex: number; id: string }) {
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

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
        {NAV_SERVICES.map((svc, i) => (
          <Link
            key={svc.slug}
            href={svc.href}
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
              alt={svc.caption}
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
          {NAV_SERVICES[activeIndex].caption}
        </span>
      </div>
    </div>
  );
}

// ── Main accordion component ─────────────────────────────────────────────────
export default function ServicesAccordion() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const photoId = `${baseId}-photo`;

  const activate = useCallback((i: number) => setActive(i), []);

  // Keyboard navigation on the list: up/down arrows move between rows
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, i: number) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = (i + 1) % NAV_SERVICES.length;
        setActive(next);
        (
          document.getElementById(`${baseId}-btn-${next}`) as HTMLElement
        )?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev =
          (i - 1 + NAV_SERVICES.length) % NAV_SERVICES.length;
        setActive(prev);
        (
          document.getElementById(`${baseId}-btn-${prev}`) as HTMLElement
        )?.focus();
      }
    },
    [baseId]
  );

  const waLink = `${WA_BASE}?text=${encodeURIComponent(
    "Hello Bright Space Interiors, I saw your work and I'm interested in your interior design services. I would like to discuss my project and get a consultation."
  )}`;

  return (
    <section
      className="services-accordion-section"
      aria-label="Our services"
      style={{ background: "var(--ivory)", padding: "90px 0 80px" }}
    >
      <div
        className="container"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}
      >
        {/* ── Header row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "48px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <span
              className="eyebrow"
              style={{ display: "block", marginBottom: "8px" }}
            >
              What we do
            </span>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 3.2vw, 40px)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                margin: 0,
                color: "var(--charcoal)",
              }}
            >
              Interiors from concept
              <br />
              to handover
            </h2>
          </div>
          <Link
            href="/services"
            id="services-accordion-all"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--gold-dark)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderBottom: "1px solid rgba(184,151,90,0.4)",
              paddingBottom: "2px",
              transition: "color 0.2s, border-color 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            All services <ChevronRight size={13} aria-hidden="true" />
          </Link>
        </div>

        {/* ── Two-column layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr minmax(0, 380px)",
            gap: "56px",
            alignItems: "start",
          }}
          className="services-accordion-grid"
        >
          {/* Left — accordion list */}
          <div role="list">
            {NAV_SERVICES.map((svc, i) => {
              const isActive = i === active;
              const btnId = `${baseId}-btn-${i}`;
              const panelId = `${baseId}-panel-${i}`;

              return (
                <div
                  key={svc.slug}
                  role="listitem"
                  style={{
                    borderTop:
                      i === 0
                        ? "1px solid var(--border)"
                        : undefined,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {/* Row header — button */}
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onMouseEnter={() => activate(i)}
                    onClick={() => activate(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      minHeight: "48px",
                      outline: "none",
                    }}
                    className="svc-row-btn"
                  >
                    {/* Number */}
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "13px",
                        color: isActive
                          ? "var(--gold)"
                          : "var(--text-muted)",
                        fontWeight: 400,
                        minWidth: "26px",
                        transition: "color 0.2s",
                        letterSpacing: "0.06em",
                      }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Title */}
                    <span
                      style={{
                        flex: 1,
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(17px, 1.6vw, 21px)",
                        fontWeight: isActive ? 500 : 400,
                        color: isActive
                          ? "var(--charcoal)"
                          : "var(--text-secondary)",
                        transition: "color 0.2s, font-weight 0.15s",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {svc.title}
                    </span>

                    <DiagonalArrow active={isActive} />
                  </button>

                  {/* Expandable panel */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    style={{
                      overflow: "hidden",
                      maxHeight: isActive ? "200px" : "0",
                      opacity: isActive ? 1 : 0,
                      transition:
                        "max-height 0.28s ease, opacity 0.22s ease",
                    }}
                  >
                    <div style={{ padding: "0 0 20px 42px" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: 1.75,
                          color: "var(--text-secondary)",
                          margin: "0 0 14px",
                          maxWidth: "460px",
                        }}
                      >
                        {svc.description}
                      </p>
                      <Link
                        href={svc.href}
                        id={`service-accordion-link-${svc.slug}`}
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "var(--gold-dark)",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        Explore service{" "}
                        <ArrowUpRight size={12} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* WhatsApp CTA below the list */}
            <div style={{ marginTop: "32px" }}>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                id="services-accordion-wa"
                className="btn btn--primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "13px 28px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Get a free consultation
              </a>
            </div>
          </div>

          {/* Right — photo panel (hidden on mobile — shown above on mobile via CSS) */}
          <div className="services-accordion-photo-col">
            <PhotoPanel activeIndex={active} id={photoId} />
          </div>
        </div>
      </div>
    </section>
  );
}
