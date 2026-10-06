import type { Metadata } from "next";
import Link from "next/link";
import { PROCESS_STEPS, WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Process",
  description:
    "Discover Bright Space Interiors' 9-step design and execution process — from consultation to final handover, designed for a stress-free experience.",
};

export default function ProcessPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero" aria-label="Process hero">
        <div
          className="page-hero__bg"
          style={{ background: "linear-gradient(135deg, #1A1512 0%, #26221A 50%, #1C1C1C 100%)" }}
        />
        <div className="page-hero__overlay" />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> / Process
          </div>
          <h1 className="page-hero__title">
            How We<br />
            Work
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section" style={{ background: "var(--stone)", padding: "64px 0" }} aria-label="Process intro">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <span className="eyebrow">Our Process</span>
              <h2 style={{ marginTop: "16px", marginBottom: "20px" }}>
                9 Steps to Your<br />Dream Space
              </h2>
              <div className="title-line" />
              <p style={{ marginTop: "24px" }}>
                We believe that great design comes from a great process. Our
                9-step journey is designed to keep you informed, involved, and
                delighted at every stage — from the first conversation to the
                moment you walk through the door of your finished space.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {[
                { num: "9", label: "Process Steps" },
                { num: "9+", label: "Years Experience" },
                { num: "240+", label: "Projects Delivered" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ background: "var(--ivory)", padding: "24px", textAlign: "center" }}
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

      {/* Full Timeline */}
      <section className="process-section section" aria-label="Process steps">
        <div className="container">
          <div className="process-full-timeline">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="process-full-step"
                id={`process-step-${step.step}`}
              >
                <div className="process-full-step__num">0{step.step}</div>
                <div className="process-full-step__content">
                  <h3 className="process-full-step__title">{step.title}</h3>
                  <p className="process-full-step__desc">{step.description}</p>

                  <div className="process-deliverables">
                    <div className="process-deliverable">
                      <div className="process-deliverable__label">You Provide</div>
                      <ul className="process-deliverable__list">
                        <li className="process-deliverable__item">{step.clientDoes}</li>
                      </ul>
                    </div>
                    <div className="process-deliverable">
                      <div className="process-deliverable__label">We Deliver</div>
                      <ul className="process-deliverable__list">
                        <li className="process-deliverable__item">{step.weDeliver}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" aria-label="Process CTA">
        <div className="cta-band__eyebrow">Step One Starts Here</div>
        <h2 className="cta-band__title">
          Ready to Begin<br />
          Your <em>Journey?</em>
        </h2>
        <p className="cta-band__subtitle">
          Book a free consultation — the first step is just a conversation.
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
