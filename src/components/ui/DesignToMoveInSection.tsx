"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquare,
  ShieldCheck,
  Ruler,
  Palette,
  Hammer,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export interface ProcessStep {
  step: string;
  number: number;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    number: 1,
    title: "DESIGN CONSULTATION",
    description:
      "Tell us your vision and share your floor plan, we’ll turn it into tailored 3D designs with an instant quote.",
  },
  {
    step: "02",
    number: 2,
    title: "BOOK YOUR TOKEN AMOUNT",
    description:
      "Ready to begin? Book your Token Amount and take the first step toward your dream space.",
  },
  {
    step: "03",
    number: 3,
    title: "SITE MEASUREMENT",
    description:
      "We Begin with a Precise Site Measurement to Lay the Foundation for Your Custom Interior Design Journey",
  },
  {
    step: "04",
    number: 4,
    title: "FINALISE YOUR DESIGN",
    description:
      "Work Closely with Our Experts to Finalize a Design That Reflects Your Style, Functionality, and Vision",
  },
  {
    step: "05",
    number: 5,
    title: "START EXECUTION",
    description:
      "It’s Go Time! Your Dream Interiors Are Now in Production, Crafted with Care and Quality",
  },
  {
    step: "06",
    number: 6,
    title: "INSTALLATION & HANDOVER",
    description:
      "Move-In Ready! We Set Everything Up So You Can Step Into Your Beautiful New Space",
  },
];

const STEP_ICONS = [
  <MessageSquare key="1" size={22} />,
  <ShieldCheck key="2" size={22} />,
  <Ruler key="3" size={22} />,
  <Palette key="4" size={22} />,
  <Hammer key="5" size={22} />,
  <KeyRound key="6" size={22} />,
];

// 3 cloned sets of 6 steps for seamless infinite looping
const CLONED_STEPS = [...PROCESS_STEPS, ...PROCESS_STEPS, ...PROCESS_STEPS];
const TOTAL_REAL_STEPS = PROCESS_STEPS.length; // 6
const MIDDLE_SET_START = TOTAL_REAL_STEPS; // 6

