"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Maximize2, Calendar, Clock } from "lucide-react";
import { useCmsProjects, Project } from "@/lib/cms";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";

interface Props {
  initialProject?: Project;
  slug?: string;
}

export default function ProjectDetailClient({ initialProject, slug }: Props) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const cmsProjects = useCmsProjects();

  const targetSlug = slug || initialProject?.slug;
  // Find updated version in CMS store or use initial
  const project =
    cmsProjects.find(
      (p) => (targetSlug && p.slug === targetSlug) || (initialProject && p.id === initialProject.id)
    ) || initialProject;

  if (!project) {
    return (
      <div className="container" style={{ padding: "120px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", color: "var(--charcoal)" }}>
          Project Not Found
        </h2>
        <p style={{ marginTop: "12px", color: "var(--text-muted)" }}>
          This project may have been updated or removed in the Portfolio Manager.
        </p>
        <div style={{ marginTop: "28px" }}>
          <Link href="/portfolio" className="btn btn--primary">
            Explore All Projects
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = cmsProjects.findIndex((p) => p.slug === project.slug);
  const prevProject = cmsProjects[currentIndex - 1];
  const nextProject = cmsProjects[currentIndex + 1];

  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ height: "75vh", position: "relative" }} aria-label="Project hero">
        <div
          className="page-hero__bg"
          style={{
            backgroundImage: `url(${project.image || "/images/hero-luxury.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="page-hero__overlay"
          style={{
            background: "linear-gradient(to top, rgba(24, 20, 18, 0.95) 0%, rgba(24, 20, 18, 0.4) 60%, rgba(24, 20, 18, 0.25) 100%)",
          }}
        />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> /{" "}
            <Link href="/portfolio">Portfolio</Link> / {project.title}
          </div>
          <span className="eyebrow" style={{ color: "var(--gold-light)", display: "block", marginBottom: "12px" }}>
            {project.category}
          </span>
          <h1 className="page-hero__title">{project.title}</h1>
        </div>
      </section>

      {/* Project Detail */}
      <section className="project-detail section" aria-label="Project details">
        <div className="container">
          {/* Meta Bar */}
          <div className="project-detail__meta-bar">
            {[
              { label: "Type", value: project.category, Icon: null },
              { label: "Location", value: project.location, Icon: MapPin },
              { label: "Area", value: project.area, Icon: Maximize2 },
              { label: "Year", value: project.year, Icon: Calendar },
              { label: "Duration", value: project.duration, Icon: Clock },
            ].map(({ label, value }) => (
              <div key={label} className="project-meta-item">
                <div className="project-meta-item__label">{label}</div>
                <div className="project-meta-item__value">{value}</div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
            <div>
              <span className="eyebrow">The Brief</span>
              <h2 style={{ marginTop: "16px", marginBottom: "20px", fontSize: "clamp(28px, 3vw, 44px)" }}>
                {project.challenge || project.description}
              </h2>
              <div className="title-line" />
            </div>
            <div style={{ paddingTop: "20px" }}>
              <h4 style={{ marginBottom: "16px" }}>Our Solution</h4>
              <p style={{ fontSize: "16px", lineHeight: 1.9 }}>{project.solution || project.description}</p>

              {/* Materials */}
              {project.materials && project.materials.length > 0 && (
                <div style={{ marginTop: "32px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>
                    Materials Used
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {project.materials.map((mat) => (
                      <span
                        key={mat}
                        style={{
                          padding: "6px 16px",
                          border: "1px solid var(--border)",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="project-gallery" style={{ marginTop: "60px" }}>
              <div className="project-gallery__main" style={{ gridColumn: project.gallery.length > 1 ? "span 8" : "span 12" }}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "440px",
                    overflow: "hidden",
                    borderRadius: "4px",
                    background: "#EAE5DC",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={activeImage || project.gallery[0] || project.image}
                    alt={`${project.title} Interior`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "opacity 0.25s ease",
                    }}
                  />
                </div>
              </div>
              {project.gallery.length > 1 && (
                <div
                  className="project-gallery__side"
                  style={{
                    gridColumn: "span 4",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {project.gallery.map((imgSrc, i) => {
                    const isSelected = (activeImage || project.gallery[0]) === imgSrc;
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveImage(imgSrc)}
                        className="project-gallery__side-img"
                        style={{
                          height: "135px",
                          overflow: "hidden",
                          borderRadius: "4px",
                          background: "#EAE5DC",
                          cursor: "pointer",
                          border: isSelected ? "2px solid var(--gold)" : "2px solid transparent",
                          opacity: isSelected ? 1 : 0.78,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <img
                          src={imgSrc}
                          alt={`${project.title} Detail ${i + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Client Quote */}
          {project.clientQuote && (
            <div className="client-quote">
              <p className="client-quote__text">"{project.clientQuote}"</p>
              <div className="client-quote__author">— {project.clientName}</div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "48px", borderTop: "1px solid var(--border)" }}>
            {prevProject ? (
              <Link href={`/portfolio/${prevProject.slug}`} className="btn btn--outline" id="project-prev">
                <ArrowLeft size={14} /> Previous Project
              </Link>
            ) : <div />}
            <Link href="/portfolio" className="btn btn--ghost" id="project-all">
              All Projects
            </Link>
            {nextProject ? (
              <Link href={`/portfolio/${nextProject.slug}`} className="btn btn--outline" id="project-next">
                Next Project <ArrowRight size={14} />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" aria-label="Project CTA">
        <div className="cta-band__eyebrow">Inspired?</div>
        <h2 className="cta-band__title">
          Let's Create Your<br />
          <em>Dream Space</em>
        </h2>
        <p className="cta-band__subtitle">
          Get a free consultation with our design team.
        </p>
        <div className="cta-band__actions">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
            id="project-cta-whatsapp"
          >
            Start Your Project
          </a>
          <Link href="/contact" className="btn btn--outline-white btn--large" id="project-cta-contact">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
