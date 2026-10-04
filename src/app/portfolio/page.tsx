"use client";
import { useState } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";

const CATEGORIES = ["All", "Residential", "Commercial", "Office", "Salon", "Hotel", "Turnkey"];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero" aria-label="Portfolio hero" style={{ position: "relative" }}>
        <div
          className="page-hero__bg"
          style={{
            backgroundImage: "url(/images/hero-luxury.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="page-hero__overlay"
          style={{
            background: "linear-gradient(to right, rgba(28, 24, 22, 0.88) 0%, rgba(28, 24, 22, 0.72) 100%)",
          }}
        />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> / Portfolio
          </div>
          <h1 className="page-hero__title">
            Our Work,<br />
            Our Story
          </h1>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="portfolio-section section" aria-label="Portfolio">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
            <div className="section-title">
              <span className="eyebrow">Selected Projects</span>
              <h2>{filtered.length} Projects</h2>
              <div className="title-line" />
            </div>
          </div>

          {/* Filters */}
          <div className="filter-bar" role="group" aria-label="Portfolio filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-chip${activeFilter === cat ? " filter-chip--active" : ""}`}
                onClick={() => setActiveFilter(cat)}
                id={`portfolio-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="portfolio-grid">
            {filtered.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="project-card"
                id={`portfolio-card-${project.id}`}
              >
                <div className="project-card__image-wrap">
                  <img
                    src={project.image || "/images/hero-luxury.jpg"}
                    alt={project.title}
                    className="project-card__image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                    }}
                  />
                  <div className="project-card__overlay">
                    <span className="project-card__view">View Project</span>
                  </div>
                </div>
                <div className="project-card__info">
                  <div className="project-card__category">{project.category}</div>
                  <div className="project-card__title">{project.title}</div>
                  <div className="project-card__meta">
                    {project.location} · {project.area} · {project.year}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
              <p>No projects found in this category.</p>
              <button
                className="btn btn--outline"
                onClick={() => setActiveFilter("All")}
                style={{ marginTop: "20px" }}
              >
                Show All Projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" aria-label="Portfolio CTA">
        <div className="cta-band__eyebrow">Start Your Project</div>
        <h2 className="cta-band__title">
          Like What You See?<br />
          Let's <em>Create Yours</em>
        </h2>
        <p className="cta-band__subtitle">
          Get a free consultation and see what we can create together.
        </p>
        <div className="cta-band__actions">
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20my%20project"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
            id="portfolio-cta-whatsapp"
          >
            Get Free Consultation
          </a>
          <Link href="/contact" className="btn btn--outline-white btn--large" id="portfolio-cta-contact">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
