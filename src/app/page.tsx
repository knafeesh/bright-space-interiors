"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Home,
  Building2,
  Briefcase,
  Hammer,
  PenTool,
  KeyRound,
  ArrowRight,
  Shield,
  Users,
  Gem,
  Clock,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { TESTIMONIALS, WHY_US_PILLARS, WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";
import { useCmsProjects, useCmsServices } from "@/lib/cms";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import ProjectCard from "@/components/ui/ProjectCard";

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

// ─── Icon Map ────────────────────────────────────────────────────────────────
const PILLAR_ICONS: Record<string, React.ReactNode> = {
  shield: <Shield size={28} />,
  users: <Users size={28} />,
  gem: <Gem size={28} />,
  clock: <Clock size={28} />,
  message: <MessageSquare size={28} />,
};

const CATEGORIES = ["All", "Residential", "Commercial", "Office", "Salon", "Hotel", "Turnkey"];
const SERVICE_ICONS = [
  <Home size={36} key="home" />,
  <Building2 size={36} key="building" />,
  <Briefcase size={36} key="office" />,
  <Hammer size={36} key="hammer" />,
  <PenTool size={36} key="pen" />,
  <KeyRound size={36} key="key" />,
];
const QUICK_SERVICES = [
  "Residential",
  "Commercial",
  "Office & Workspace",
  "Turnkey Projects",
  "Design & Execution",
  "Handover & Support",
];

const PROCESS_HOME = [
  { n: "01", title: "Consultation" },
  { n: "02", title: "Site Visit" },
  { n: "03", title: "Design & 3D" },
  { n: "04", title: "Quotation" },
  { n: "05", title: "Execution" },
  { n: "06", title: "Handover" },
];

// Service image map (verified real project photos)
const SERVICE_IMAGES: Record<string, string> = {
  residential: "/images/real-bedroom-headboard.jpg",
  commercial: "/images/office-gurugram-open-floor.jpg",
  turnkey: "/images/real-kitchen-saket.jpg",
  "design-execution": "/images/salon-rawls-styling-suites.jpg",
  design: "/images/salon-rawls-styling-suites.jpg",
};

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const sectionRef = useFadeIn();
  const cmsProjects = useCmsProjects();
  const cmsServices = useCmsServices();

  const filteredProjects =
    activeFilter === "All"
      ? cmsProjects.filter((p) => p.featured)
      : cmsProjects.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

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
            }}
          />
        </div>
        <div
          className="hero__overlay"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.2) 65%, rgba(250, 247, 242, 0.35) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(250, 247, 242, 0.4) 100%)",
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
              color: "#181615",
              textTransform: "uppercase",
              lineHeight: 1.15,
              textShadow: "0 2px 16px rgba(255, 255, 255, 0.7)",
            }}
          >
            Spaces Designed<br />
            To Feel Like You.
          </h1>

          <p
            style={{
              fontSize: "clamp(14px, 1.6vw, 17px)",
              color: "#35302C",
              marginTop: "18px",
              letterSpacing: "0.02em",
              maxWidth: "640px",
              fontWeight: 400,
              textShadow: "0 1px 10px rgba(255, 255, 255, 0.8)",
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

      {/* ══════════════ FEATURED PROJECTS (AS IN REFERENCE SCREENSHOT) ══════════════ */}
      <section
        style={{
          background: "#FAF7F2",
          padding: "70px 0 90px",
          borderTop: "1px solid rgba(44,36,32,0.06)",
        }}
        aria-label="Featured projects"
      >
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(26px, 3.2vw, 36px)",
              fontWeight: 400,
              letterSpacing: "0.14em",
              textAlign: "center",
              textTransform: "uppercase",
              color: "#1F1D1A",
              marginBottom: "46px",
            }}
          >
            Featured Projects
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {cmsProjects.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                href={`/portfolio/${p.slug}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform var(--transition-base)",
                }}
                className="group"
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16/11",
                    overflow: "hidden",
                    borderRadius: "1px",
                    background: "#E8E2D8",
                  }}
                >
                  <img
                    src={p.image || "/images/hero-luxury.jpg"}
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                    className="group-hover:scale-105"
                  />
                </div>
                <div style={{ paddingTop: "16px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "17px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#1C1C1C",
                      marginBottom: "6px",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "rgba(44, 36, 32, 0.68)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    Premium turnkey interior solutions, from concept to final handover.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ SERVICES QUICK MENU ══════════════ */}
      <section className="services-quick" aria-label="Services overview">
        <div className="services-quick__grid">
          {QUICK_SERVICES.map((name, i) => (
            <Link
              key={name}
              href={i < 4 ? `/services/${cmsServices[i]?.slug || ""}` : "/services"}
              className="services-quick__item"
              id={`quick-service-${i}`}
            >
              <div className="services-quick__icon">{SERVICE_ICONS[i]}</div>
              <span className="services-quick__name">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════ ABOUT PREVIEW ══════════════ */}
      <section className="about-preview section" aria-label="About preview" ref={sectionRef}>
        <div className="container">
          <div className="about-preview__inner">
            {/* Image */}
            <div className="about-preview__image-wrap fade-in-up">
              <div
                className="about-preview__image"
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={cmsProjects[2]?.image || cmsServices[0]?.image || "/images/modular-kitchen.jpg"}
                  alt="Bright Space Interiors Crafted Spaces"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="about-preview__image-accent" />
              <div className="about-preview__badge">
                <div className="about-preview__badge-number">12+</div>
                <div className="about-preview__badge-text">Years of Excellence</div>
              </div>
            </div>

            {/* Content */}
            <div className="about-preview__content fade-in-up delay-2">
              <div className="section-title">
                <span className="eyebrow">About Bright Space</span>
                <h2>
                  We Build Spaces<br />
                  That Tell Stories
                </h2>
                <div className="title-line" />
                <p>
                  Founded on the belief that great design transforms lives,
                  Bright Space Interiors has delivered over 200 projects across
                  Delhi NCR, Gurugram, Delhi, and beyond. Our approach blends
                  aesthetic vision with practical precision.
                </p>
              </div>

              {/* Counters */}
              <div className="counters">
                <div className="counter">
                  <div className="counter__number">
                    <AnimatedCounter end={12} suffix="+" />
                  </div>
                  <div className="counter__label">Years Experience</div>
                </div>
                <div className="counter">
                  <div className="counter__number">
                    <AnimatedCounter end={240} suffix="+" />
                  </div>
                  <div className="counter__label">Projects Completed</div>
                </div>
                <div className="counter">
                  <div className="counter__number">
                    <AnimatedCounter end={98} suffix="%" />
                  </div>
                  <div className="counter__label">Happy Clients</div>
                </div>
              </div>

              <Link href="/about" className="btn btn--outline" id="about-know-more">
                Know More <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SERVICES PREVIEW ══════════════ */}
      <section className="services-preview" aria-label="Services">
        <div className="container">
          <div className="services-preview__header">
            <div className="section-title">
              <span className="eyebrow">What We Do</span>
              <h2>Our Services</h2>
              <div className="title-line" />
            </div>
            <Link href="/services" className="btn btn--ghost" id="services-all">
              All Services <ChevronRight size={14} />
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            {cmsServices.map((service) => {
              const imgSrc = service.image || SERVICE_IMAGES[service.slug] || "/images/real-bedroom-headboard.jpg";
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  id={`service-card-${service.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#161311",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
                  }}
                  className="service-framed-card"
                >
                  {/* Real Image Window in the Frame */}
                  <div
                    style={{
                      width: "100%",
                      height: "230px",
                      position: "relative",
                      overflow: "hidden",
                      background: "#0D0B0A",
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={service.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                      }}
                      className="service-framed-card__img"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "rgba(0, 0, 0, 0.65)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid rgba(212, 184, 122, 0.4)",
                        color: "#D4B87A",
                        padding: "4px 10px",
                        borderRadius: "50px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {service.subtitle}
                    </div>
                  </div>

                  {/* Given Text Below Image in the Frame */}
                  <div
                    style={{
                      padding: "24px 22px 20px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "22px",
                          fontWeight: 500,
                          color: "#FFFFFF",
                          margin: "0 0 10px",
                          lineHeight: 1.3,
                        }}
                      >
                        {service.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.65,
                          color: "rgba(250, 247, 242, 0.72)",
                          margin: "0 0 20px",
                        }}
                      >
                        {service.description}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        color: "#D4B87A",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span>Explore Service</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

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

          <div className="filter-bar" role="group" aria-label="Project filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip${activeFilter === cat ? " filter-chip--active" : ""}`}
                onClick={() => setActiveFilter(cat)}
                id={`filter-${cat.toLowerCase().replace(" ", "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Automatic Image Carousel for Office, Salon, Hotel */}
          {["office", "salon", "hotel"].includes(activeFilter.toLowerCase()) && (
            <CategoryCarousel category={activeFilter} />
          )}

          <div className="projects-grid">
            {filteredProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} idPrefix="project-card" />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ WHY CHOOSE US ══════════════ */}
      <section className="why-us section" aria-label="Why choose us">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">Why Bright Space</span>
            <h2 style={{ color: "var(--ivory)", textAlign: "center" }}>
              The Bright Space Difference
            </h2>
            <div className="title-line--center title-line" />
          </div>

          <div className="why-us__grid">
            {WHY_US_PILLARS.map((pillar) => (
              <div key={pillar.title} className="why-us__pillar">
                <div className="why-us__pillar-icon">
                  {PILLAR_ICONS[pillar.icon]}
                </div>
                <div className="why-us__pillar-title">{pillar.title}</div>
                <p className="why-us__pillar-text">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ PROCESS PREVIEW ══════════════ */}
      <section className="process-preview section" aria-label="Our process">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">How We Work</span>
            <h2 style={{ textAlign: "center" }}>Our Process</h2>
            <div className="title-line--center title-line" />
            <p style={{ textAlign: "center" }}>
              A proven 9-step journey from consultation to handover — designed
              to keep you informed and delighted at every stage.
            </p>
          </div>

          <div className="process-timeline">
            {PROCESS_HOME.map((step) => (
              <div key={step.n} className="process-step">
                <div className="process-step__number">{step.n}</div>
                <div className="process-step__title">{step.title}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link href="/process" className="btn btn--outline" id="process-learn-more">
              See Full Process <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="testimonials section" aria-label="Testimonials">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">Client Stories</span>
            <h2 style={{ textAlign: "center" }}>What Our Clients Say</h2>
            <div className="title-line--center title-line" />
          </div>

          <div className="testimonials__slider">
            {TESTIMONIALS.map((t) => (
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
