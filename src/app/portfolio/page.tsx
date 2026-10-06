"use client";
import { useState } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";
import { useCmsProjects } from "@/lib/cms";
import CategoryCarousel from "@/components/ui/CategoryCarousel";
import ProjectCard from "@/components/ui/ProjectCard";

const CATEGORIES = ["All", "Residential", "Commercial", "Office", "Salon", "Hotel", "Turnkey"];

export default function PortfolioPage() {
  const projects = useCmsProjects();
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

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

          {/* Automatic Image Carousel for Office, Salon, Hotel */}
          {["office", "salon", "hotel"].includes(activeFilter.toLowerCase()) && (
            <CategoryCarousel category={activeFilter} />
          )}

          {/* Grid */}
          <div className="portfolio-grid">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} idPrefix="portfolio-card" />
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
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
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
