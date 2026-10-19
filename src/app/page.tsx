"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { TESTIMONIALS, WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";
import { useCmsProjects } from "@/lib/cms";
import ProjectFilterBar from "@/components/ui/ProjectFilterBar";
import ProjectCard from "@/components/ui/ProjectCard";
import ClientListSection from "@/components/ui/ClientListSection";
import DesignIdeasSection from "@/components/ui/DesignIdeasSection";
import DesignToMoveInSection from "@/components/ui/DesignToMoveInSection";
import ServicesCarousel from "@/components/ui/ServicesCarousel";
import DesignPhilosophyShowcase from "@/components/ui/DesignPhilosophyShowcase";

// ─── Animated Counter ───────────────────────────────────────────────────────
function AnimatedCounter({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      <span className="counter__suffix">{suffix}</span>
    </span>
  );
}

// ─── Scroll Fade-in ──────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up--visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    const els = ref.current?.querySelectorAll(".fade-in-up");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}





const BRAND_STATS = [
  {
    number: 9,
    suffix: "+",
    label: "YEARS EXPERIENCE",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6L6 21" />
        <path d="M12 6L18 21" />
        <path d="M8 15h8" />
        <circle cx="12" cy="15" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: 100,
    suffix: "+",
    label: "PROJECTS COMPLETED",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 10h6" />
        <path d="M9 14h6" />
        <path d="M11 21v-4h2v4" />
      </svg>
    ),
  },
  {
    number: 95,
    suffix: "+",
    label: "SATISFIED CLIENTS",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 9v3" />
        <path d="M10.5 10.5h3" />
      </svg>
    ),
  },
  {
    number: 40,
    suffix: "+",
    label: "BRILLIANT TEAM",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isFading, setIsFading] = useState(false);
  const sectionRef = useFadeIn();
  const cmsProjects = useCmsProjects();
  const [testimonials, setTestimonials] = useState<any[]>(TESTIMONIALS);

  useEffect(() => {
    fetch("/api/admin/testimonials", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          const published = data.testimonials.filter((t: any) => t.published !== false);
          if (published.length > 0) {
            setTestimonials(
              published.map((t: any) => ({
                id: t.id,
                name: t.name || t.author,
                project: t.project || t.role || t.location || "",
                rating: t.rating || 5,
                quote: t.quote,
              }))
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleFilterChange = (cat: string) => {
    if (cat === activeFilter) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveFilter(cat);
      setIsFading(false);
    }, 150);
  };

  const filteredProjects = useMemo(() => {
    if (activeFilter === "ALL") {
      return cmsProjects;
    }
    return cmsProjects.filter((p) => {
      const cats = (
        p.categories && p.categories.length > 0 ? p.categories : [p.category || ""]
      ).map((c) => c.toUpperCase());
      return cats.includes(activeFilter.toUpperCase());
    });
  }, [cmsProjects, activeFilter]);

  return (
    <>
      {/* ══════════════ HERO (MATCHING REFERENCE DESIGN) ══════════════ */}
      <section
        className="hero"
        aria-label="Hero"
        style={{
          position: "relative",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div className="hero__bg" style={{ position: "absolute", inset: 0 }}>
          <img
            src="/images/hero-luxury.jpg"
            alt="Luxury interior design by The Bright Space Interiors"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              transform: "scale(1.02)",
              filter: "contrast(1.10) brightness(0.95) saturate(1.08)",
            }}
          />
        </div>
        <div
          className="hero__overlay"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(250, 247, 242, 0.12) 0%, rgba(250, 247, 242, 0.06) 60%, rgba(245, 239, 235, 0.18) 100%), linear-gradient(to bottom, rgba(250, 247, 242, 0.14) 0%, rgba(250, 247, 242, 0.0) 50%, rgba(250, 247, 242, 0.20) 100%)",
          }}
        />

        <div
          className="hero__content"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: "880px",
            margin: "0 auto",
            padding: "60px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(34px, 5.5vw, 68px)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              color: "#120F0D",
              textTransform: "uppercase",
              lineHeight: 1.15,
              textShadow: "0 2px 28px rgba(255, 255, 255, 0.98), 0 0 45px rgba(250, 247, 242, 0.95), 0 1px 4px rgba(0, 0, 0, 0.15)",
            }}
          >
            Spaces Designed<br />
            To Feel Like You.
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 1.6vw, 17px)",
              color: "#221C18",
              marginTop: "18px",
              letterSpacing: "0.02em",
              maxWidth: "640px",
              fontWeight: 500,
              textShadow: "0 1px 20px rgba(255, 255, 255, 0.98), 0 0 32px rgba(250, 247, 242, 0.95)",
            }}
          >
            Premium turnkey interior solutions, from concept to final handover.
          </p>

          <div
            className="hero__actions"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "18px",
              marginTop: "32px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/portfolio"
              className="btn"
              id="hero-view-work"
              style={{
                background: "#B89762",
                color: "#FFFFFF",
                padding: "13px 32px",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "1px",
                boxShadow: "0 6px 20px rgba(184, 151, 98, 0.35)",
              }}
            >
              View Our Work
            </Link>
            <Link
              href="/contact"
              className="btn"
              id="hero-get-in-touch"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                border: "1px solid #B89762",
                color: "#2C2420",
                padding: "13px 32px",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "1px",
                backdropFilter: "blur(6px)",
              }}
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ OUR DESIGN PHILOSOPHY SECTION ══════════════ */}
      <section
        style={{
          background: "#FAF7F2",
          padding: "70px 0 90px",
          borderTop: "1px solid rgba(44,36,32,0.06)",
        }}
        aria-label="Our Design Philosophy"
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(26px, 3.4vw, 38px)",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textAlign: "center",
                textTransform: "uppercase",
                color: "#1F1D1A",
                margin: "0 0 16px",
              }}
            >
              OUR DESIGN PHILOSOPHY
            </h2>
            <div
              className="title-line--center title-line"
              style={{ margin: "0 auto 28px" }}
            />
            <p
              style={{
                maxWidth: "920px",
                margin: "0 auto",
                fontSize: "clamp(15px, 1.2vw, 17px)",
                lineHeight: 1.85,
                color: "#4A423B",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              Luxury Interior Designers in Delhi NCR, Gurugram, Faridabad, Haryana &amp; Punjab — Bright Space Interiors brings premium home interiors tailored to your style. We create timeless, elegant spaces that reflect your taste. Our residential and commercial interior design services combine innovation, functionality, and aesthetics seamlessly. From design consultation to execution and final handover, Bright Space Interiors transforms every space into a statement of style and sophistication.
            </p>
          </div>

          {/* Design Philosophy Showcase */}
          <DesignPhilosophyShowcase />
        </div>
      </section>

      

      {/* ══════════════ BRAND STATISTICS SECTION ══════════════ */}
      <section className="brand-stats-section" aria-label="Key statistics" ref={sectionRef}>
        <div className="container">
          <div className="brand-stats-grid">
            {BRAND_STATS.map((stat) => (
              <div key={stat.label} className="brand-stat-item fade-in-up">
                <div className="brand-stat-visual" aria-hidden="true">
                  {stat.icon}
                </div>
                <div className="brand-stat-number">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="brand-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ OUR SERVICES CAROUSEL (WHAT WE DO) ══════════════ */}
      <ServicesCarousel />

      {/* ══════════════ RECENT PROJECTS ══════════════ */}
      <section className="projects-section" aria-label="Recent projects">
        <div className="container">
          <div className="projects-section__header">
            <div className="section-title">
              <span className="eyebrow">Featured Work</span>
              <h2>Recent Projects</h2>
              <div className="title-line" />
            </div>
            <Link href="/portfolio" className="btn btn--ghost" id="projects-view-all">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          <ProjectFilterBar
            projects={cmsProjects}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            idPrefix="home-filter"
          />

          <div className={`projects-grid${isFading ? " projects-grid--fading" : ""}`}>
            {filteredProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} idPrefix="project-card" />
            ))}
          </div>

          {/* Bottom Centered Button: EXPLORE ALL PROJECTS */}
          <div className="projects-section__bottom-action">
            <Link
              href="/portfolio"
              className="btn-explore-all-projects"
              id="projects-explore-all-bottom"
            >
              EXPLORE ALL PROJECTS <ArrowRight size={14} style={{ marginLeft: "8px" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ DESIGN IDEAS (INSPIRATION CAROUSEL) ══════════════ */}
      <DesignIdeasSection />

      {/* ══════════════ FROM DESIGN TO MOVE-IN (CUSTOMER JOURNEY) ══════════════ */}
      <DesignToMoveInSection />

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="testimonials section" aria-label="Testimonials">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">Client Stories</span>
            <h2 style={{ textAlign: "center" }}>What Our Clients Say</h2>
            <div className="title-line--center title-line" />
          </div>

          <div className="testimonials__slider">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
                  {"★".repeat(t.rating)}
                </div>
                <div className="testimonial-card__quote">&ldquo;</div>
                <p className="testimonial-card__text">{t.quote}</p>
                <div className="testimonial-card__divider" />
                <div className="testimonial-card__author-name">{t.name}</div>
                <div className="testimonial-card__author-project">{t.project}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ OUR GROUP / CLIENT LIST ══════════════ */}
      <ClientListSection />

      {/* ══════════════ CTA BAND ══════════════ */}
      <section className="cta-band" aria-label="Call to action">
        <div className="cta-band__eyebrow">Begin Your Journey</div>
        <h2 className="cta-band__title">
          Ready to Transform<br />
          Your <em>Space?</em>
        </h2>
        <p className="cta-band__subtitle">
          Book a free consultation with our design team today.
        </p>
        <div className="cta-band__actions">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
            id="cta-whatsapp"
          >
            Get Free Consultation
          </a>
          <Link href="/portfolio" className="btn btn--outline-white btn--large" id="cta-portfolio">
            View Portfolio
          </Link>
        </div>
      </section>
    </>
  );
}
