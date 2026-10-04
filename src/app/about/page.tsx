import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEAM_MEMBERS, WHY_US_PILLARS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story behind Bright Space Interiors — our founding philosophy, team, and commitment to crafting luxury spaces with precision and heart.",
};

const MILESTONES = [
  { year: "2012", event: "Studio Founded", desc: "Mohd Mushir founded Bright Space Interiors with a vision for quiet luxury.", side: "left" },
  { year: "2015", event: "50 Projects Milestone", desc: "Completed 50 residential projects across Mumbai.", side: "right" },
  { year: "2018", event: "Commercial Launch", desc: "Expanded into commercial design — offices, restaurants, and hospitality.", side: "left" },
  { year: "2020", event: "Turnkey Division", desc: "Launched our end-to-end turnkey execution service.", side: "right" },
  { year: "2022", event: "200+ Projects", desc: "Crossed 200 completed projects and expanded to Pune and Bangalore.", side: "left" },
  { year: "2024", event: "Award & Recognition", desc: "Recognized as one of India's top boutique interior studios.", side: "right" },
];

const ICON_COLORS = ["shield", "users", "gem", "clock", "message"];

export default function AboutPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="page-hero" aria-label="About hero" style={{ position: "relative" }}>
        <div
          className="page-hero__bg"
          style={{
            backgroundImage: "url(/images/about-hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="page-hero__overlay"
          style={{
            background: "linear-gradient(to right, rgba(28, 24, 22, 0.88) 0%, rgba(28, 24, 22, 0.6) 100%)",
          }}
        />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> / About Us
          </div>
          <h1 className="page-hero__title">
            Our Story.<br />Our Vision.
          </h1>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story section" aria-label="Our story">
        <div className="container">
          <div className="about-story__inner">
            <div className="about-story__sticky">
              <div
                className="about-story__image"
                style={{
                  background: "#1C1C1C",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src="/images/about-story.jpg"
                  alt="Our design studio at work"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "24px",
                  background: "linear-gradient(to top, rgba(28,20,14,0.85) 0%, transparent 100%)",
                }}>
                  <div style={{ fontSize: "10px", letterSpacing: "0.35em", color: "rgba(184,151,90,0.9)", textTransform: "uppercase" }}>
                    Est. 2012 · Mumbai, India
                  </div>
                </div>
              </div>
            </div>

            <div className="about-story__content">
              <span className="eyebrow">Our Story</span>
              <h2 style={{ marginTop: "16px", marginBottom: "20px" }}>
                Designing With<br />Purpose & Passion
              </h2>
              <div className="title-line" />

              <p style={{ marginTop: "24px" }}>
                Bright Space Interiors was founded in 2012 by Mohd Mushir —
                a designer who believed that a beautifully designed space isn't
                a luxury, it's a necessity. Growing up surrounded by architecture
                and craft, he developed a sensitivity to how spaces affect mood,
                productivity, and belonging.
              </p>

              <blockquote>
                "Design is not decoration. It's the careful orchestration of
                light, material, proportion, and feeling."
                <br />
                <cite style={{ fontSize: "13px", fontStyle: "normal", color: "var(--gold)", display: "block", marginTop: "12px" }}>
                  — Mohd Mushir, Founder
                </cite>
              </blockquote>

              <p>
                What began as a small residential practice has grown into a
                full-service studio of 18 designers, project managers, and
                craftspeople — delivering over 240 projects across India's
                leading cities. We specialize in spaces that feel both
                extraordinary and entirely yours.
              </p>

              <p style={{ marginTop: "20px" }}>
                Every project begins with listening. We invest time in
                understanding not just your brief, but your life — the way you
                move through a space, the light you love, the textures that make
                you feel at home. That understanding is what transforms a
                beautiful interior into an extraordinary one.
              </p>

              <div style={{ marginTop: "40px" }}>
                <Link href="/contact" className="btn btn--primary" id="about-contact-cta">
                  Start Your Project <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision section" aria-label="Mission and vision">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">Our Foundation</span>
            <h2 style={{ textAlign: "center" }}>Mission & Vision</h2>
            <div className="title-line--center title-line" />
          </div>

          <div className="mission-vision__grid">
            <div className="mv-card">
              <div className="mv-card__label">Our Mission</div>
              <div className="mv-card__title">
                To craft spaces that<br />enrich lives
              </div>
              <p>
                We are committed to delivering interior design that transcends
                aesthetics — spaces that are functional, sustainable, and
                emotionally resonant. Every project is a collaboration, and
                every delivery is a promise kept.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-card__label">Our Vision</div>
              <div className="mv-card__title">
                To be India's most<br />trusted studio
              </div>
              <p>
                We aspire to be the first name that comes to mind when someone
                imagines a premium, trustworthy interior design partner — a
                studio known for its honesty, craft, and the transformative
                power of its spaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section section" aria-label="Our team">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">The People</span>
            <h2 style={{ textAlign: "center" }}>Meet Our Team</h2>
            <div className="title-line--center title-line" />
            <p style={{ textAlign: "center" }}>
              A passionate team of designers, visualizers, and project managers
              dedicated to delivering exceptional spaces.
            </p>
          </div>

          <div className="team-grid">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="team-card" id={`team-${member.id}`}>
                <div className="team-card__photo-wrap">
                  <div
                    className="team-card__photo"
                    style={{ overflow: "hidden", position: "relative" }}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center top",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(160deg, #2E2418 0%, #3D3025 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "48px",
                        fontWeight: 300,
                        color: "rgba(184,151,90,0.4)",
                      }}>
                        {member.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="team-card__name">{member.name}</div>
                <div className="team-card__role">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="milestone-timeline section" aria-label="Milestones">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow" style={{ color: "var(--gold-light)" }}>Our Journey</span>
            <h2 style={{ textAlign: "center", color: "var(--ivory)" }}>12 Years of Excellence</h2>
            <div className="title-line--center title-line" />
          </div>

          <div className="milestones">
            {MILESTONES.map((m, i) => (
              <div key={i} className={`milestone${m.side === "right" ? " milestone--right" : ""}`}>
                {m.side === "left" ? (
                  <>
                    <div className="milestone__content">
                      <div className="milestone__event">{m.event}</div>
                      <p className="milestone__desc">{m.desc}</p>
                    </div>
                    <div className="milestone__year">{m.year}</div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="milestone__year">{m.year}</div>
                    <div className="milestone__content" style={{ textAlign: "left" }}>
                      <div className="milestone__event">{m.event}</div>
                      <p className="milestone__desc">{m.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us section" aria-label="Why choose us">
        <div className="container">
          <div className="section-title--center">
            <span className="eyebrow">Our Commitment</span>
            <h2 style={{ color: "var(--ivory)", textAlign: "center" }}>
              Why Clients Choose Us
            </h2>
            <div className="title-line--center title-line" />
          </div>

          <div className="why-us__grid">
            {WHY_US_PILLARS.map((pillar) => (
              <div key={pillar.title} className="why-us__pillar">
                <div className="why-us__pillar-title">{pillar.title}</div>
                <p className="why-us__pillar-text">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band" aria-label="Contact CTA">
        <div className="cta-band__eyebrow">Let's Create Together</div>
        <h2 className="cta-band__title">
          Begin Your Project<br />
          with a <em>Free Consultation</em>
        </h2>
        <p className="cta-band__subtitle">
          Talk to our design team — no obligations, just ideas.
        </p>
        <div className="cta-band__actions">
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20a%20free%20consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
            id="about-cta-whatsapp"
          >
            WhatsApp Us
          </a>
          <Link href="/contact" className="btn btn--outline-white btn--large" id="about-cta-contact">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
