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

        <div
          style={{
            maxWidth: 1280,
            margin: "48px auto 0",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="service-compact-card"
              id={`service-hub-${service.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
              }}
            >
              {/* Landscape Image with Badge */}
              <div
                className="service-compact-card__image-wrap"
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 10",
                  borderRadius: "9px",
                  overflow: "hidden",
                  background: "#1A1715",
                }}
              >
                <img
                  src={service.image || "/images/real-bedroom-headboard.jpg"}
                  alt={service.title}
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
                  {service.title}
                </div>
              </div>

              {/* Text Below Image */}
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
                  <p
                    className="service-compact-card__desc"
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.55,
                      color: "#4E4E4E",
                      margin: "0 0 14px",
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Sub-services Pills */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      justifyContent: "center",
                      marginBottom: "16px",
                    }}
                  >
                    {service.subServices.slice(0, 3).map((sub) => (
                      <span
                        key={sub}
                        style={{
                          fontSize: "10.5px",
                          background: "rgba(184, 151, 90, 0.08)",
                          border: "1px solid rgba(184, 151, 90, 0.22)",
                          padding: "2.5px 8px",
                          borderRadius: "4px",
                          color: "#7E6334",
                          fontWeight: 500,
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preserved Outlined Button: Explore Service */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "auto", paddingTop: "8px" }}>
                  <span className="service-compact-card__btn">
                    Explore Service <ArrowRight size={12} style={{ marginLeft: "5px" }} />
                  </span>
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
              <div style={{ position: "relative", marginBottom: "24px", height: "200px", overflow: "hidden", borderRadius: "9px", border: "1.5px solid rgba(184, 151, 90, 0.35)", boxShadow: "0 4px 18px rgba(0,0,0,0.18)" }}>
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
                className="service-compact-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "center",
                }}
              >
                {/* Landscape Image with Badge */}
                <div
                  className="service-compact-card__image-wrap"
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 10",
                    borderRadius: "9px",
                    overflow: "hidden",
                    background: "#1A1715",
                  }}
                >
                  <img
                    src={s.image}
                    alt={s.name}
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
                    {s.name}
                  </div>
                </div>

                {/* Details */}
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
                    <div
                      style={{
                        fontSize: "10.5px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--gold-dark)",
                        fontWeight: 600,
                        marginBottom: "6px",
                      }}
                    >
                      {s.tagline}
                    </div>
                    <p
                      className="service-compact-card__desc"
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.55,
                        color: "#4E4E4E",
                        margin: "0 0 16px",
                      }}
                    >
                      {s.description}
                    </p>
                  </div>

                  {/* Preserved Button: Consult on this */}
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "auto", paddingTop: "8px" }}>
                    <Link
                      href="/contact"
                      className="service-compact-card__btn"
                    >
                      Consult on this <ChevronRight size={13} style={{ marginLeft: "4px" }} />
                    </Link>
                  </div>
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
