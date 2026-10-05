import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";
import { ArrowLeft, ArrowRight, MapPin, Maximize2, Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import { use } from "react";

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[currentIndex - 1];
  const nextProject = PROJECTS[currentIndex + 1];

  const GALLERY_GRADIENTS = [
    "linear-gradient(135deg, #2C2420 0%, #3D3025 100%)",
    "linear-gradient(135deg, #1E2830 0%, #243040 100%)",
    "linear-gradient(135deg, #2A261A 0%, #352E20 100%)",
  ];

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
            ].map(({ label, value, Icon }) => (
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
                {project.challenge}
              </h2>
              <div className="title-line" />
            </div>
            <div style={{ paddingTop: "20px" }}>
              <h4 style={{ marginBottom: "16px" }}>Our Solution</h4>
              <p style={{ fontSize: "16px", lineHeight: 1.9 }}>{project.solution}</p>

              {/* Materials */}
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
            </div>
          </div>

          {/* Gallery */}
          <div className="project-gallery" style={{ marginTop: "60px" }}>
            <div className="project-gallery__main" style={{ gridColumn: "span 8" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "440px",
                  overflow: "hidden",
                  borderRadius: "2px",
                  background: "#EAE5DC",
                }}
              >
                <img
                  src={project.gallery?.[0] || project.image || "/images/hero-luxury.jpg"}
                  alt={`${project.title} Interior`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
            <div className="project-gallery__side" style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "16px" }}>
              {(project.gallery?.slice(1) || ["/images/gallery-detail-1.jpg", "/images/gallery-detail-2.jpg"]).map((imgSrc, i) => (
                <div
                  key={i}
                  className="project-gallery__side-img"
                  style={{ minHeight: "212px", overflow: "hidden", borderRadius: "2px", background: "#EAE5DC" }}
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
              ))}
            </div>
          </div>

          {/* Client Quote */}
          <div className="client-quote">
            <p className="client-quote__text">"{project.clientQuote}"</p>
            <div className="client-quote__author">— {project.clientName}</div>
          </div>

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
