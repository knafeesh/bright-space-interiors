import type { Metadata } from "next";
import Link from "next/link";
import { PROCESS_STEPS, WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import DesignToMoveInSection from "@/components/ui/DesignToMoveInSection";

export const metadata: Metadata = {
  title: "From Design to Move-In | The Bright Space Interiors",
  description:
    "Discover our seamless customer journey from initial design consultation to final installation and handover. The Bright Space Interiors guarantees precision, quality, and complete peace of mind.",
};

export default function ProcessPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero" aria-label="From design to move-in hero">
        <div
          className="page-hero__bg"
          style={{ background: "linear-gradient(135deg, #1A1512 0%, #26221A 50%, #1C1C1C 100%)" }}
        />
        <div className="page-hero__overlay" />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> / Customer Journey
          </div>
          <h1 className="page-hero__title">
            From Design<br />
            To Move-In
          </h1>
        </div>
      </section>

      {/* Intro Stats */}
      <section className="section" style={{ background: "var(--stone)", padding: "64px 0" }} aria-label="Customer journey intro">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <span className="eyebrow">The Experience</span>
              <h2 style={{ marginTop: "16px", marginBottom: "20px" }}>
                A Seamless Journey to<br />Your Dream Space
              </h2>
              <div className="title-line" />
              <p style={{ marginTop: "24px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                We believe that world-class interior design should be transparent, enjoyable, and completely stress-free.
                Our complete customer journey guides you smoothly through each phase — from your first 3D vision
                and precision laser measurement to custom production and key handover.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {[
                { num: "6", label: "Defined Steps" },
                { num: "9+", label: "Years Experience" },
                { num: "100+", label: "Delivered Spaces" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--ivory)",
                    padding: "24px 16px",
                    textAlign: "center",
                    borderRadius: "12px",
                    border: "1.5px solid rgba(184, 151, 90, 0.25)",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "36px", color: "var(--gold)", lineHeight: 1 }}>
                    {stat.num}
                  </div>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginTop: "8px" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FROM DESIGN TO MOVE-IN CAROUSEL COMPONENT ── */}
      <DesignToMoveInSection />

      {/* Detailed 6-Step Breakdown Section */}
      <section className="section" style={{ background: "#FFFFFF", padding: "80px 0" }} aria-label="Detailed process steps">
        <div className="container">
          <div className="section-title--center" style={{ marginBottom: "56px" }}>
            <span className="eyebrow">Step-by-Step Clarity</span>
            <h2 style={{ textAlign: "center" }}>Every Stage Explained</h2>
            <div className="title-line--center title-line" />
            <p style={{ textAlign: "center", maxWidth: "640px", margin: "16px auto 0" }}>
              Here is what to expect as our expert designers, architects, and master craftspeople bring your space to life.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                id={`detailed-step-${step.step}`}
                style={{
                  background: "var(--ivory, #FAF7F2)",
                  border: "1.5px solid rgba(184, 151, 90, 0.32)",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  boxShadow: "0 4px 18px rgba(28, 28, 28, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        padding: "3.5px 12px",
                        borderRadius: "50px",
                        background: "rgba(184, 151, 90, 0.12)",
                        border: "1px solid rgba(184, 151, 90, 0.4)",
                        color: "var(--gold-dark, #8C7148)",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      STEP 0{step.step}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "36px",
                        color: "rgba(184, 151, 90, 0.18)",
                        lineHeight: 1,
                      }}
                    >
                      0{step.step}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "19px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      color: "var(--charcoal, #1C1C1C)",
                      textTransform: "uppercase",
                      margin: "0 0 12px",
                      lineHeight: 1.35,
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.65,
                      color: "#4E4E4E",
                      margin: 0,
                    }}
                  >
                    “{step.description}”
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "24px",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(184, 151, 90, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--gold-dark, #8C7148)",
                    }}
                  >
                    Stage {step.step} of 6
                  </span>
                  <div
                    style={{
                      width: "36px",
                      height: "3px",
                      borderRadius: "2px",
                      background: "var(--gold, #B8975A)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-band" aria-label="Process CTA">
        <div className="cta-band__eyebrow">Step One Starts Here</div>
        <h2 className="cta-band__title">
          Ready to Begin<br />
          Your <em>Journey?</em>
        </h2>
        <p className="cta-band__subtitle">
          Book a free design consultation — tell us your vision and share your floor plan.
        </p>
        <div className="cta-band__actions">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
            id="process-cta-whatsapp"
          >
            Get Free Consultation <ArrowRight size={14} />
          </a>
          <Link href="/contact" className="btn btn--outline-white btn--large" id="process-cta-contact">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