export default function DesignToMoveInSection() {
  const [currentIndex, setCurrentIndex] = useState(MIDDLE_SET_START);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isDragging = useRef<boolean>(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setCardsPerView(1);
      } else if (w < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Advance to next step
  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Move to previous step
  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Handle transition end for seamless infinite wrap
  const handleTransitionEnd = useCallback(() => {
    // If we passed beyond the middle set (index >= 12)
    if (currentIndex >= MIDDLE_SET_START + TOTAL_REAL_STEPS) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev - TOTAL_REAL_STEPS);
    }
    // If we passed before the middle set (index < 6)
    else if (currentIndex < MIDDLE_SET_START) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev + TOTAL_REAL_STEPS);
    }
  }, [currentIndex]);

  // Re-enable transition after instantaneous wrap
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  // Pause and schedule auto-advance resume
  const pauseTemporarily = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4500);
  }, []);

  // Auto-advance timer (every 4 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, handleNext]);

  // Cleanup resume timer
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Dot navigation
  const handleDotClick = (stepIdx: number) => {
    setIsTransitioning(true);
    setCurrentIndex(MIDDLE_SET_START + stepIdx);
    pauseTemporarily();
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    pauseTemporarily();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isDragging.current = false;
    pauseTemporarily();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX.current !== null) {
      if (Math.abs(e.clientX - mouseStartX.current) > 8) {
        isDragging.current = true;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current !== null) {
      const diff = mouseStartX.current - e.clientX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    mouseStartX.current = null;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  // Calculate current active step index (0..5)
  const activeStepNumber = ((currentIndex % TOTAL_REAL_STEPS) + TOTAL_REAL_STEPS) % TOTAL_REAL_STEPS;

  // Slide offset percentage: currentIndex * (100 / cardsPerView)%
  const translateXPercent = currentIndex * (100 / cardsPerView);

  return (
    <section
      className="from-design-to-move-in-section section"
      aria-label="From Design to Move-In Process"
      style={{
        background: "var(--ivory, #FAF7F2)",
        padding: "80px 0 95px",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container" style={{ position: "relative" }}>
        {/* Section Header */}
        <div className="section-title--center" style={{ marginBottom: "48px" }}>
          <span
            className="eyebrow"
            style={{
              color: "var(--gold-dark, #8C7148)",
              letterSpacing: "0.22em",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            The Customer Journey
          </span>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 3.4vw, 38px)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              color: "var(--charcoal, #1C1C1C)",
              textTransform: "uppercase",
              margin: "10px 0 16px",
            }}
          >
            FROM DESIGN TO MOVE-IN
          </h2>
          <div className="title-line--center title-line" />
          <p
            style={{
              textAlign: "center",
              maxWidth: "680px",
              margin: "18px auto 0",
              fontSize: "14.5px",
              lineHeight: 1.65,
              color: "#5A544F",
            }}
          >
            Your complete customer journey from the first design consultation to
            final installation and handover — crafted with precision, quality, and care.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            padding: "8px 0 16px",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Track */}
          <div
            onTransitionEnd={handleTransitionEnd}
            style={{
              display: "flex",
              width: "100%",
              transform: `translateX(-${translateXPercent}%)`,
              transition: isTransitioning
                ? "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
              willChange: "transform",
            }}
          >
            {CLONED_STEPS.map((step, idx) => {
              const realIdx = idx % TOTAL_REAL_STEPS;
              const isCardActive = realIdx === activeStepNumber;

              return (
                <div
                  key={`${step.number}-${idx}`}
                  style={{
                    flex: `0 0 ${100 / cardsPerView}%`,
                    maxWidth: `${100 / cardsPerView}%`,
                    padding: "0 10px",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Process Card */}
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: isCardActive
                        ? "1.5px solid rgba(184, 151, 90, 0.65)"
                        : "1.5px solid rgba(184, 151, 90, 0.32)",
                      borderRadius: "16px",
                      padding: "26px 22px 28px",
                      boxShadow: isCardActive
                        ? "0 10px 28px rgba(184, 151, 90, 0.14), 0 4px 14px rgba(28, 28, 28, 0.05)"
                        : "0 4px 18px rgba(28, 28, 28, 0.05)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      minHeight: "260px",
                      position: "relative",
                      overflow: "hidden",
                      transition:
                        "transform 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease",
                      cursor: "grab",
                    }}
                  >
                    {/* Background Decorative Step Number Watermark */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "16px",
                        fontFamily: "var(--font-serif)",
                        fontSize: "58px",
                        fontWeight: 300,
                        color: "rgba(184, 151, 90, 0.12)",
                        lineHeight: 1,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                      aria-hidden="true"
                    >
                      {step.step}
                    </div>

                    {/* Card Top: Step Pill Badge + Icon */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "18px",
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "4px 12px",
                            borderRadius: "50px",
                            background: isCardActive
                              ? "rgba(184, 151, 90, 0.16)"
                              : "rgba(184, 151, 90, 0.09)",
                            border: "1px solid rgba(184, 151, 90, 0.4)",
                            color: "var(--gold-dark, #8C7148)",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                          }}
                        >
                          STEP {step.step}
                        </span>

                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            background: isCardActive
                              ? "var(--gold, #B8975A)"
                              : "rgba(184, 151, 90, 0.14)",
                            color: isCardActive ? "#FFFFFF" : "var(--gold-dark, #8C7148)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {STEP_ICONS[realIdx]}
                        </div>
                      </div>

                      {/* Step Title (EXACT) */}
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "18.5px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          color: "var(--charcoal, #1C1C1C)",
                          textTransform: "uppercase",
                          lineHeight: 1.35,
                          margin: "0 0 12px",
                        }}
                      >
                        {step.title}
                      </h3>

                      {/* Step Description (EXACT) */}
                      <p
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "13.5px",
                          lineHeight: 1.65,
                          color: "#4E4E4E",
                          margin: 0,
                        }}
                      >
                        “{step.description}”
                      </p>
                    </div>

                    {/* Bottom Progress Accent Bar */}
                    <div
                      style={{
                        marginTop: "22px",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(184, 151, 90, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10.5px",
                          fontWeight: 600,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: isCardActive ? "var(--gold-dark, #8C7148)" : "#9A938A",
                        }}
                      >
                        Stage {step.number} of 6
                      </span>
                      <div
                        style={{
                          width: "32px",
                          height: "3px",
                          borderRadius: "2px",
                          background: isCardActive
                            ? "var(--gold, #B8975A)"
                            : "rgba(184, 151, 90, 0.25)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Bar (Arrows & Interactive Dots) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "36px",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          {/* Arrow Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => {
                handlePrev();
                pauseTemporarily();
              }}
              aria-label="Previous step"
              id="process-carousel-prev"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "1.2px solid rgba(184, 151, 90, 0.4)",
                color: "var(--gold-dark, #8C7148)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--gold, #B8975A)";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.borderColor = "var(--gold, #B8975A)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.color = "var(--gold-dark, #8C7148)";
                e.currentTarget.style.borderColor = "rgba(184, 151, 90, 0.4)";
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => {
                handleNext();
                pauseTemporarily();
              }}
              aria-label="Next step"
              id="process-carousel-next"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "1.2px solid rgba(184, 151, 90, 0.4)",
                color: "var(--gold-dark, #8C7148)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--gold, #B8975A)";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.borderColor = "var(--gold, #B8975A)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.color = "var(--gold-dark, #8C7148)";
                e.currentTarget.style.borderColor = "rgba(184, 151, 90, 0.4)";
              }}
            >
              <ChevronRight size={18} />
            </button>

            <span
              style={{
                fontSize: "12px",
                color: "#6E6862",
                fontWeight: 500,
                marginLeft: "6px",
              }}
            >
              Step <strong style={{ color: "var(--charcoal)" }}>{activeStepNumber + 1}</strong> of 6
            </span>
          </div>

          {/* 6 Step Interactive Indicator Dots */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {PROCESS_STEPS.map((s, idx) => {
              const isActive = idx === activeStepNumber;
              return (
                <button
                  key={s.step}
                  onClick={() => handleDotClick(idx)}
                  aria-label={`Jump to Step ${s.step}: ${s.title}`}
                  id={`process-dot-${s.step}`}
                  style={{
                    height: "8px",
                    width: isActive ? "32px" : "8px",
                    borderRadius: "4px",
                    background: isActive ? "var(--gold, #B8975A)" : "rgba(184, 151, 90, 0.3)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                />
              );
            })}
          </div>

          {/* Action Link: Contact / Consultation */}
          <div>
            <Link
              href="/contact"
              className="btn btn--primary"
              id="process-start-consultation-btn"
              style={{
                fontSize: "11px",
                padding: "9px 22px",
                letterSpacing: "0.1em",
                borderRadius: "6px",
              }}
            >
              Start Consultation <ArrowRight size={13} style={{ marginLeft: "6px" }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
