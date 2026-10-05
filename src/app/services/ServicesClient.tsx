"use client";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useCmsServices, useCmsSpecialties } from "@/lib/cms";
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";

export default function ServicesClient() {
  const services = useCmsServices();
  const specialties = useCmsSpecialties();

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero" aria-label="Services hero" style={{ position: "relative" }}>
        <div
          className="page-hero__bg"
          style={{
            backgroundImage: "url(/images/real-salon-mainhall.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="page-hero__overlay"
          style={{
            background: "linear-gradient(to right, rgba(28, 24, 22, 0.9) 0%, rgba(28, 24, 22, 0.7) 100%)",
          }}
        />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> / Services
          </div>
          <h1 className="page-hero__title">
            What We<br />Create
          </h1>
        </div>
      </section>

      {/* Services Hub */}
      <section className="services-hub section" aria-label="Services overview">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">Our Expertise</span>
            <h2 style={{ textAlign: "center" }}>
              Four Ways We Can<br />Transform Your Space
            </h2>
            <div className="title-line--center title-line" />
            <p style={{ textAlign: "center" }}>
              Whether you are a homeowner, business owner, or developer — we
              have a service model designed precisely for you.
            </p>
          </div>
        </div>

        <div className="services-hub__grid" style={{ maxWidth: 1280, margin: "56px auto 0", padding: "0 40px" }}>
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="service-hub-card"
              id={`service-hub-${service.slug}`}
            >
              <div
                className="service-hub-card__bg"
                style={{
                  backgroundImage: `url(${service.image || "/images/real-bedroom-fluted.jpg"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="service-hub-card__overlay" />
              <div className="service-hub-card__content">
                <span className="eyebrow" style={{ color: "var(--gold-light)" }}>
                  {service.subtitle}
                </span>
                <h3 style={{ color: "var(--white)", marginTop: "12px" }}>
                  {service.title}
                </h3>
                <p style={{ color: "rgba(248,244,236,0.65)", fontSize: "14px", marginTop: "12px", lineHeight: 1.7 }}>
                  {service.description.substring(0, 120)}…
                </p>
                <div className="service-hub-card__subs">
                  {service.subServices.map((sub) => (
                    <span key={sub} className="service-hub-card__sub">
                      {sub}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", color: "var(--gold-light)" }}>
                  Explore Service <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Turnkey checklist callout */}
      <section className="section" style={{ background: "var(--charcoal)" }} aria-label="Turnkey highlight">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--gold-light)" }}>Single Point of Responsibility</span>
              <h2 style={{ color: "var(--ivory)", marginTop: "16px", marginBottom: "20px" }}>
                Turnkey Projects —<br />Zero Hassle
              </h2>
              <div className="title-line" />
              <p style={{ color: "rgba(248,244,236,0.6)", marginTop: "24px" }}>
                We manage every aspect of your project — from planning and
                civil work to furniture and final handover. You deal with one
                team, sign one contract, and get a fully move-in-ready space.
              </p>
              <Link href="/services/turnkey" className="btn btn--outline-gold" style={{ marginTop: "36px" }} id="turnkey-learn-more">
                Learn More <ArrowRight size={14} />
              </Link>
            </div>
            <div>
              <div style={{ position: "relative", marginBottom: "24px", height: "200px", overflow: "hidden", borderRadius: "2px" }}>
                <img
                  src="/images/real-salon-mainhall.jpg"
                  alt="Turnkey Execution"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {[
                "Civil Work & Reconfiguration",
                "Electrical Work & Automation",
                "False Ceiling & Architectural Lighting",
                "Flooring (Italian Marble & Hardwood)",
                "Modular Kitchens (German & Italian Hardware)",
                "Modular Wardrobes & Walk-in Closets",
                "Wall Design, Textures & Luxury Painting",
                "Turnkey Handover with Quality Audit",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    fontSize: "15px",
                    color: "rgba(248,244,236,0.75)",
                  }}
                >
                  <span style={{ color: "var(--gold)", fontSize: "18px", lineHeight: 1 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Execution & Fitouts */}
      <section className="section" style={{ background: "var(--cream)" }} aria-label="Specialty fitouts">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">Comprehensive Execution</span>
            <h2 style={{ textAlign: "center" }}>
              Core Turnkey &amp; Specialty Services
            </h2>
            <div className="title-line--center title-line" />
            <p style={{ textAlign: "center", maxWidth: 640, margin: "16px auto 0" }}>
              Every element of your space is designed and manufactured with industrial precision and installed by master craftsmen.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              marginTop: "56px",
            }}
          >
            {specialties.map((s) => (
              <div
                key={s.name}
                style={{
                  background: "var(--white)",
                  padding: "24px",
                  borderRadius: "2px",
                  border: "1px solid rgba(44,36,32,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all var(--transition-medium)",
                }}
              >
                <div>
                  <div style={{ height: "150px", overflow: "hidden", borderRadius: "1px", marginBottom: "18px" }}>
                    <img
                      src={s.image}
                      alt={s.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--gold-dark)",
                      fontWeight: 600,
                    }}
                  >
                    {s.tagline}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "22px",
                      color: "var(--charcoal)",
                      margin: "8px 0 12px",
                    }}
                  >
                    {s.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {s.description}
                  </p>
                </div>
                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(44,36,32,0.06)" }}>
                  <Link
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      color: "var(--charcoal)",
                      textTransform: "uppercase",
                    }}
                  >
                    Consult on this <ChevronRight size={13} style={{ color: "var(--gold)" }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" aria-label="Services CTA">
        <div className="cta-band__eyebrow">Let's Begin</div>
        <h2 className="cta-band__title">
          Not Sure Which<br />
          Service You <em>Need?</em>
        </h2>
        <p className="cta-band__subtitle">
          Talk to us — we'll help you find the right approach for your project.
        </p>
        <div className="cta-band__actions">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
            id="services-cta-whatsapp"
          >
            WhatsApp Us
          </a>
          <Link href="/contact" className="btn btn--outline-white btn--large" id="services-cta-contact">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
