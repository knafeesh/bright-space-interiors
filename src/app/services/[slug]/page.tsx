"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, PROJECTS, WHATSAPP_NUMBER } from "@/lib/data";
import { ArrowRight, Plus } from "lucide-react";
import { use } from "react";

// ── Per-service photo gallery sets ──────────────────────────────────────────
const SERVICE_GALLERIES: Record<string, { src: string; caption: string }[]> = {
  residential: [
    { src: "/images/res-living.jpg",   caption: "Luxury Living Room" },
    { src: "/images/res-bedroom.jpg",  caption: "Master Bedroom Suite" },
    { src: "/images/res-kitchen.jpg",  caption: "Modular Kitchen" },
    { src: "/images/res-bathroom.jpg", caption: "Spa-Inspired Bathroom" },
    { src: "/images/res-villa.jpg",    caption: "Villa Exterior & Terrace" },
  ],
  commercial: [
    { src: "/images/com-office.jpg",     caption: "Corporate Office" },
    { src: "/images/com-lobby.jpg",      caption: "Reception & Lobby" },
    { src: "/images/com-restaurant.jpg", caption: "Restaurant & Dining" },
    { src: "/images/com-retail.jpg",     caption: "Retail Showroom" },
    { src: "/images/com-hotel.jpg",      caption: "Hotel Suite" },
  ],
  turnkey: [
    { src: "/images/tk-kitchen.jpg",  caption: "Modular Kitchen Installation" },
    { src: "/images/tk-ceiling.jpg",  caption: "False Ceiling & Cove Lighting" },
    { src: "/images/tk-wardrobe.jpg", caption: "Walk-in Wardrobe" },
    { src: "/images/tk-flooring.jpg", caption: "Italian Marble Flooring" },
    { src: "/images/tk-progress.jpg", caption: "Site Execution in Progress" },
  ],
  "design-execution": [
    { src: "/images/de-sketch.jpg",   caption: "Concept Sketches" },
    { src: "/images/de-render.jpg",   caption: "3D Visualization" },
    { src: "/images/de-material.jpg", caption: "Material Selection" },
    { src: "/images/de-meeting.jpg",  caption: "Client Design Review" },
    { src: "/images/de-final.jpg",    caption: "Final Delivered Space" },
  ],
};

// Fallback hero images per service (already downloaded)
const HERO_IMAGES: Record<string, string> = {
  residential:      "/images/service-residential.jpg",
  commercial:       "/images/service-commercial.jpg",
  turnkey:          "/images/service-turnkey.jpg",
  "design-execution": "/images/service-design.jpg",
};

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) notFound();

  const relatedProjects = PROJECTS.filter(
    (p) =>
      p.category.toLowerCase() === slug ||
      (slug === "residential" && p.category === "Residential") ||
      (slug === "commercial" && ["Commercial", "Office", "Salon", "Hotel"].includes(p.category))
  ).slice(0, 3);

  return <ServiceDetailClient service={service} relatedProjects={relatedProjects} />;
}

