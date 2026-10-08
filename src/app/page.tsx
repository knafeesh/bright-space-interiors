"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  CookingPot,
  Lightbulb,
  Sofa,
  BedDouble,
  Bath,
  PaintRoller,
  Tv,
  DoorOpen,
  Monitor,
  Boxes,
  BookOpen,
  Frame,
} from "lucide-react";
import { TESTIMONIALS, WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";
import { useCmsProjects, useCmsServices } from "@/lib/cms";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import ProjectCard from "@/components/ui/ProjectCard";
import ClientListSection from "@/components/ui/ClientListSection";
import DesignIdeasSection from "@/components/ui/DesignIdeasSection";
import DesignToMoveInSection from "@/components/ui/DesignToMoveInSection";

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



const CATEGORIES = ["All", "Residential", "Commercial", "Office", "Salon", "Hotel", "Turnkey"];
interface InteriorSolutionItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const INTERIOR_SOLUTIONS: InteriorSolutionItem[] = [
  {
    name: "Modular Kitchen",
    href: "/services/turnkey",
    icon: <CookingPot size={36} strokeWidth={1.5} />,
  },
  {
    name: "Modular Wardrobe",
    href: "/services/turnkey",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="2" width="18" height="20" rx="2" />
        <path d="M12 2v20" />
        <path d="M9 10v3" />
        <path d="M15 10v3" />
      </svg>
    ),
  },
  {
    name: "Lighting",
    href: "/services/turnkey",
    icon: <Lightbulb size={36} strokeWidth={1.5} />,
  },
  {
    name: "Furniture",
    href: "/services/residential",
    icon: <Sofa size={36} strokeWidth={1.5} />,
  },
  {
    name: "Kids Bedroom",
    href: "/services/residential",
    icon: <BedDouble size={36} strokeWidth={1.5} />,
  },
  {
    name: "Bathroom",
    href: "/services/residential",
    icon: <Bath size={36} strokeWidth={1.5} />,
  },
  {
    name: "Bathroom Renovation",
    href: "/services/residential",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 3h10v6H7z" />
        <path d="M5 9h14a1 1 0 0 1 1 1v2a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-2a1 1 0 0 1 1-1z" />
        <path d="M9 19v2" />
        <path d="M15 19v2" />
      </svg>
    ),
  },
  {
    name: "Renovation",
    href: "/services/turnkey",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m14.7 6.3 5 5-2.8 2.8-5-5z" />
        <path d="m9.3 11.7-5 5 2.8 2.8 5-5z" />
        <path d="m16 8 2-2a2.83 2.83 0 0 0-4-4l-2 2" />
        <path d="m8 16-2 2a2.83 2.83 0 0 1-4-4l2-2" />
      </svg>
    ),
  },
  {
    name: "Wall Paint",
    href: "/services/turnkey",
    icon: <PaintRoller size={36} strokeWidth={1.5} />,
  },
  {
    name: "TV Console",
    href: "/services/residential",
    icon: <Tv size={36} strokeWidth={1.5} />,
  },
  {
    name: "Doors",
    href: "/services/turnkey",
    icon: <DoorOpen size={36} strokeWidth={1.5} />,
  },
  {
    name: "Workspace",
    href: "/services/commercial",
    icon: <Monitor size={36} strokeWidth={1.5} />,
  },
  {
    name: "Storage",
    href: "/services/turnkey",
    icon: <Boxes size={36} strokeWidth={1.5} />,
  },
  {
    name: "Temple",
    href: "/services/residential",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2v2" />
        <path d="M12 4c-2 1.5-4 3.5-4 5h8c0-1.5-2-3.5-4-5Z" />
        <path d="M5 9h14v2H5z" />
        <path d="M6 11v8" />
        <path d="M10 11v8" />
        <path d="M14 11v8" />
        <path d="M18 11v8" />
        <path d="M4 19h16v3H4z" />
      </svg>
    ),
  },
  {
    name: "Study Area",
    href: "/services/residential",
    icon: <BookOpen size={36} strokeWidth={1.5} />,
  },
  {
    name: "Foyer Design",
    href: "/services/residential",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m14 7 3 3" />
        <path d="m9.5 11.5 5-5a2.12 2.12 0 0 1 3 3l-5 5-4.5 1 1-4.5z" />
        <path d="M4 20h16" />
      </svg>
    ),
  },
  {
    name: "Wall Art",
    href: "/services/residential",
    icon: <Frame size={36} strokeWidth={1.5} />,
  },
  {
    name: "Smart Home",
    href: "/services/turnkey",
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M9.5 15.5a4 4 0 0 1 5 0" />
        <path d="M8 18a6 6 0 0 1 8 0" />
      </svg>
    ),
  },
];


