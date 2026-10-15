"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, PROJECTS, WHATSAPP_NUMBER } from "@/lib/data";
import { useCmsServices, useCmsProjects } from "@/lib/cms";
import { ArrowRight, Plus } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";

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

// Real hero images per service
const HERO_IMAGES: Record<string, string> = {
  residential: "/images/real-bedroom-headboard.jpg",
  commercial: "/images/office-gurugram-open-floor.jpg",
  turnkey: "/images/real-kitchen-saket.jpg",
  "design-execution": "/images/salon-rawls-styling-suites.jpg",
};

export default function ServiceDetailClient({ slug }: { slug: string }) {
  const cmsServices = useCmsServices();
  const cmsProjects = useCmsProjects();

  const service =
    cmsServices.find((s) => s.slug === slug) || SERVICES.find((s) => s.slug === slug);

  if (!service) notFound();

  const relatedProjects = (cmsProjects.length > 0 ? cmsProjects : PROJECTS).filter(
    (p) =>
      p.category.toLowerCase() === slug.toLowerCase() ||
      (slug === "residential" && p.category.toLowerCase() === "residential") ||
      (slug === "commercial" && ["commercial", "office", "salon", "hotel"].includes(p.category.toLowerCase())) ||
      (slug === "turnkey" && p.category.toLowerCase() === "turnkey")
  ).slice(0, 3);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const gallery = SERVICE_GALLERIES[service.slug] || [];
  const heroImg = service.image || HERO_IMAGES[service.slug] || "/images/service-residential.jpg";

  // WhatsApp service inquiry link format:
  // "Hello Bright Space Interiors, I'm interested in {service title}. I would like to discuss my project and get a consultation."
  const waServiceMsg = encodeURIComponent(
    `Hello Bright Space Interiors, I'm interested in ${service.title}. I would like to discuss my project and get a consultation.`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waServiceMsg}`;

  // Fix CTA heading repeating word (e.g., "Turnkey Projects Project" -> "Turnkey project")
  const cleanServiceTitle = service.title.replace(/\s+projects?$/i, "");

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
                  href={waLink}
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
                      borderRadius: "9px",
                      border: "1.5px solid rgba(184, 151, 90, 0.32)",
                      boxShadow: "0 4px 18px rgba(28, 28, 28, 0.05)",
                      position: "relative",
                      marginBottom: "12px",
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
                          borderRadius: "6px",
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
                  position: "relative",
                  marginBottom: "40px",
                }}>
                  <img
                    src={heroImg}
                    alt={service.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Service Process steps */}
              <div style={{
                background: "var(--cream)",
                padding: "36px 32px",
                borderRadius: "2px",
                border: "1px solid var(--border)",
              }}>
                <h4 style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "20px",
                  fontWeight: 400,
                  marginBottom: "24px",
                }}>
                  How We Deliver This
                </h4>
                {[
                  { step: "01", title: "Consultation & Brief", desc: "Understanding your vision, functional requirements, timeline, and budget." },
                  { step: "02", title: "Concept & 3D Visualization", desc: "Mood boards, spatial layouts, 3D renders, and material boards for approval." },
                  { step: "03", title: "Precision Execution", desc: "On-site civil, electrical, carpentry, and false ceiling by master craftsmen." },
                  { step: "04", title: "Snagging & Handover", desc: "Rigorous quality check, final detailing, and on-time handover of your space." },
                ].map((s) => (
                  <div key={s.step} style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "20px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "14px",
                      color: "var(--gold)",
                      fontWeight: 600,
                      minWidth: "24px",
                    }}>
                      {s.step}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Projects ─────────────────────────────────────────── */}
      {relatedProjects.length > 0 && (
        <section className="section" style={{ background: "var(--ivory)" }} aria-label="Related projects">
          <div className="container">
            <div className="section-title">
              <span className="eyebrow">Related Work</span>
              <h2>Projects in This Category</h2>
              <div className="title-line" />
            </div>

            <div className="projects-grid" style={{ marginTop: "48px" }}>
              {relatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  idPrefix="service-related"
                />
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
          Let's discuss your<br />
          <em>{cleanServiceTitle}</em> project
        </h2>
        <p className="cta-band__subtitle">Book a free consultation today.</p>
        <div className="cta-band__actions">
          <a
            href={waLink}
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