function ServiceDetailClient({
  service,
  relatedProjects,
}: {
  service: (typeof SERVICES)[0];
  relatedProjects: typeof PROJECTS;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const gallery = SERVICE_GALLERIES[service.slug] || [];
  const heroImg = HERO_IMAGES[service.slug] || service.image || "/images/service-residential.jpg";

  return (
    <>
      {/* ── Page Hero with real photo ─────────────────────────────────── */}
      <section className="page-hero" aria-label={`${service.title} hero`} style={{ position: "relative" }}>
        <div
          className="page-hero__bg"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="page-hero__overlay"
          style={{
            background: "linear-gradient(to right, rgba(20,15,12,0.88) 0%, rgba(20,15,12,0.55) 100%)",
          }}
        />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> / <Link href="/services">Services</Link> / {service.title}
          </div>
          <h1 className="page-hero__title">{service.title}</h1>
          <p style={{
            color: "rgba(248,244,236,0.7)",
            fontSize: "16px",
            marginTop: "16px",
            maxWidth: "560px",
            lineHeight: 1.7,
          }}>
            {service.subtitle}
          </p>
        </div>
      </section>

      {/* ── Service Detail — split layout ────────────────────────────── */}
      <section className="service-detail section" aria-label="Service details">
        <div className="container">
          <div className="service-detail__inner">
            {/* Left — description & includes */}
            <div>
              <span className="eyebrow">Overview</span>
              <h2 style={{ marginTop: "16px", marginBottom: "20px" }}>{service.subtitle}</h2>
              <div className="title-line" />
              <p style={{ marginTop: "24px", fontSize: "16px", lineHeight: 1.9 }}>
                {service.description}
              </p>

              <div className="service-includes" style={{ marginTop: "40px" }}>
                <div className="service-includes__title">What's Included</div>
                <ul className="service-includes__list">
                  {service.subServices.map((sub) => (
                    <li key={sub} className="service-includes__item">
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "40px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(service.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                  id={`service-${service.slug}-whatsapp`}
                >
                  Get a Free Quote <ArrowRight size={14} />
                </a>
                <Link href="/portfolio" className="btn btn--outline" id={`service-${service.slug}-portfolio`}>
                  View Related Work
                </Link>
              </div>
            </div>

            {/* Right — Photo gallery + process */}
            <div>
              {/* ── Interactive photo gallery ── */}
              {gallery.length > 0 ? (
                <div style={{ marginBottom: "40px" }}>
                  {/* Main featured photo */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/10",
                      overflow: "hidden",
                      borderRadius: "2px",
                      position: "relative",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      key={activePhoto}
                      src={gallery[activePhoto].src}
                      alt={gallery[activePhoto].caption}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        transition: "opacity 0.4s ease",
                      }}
                    />
                    {/* Caption overlay */}
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "16px 20px",
                      background: "linear-gradient(to top, rgba(20,15,12,0.75) 0%, transparent 100%)",
                    }}>
                      <span style={{
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(248,244,236,0.85)",
                        fontWeight: 600,
                      }}>
                        {gallery[activePhoto].caption}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail strip */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${gallery.length}, 1fr)`,
                    gap: "6px",
                  }}>
                    {gallery.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        style={{
                          padding: 0,
                          border: i === activePhoto ? "2px solid var(--gold)" : "2px solid transparent",
                          borderRadius: "1px",
                          overflow: "hidden",
                          cursor: "pointer",
                          aspectRatio: "1",
                          transition: "border-color 0.25s ease",
                        }}
                        aria-label={photo.caption}
                        id={`gallery-thumb-${service.slug}-${i}`}
                      >
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            opacity: i === activePhoto ? 1 : 0.6,
                            transition: "opacity 0.25s ease",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Fallback if gallery images not loaded yet */
                <div style={{
                  width: "100%",
                  aspectRatio: "16/10",
                  overflow: "hidden",
                  borderRadius: "2px",
                  marginBottom: "40px",
                }}>
                  <img
                    src={heroImg}
                    alt={service.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* ── Process steps ── */}
              <div style={{ background: "var(--stone)", padding: "36px", borderRadius: "2px" }}>
                <div style={{
                  fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em",
                  textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "20px",
                }}>
                  Our Approach
                </div>
                {["Initial Consultation", "Design Development", "Material Selection", "Execution", "Quality Review", "Handover"].map((step, i) => (
                  <div
                    key={step}
                    style={{
                      display: "flex", alignItems: "center", gap: "16px",
                      padding: "12px 0", borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span style={{
                      fontFamily: "Cormorant Garamond, serif", fontSize: "20px",
                      color: "var(--gold)", minWidth: "28px",
                    }}>
                      0{i + 1}
                    </span>
                    <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-width gallery strip ──────────────────────────────────── */}
      {gallery.length > 0 && (
        <section
          aria-label="Service photo gallery"
          style={{ padding: "0 0 80px", background: "var(--ivory)" }}
        >
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span className="eyebrow">Our Work in {service.title}</span>
              <h2 style={{ marginTop: "12px" }}>Spaces We've Crafted</h2>
              <div className="title-line title-line--center" style={{ margin: "16px auto 0" }} />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}>
              {/* First image — large, spans 2 rows */}
              <div style={{
                gridRow: "span 2",
                overflow: "hidden",
                borderRadius: "2px",
                position: "relative",
              }}>
                <img
                  src={gallery[0].src}
                  alt={gallery[0].caption}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "20px",
                  background: "linear-gradient(to top, rgba(20,15,12,0.65) 0%, transparent 100%)",
                }}>
                  <span style={{
                    fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase",
                    color: "rgba(248,244,236,0.9)", fontWeight: 600,
                  }}>{gallery[0].caption}</span>
                </div>
              </div>

              {/* Remaining images in a 2-col grid */}
              {gallery.slice(1).map((photo, i) => (
                <div
                  key={i}
                  style={{ overflow: "hidden", borderRadius: "2px", aspectRatio: "4/3", position: "relative" }}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover", display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "14px 16px",
                    background: "linear-gradient(to top, rgba(20,15,12,0.6) 0%, transparent 100%)",
                  }}>
                    <span style={{
                      fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "rgba(248,244,236,0.85)", fontWeight: 600,
                    }}>{photo.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Projects ─────────────────────────────────────────── */}
      {relatedProjects.length > 0 && (
        <section className="projects-section section" style={{ background: "var(--stone)" }} aria-label="Related projects">
          <div className="container">
            <div className="section-title">
              <span className="eyebrow">Related Work</span>
              <h2>Projects in This Category</h2>
              <div className="title-line" />
            </div>

            <div className="projects-grid" style={{ marginTop: "48px" }}>
              {relatedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="project-card"
                  id={`related-project-${project.id}`}
                >
                  <div className="project-card__image-wrap">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="project-card__image"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div
                        className="project-card__image"
                        style={{ background: project.bgGradient }}
                      />
                    )}
                    <div className="project-card__overlay">
                      <span className="project-card__view">View Project</span>
                    </div>
                  </div>
                  <div className="project-card__info">
                    <div className="project-card__category">{project.category}</div>
                    <div className="project-card__title">{project.title}</div>
                    <div className="project-card__meta">{project.location} · {project.area}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="faq-section section" aria-label="FAQ">
        <div className="container">
          <div className="section-title">
            <span className="eyebrow">Questions</span>
            <h2>Frequently Asked</h2>
            <div className="title-line" />
          </div>

          <div className="faq-list">
            {service.faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? " faq-item--open" : ""}`}
                id={`faq-${service.slug}-${i}`}
              >
                <div
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  role="button"
                  aria-expanded={openFaq === i}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <Plus className="faq-question__icon" size={20} />
                </div>
                <div className="faq-answer">
                  <div className="faq-answer__inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="cta-band" aria-label="Service CTA">
        <div className="cta-band__eyebrow">Ready to Start?</div>
        <h2 className="cta-band__title">
          Let's Discuss Your<br />
          <em>{service.title}</em> Project
        </h2>
        <p className="cta-band__subtitle">Book a free consultation today.</p>
        <div className="cta-band__actions">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(service.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
            id={`service-${service.slug}-cta-whatsapp`}
          >
            Get Free Consultation
          </a>
          <Link href="/contact" className="btn btn--outline-white btn--large" id={`service-${service.slug}-cta-contact`}>
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