// Service image map (verified real project photos)
const SERVICE_IMAGES: Record<string, string> = {
  residential: "/images/real-bedroom-headboard.jpg",
  commercial: "/images/office-gurugram-open-floor.jpg",
  turnkey: "/images/real-kitchen-saket.jpg",
  "design-execution": "/images/sushant-lok-vdeliver-site-execution.jpg",
  design: "/images/sushant-lok-vdeliver-site-execution.jpg",
};

const HOME_SERVICES = [
  {
    title: "Residential Interior",
    slug: "residential",
    image: "/images/real-bedroom-headboard.jpg",
    description:
      "Beautifully crafted residential spaces designed around your lifestyle, comfort, and personality.",
    href: "/services/residential",
  },
  {
    title: "Commercial Interior",
    slug: "commercial",
    image: "/images/office-gurugram-open-floor.jpg",
    description:
      "Professional commercial spaces designed to reflect your brand, functionality, and business needs.",
    href: "/services/commercial",
  },
  {
    title: "Turnkey Projects",
    slug: "turnkey",
    image: "/images/real-kitchen-saket.jpg",
    description:
      "Complete interior solutions from concept and design to execution, finishing, and final handover.",
    href: "/services/turnkey",
  },
  {
    title: "Design & Execution",
    slug: "design-execution",
    image: "/images/sushant-lok-vdeliver-site-execution.jpg",
    description:
      "From detailed design concepts to precise execution, we bring every interior vision to life.",
    href: "/services/design-execution",
  },
];

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
                className="service-compact-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  color: "inherit",
                  textAlign: "center",
                }}
              >
                <div
                  className="service-compact-card__image-wrap"
                  style={{
                    position: "relative",
                    aspectRatio: "16 / 10",
                    overflow: "hidden",
                    borderRadius: "9px",
                    background: "#161311",
                  }}
                >
                  <img
                    src={p.image || "/images/hero-luxury.jpg"}
                    alt={p.title}
                    className="service-compact-card__img"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  <div className="service-compact-card__img-gradient" />
                  <div className="service-compact-card__badge">
                    {p.category}
                  </div>
                </div>
                <div
                  className="service-compact-card__content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    padding: "14px 6px 0",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "17px",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#1C1C1C",
                        margin: "0 0 6px",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="service-compact-card__desc"
                      style={{
                        fontSize: "12.5px",
                        color: "#4E4E4E",
                        lineHeight: 1.55,
                        margin: "0 0 14px",
                      }}
                    >
                      Premium turnkey interior solutions, from concept to final handover.
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "auto", paddingTop: "6px" }}>
                    <span className="service-compact-card__btn">
                      Explore Project <ChevronRight size={13} style={{ marginLeft: "4px" }} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ INTERIOR SOLUTIONS SECTION ══════════════ */}
      <section
        className="interior-solutions"
        id="interior-solutions"
        aria-label="Interior Solutions"
      >
        <div className="interior-solutions__container">
          <div className="interior-solutions__header">
            <h2 className="interior-solutions__title">Interior Solutions</h2>
            <div className="title-line--center title-line" style={{ marginTop: "14px" }} />
          </div>

          <div className="interior-solutions__grid">
            {INTERIOR_SOLUTIONS.map((item, i) => (
              <Link
                key={item.name}
                href={item.href}
                className="interior-solutions__card"
                id={`interior-solution-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                aria-label={item.name}
              >
                <div className="interior-solutions__icon">{item.icon}</div>
                <span className="interior-solutions__name">{item.name}</span>
              </Link>
            ))}
          </div>
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
          <div className="services-compact-grid">
            {HOME_SERVICES.map((service) => {
              const cmsMatch = cmsServices.find(
                (s) => s.slug === service.slug || (service.slug === "design-execution" && s.slug === "design")
              );
              const imgSrc = cmsMatch?.image || SERVICE_IMAGES[service.slug] || service.image;

              return (
                <div
                  key={service.slug}
                  id={`service-card-${service.slug}`}
                  className="service-compact-card"
                >
                  {/* Landscape Image with Small Title Overlay Badge */}
                  <Link
                    href={service.href}
                    className="service-compact-card__image-wrap"
                    aria-label={`View ${service.title}`}
                  >
                    <img
                      src={imgSrc}
                      alt={service.title}
                      className="service-compact-card__img"
                      loading="lazy"
                    />
                    <div className="service-compact-card__img-gradient" />
                    <div className="service-compact-card__badge">
                      {service.title}
                    </div>
                  </Link>

                  {/* Short Clean Description & Centered Read More Button */}
                  <div className="service-compact-card__content">
                    <p className="service-compact-card__desc">
                      {service.description}
                    </p>
                    <Link
                      href={service.href}
                      id={`service-btn-${service.slug}`}
                      className="service-compact-card__btn"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
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
