"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { saveNewLead } from "@/lib/leads";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import {
  WHATSAPP_NUMBER,
  PHONE_NUMBER,
  ALT_PHONE_NUMBER,
  EMAIL,
  INSTAGRAM_URL,
  ADDRESS,
  WHATSAPP_MESSAGE,
} from "@/lib/data";

const PROJECT_TYPES = [
  "Residential — Apartment/Flat",
  "Residential — Villa/Bungalow",
  "Commercial — Office",
  "Commercial — Restaurant/Café",
  "Commercial — Retail/Showroom",
  "Commercial — Hotel/Hospitality",
  "Salon/Spa",
  "Turnkey Project",
  "Design & 3D Only",
  "Other",
];

const BUDGET_RANGES = [
  "Under ₹5 Lakhs",
  "₹5 – 10 Lakhs",
  "₹10 – 25 Lakhs",
  "₹25 – 50 Lakhs",
  "₹50 Lakhs – 1 Crore",
  "Above ₹1 Crore",
  "To be Discussed",
];

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    location: "",
    budget: "",
    message: "",
    contactTime: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) {
      e.phone = "Phone is required";
    } else {
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 10) {
        e.phone = "Enter a valid phone number (at least 10 digits)";
      }
    }
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.projectType) e.projectType = "Please select a project type";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await saveNewLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        project: form.projectType,
        location: form.location.trim() || "Delhi NCR",
        budget: form.budget || "₹10–25 Lakhs",
        source: "Form",
        status: "New",
        assigned: "Mohd Mushir",
        tags: ["Website Lead"],
        notes: form.message.trim(),
      });
      router.push(`/thank-you?name=${encodeURIComponent(form.name.trim())}`);
    } catch (err) {
      console.error("Error saving lead:", err);
    }
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero" aria-label="Contact hero">
        <div
          className="page-hero__bg"
          style={{ background: "linear-gradient(135deg, #1A1512 0%, #1C2226 60%, #1A1A1A 100%)" }}
        />
        <div className="page-hero__overlay" />
        <div className="page-hero__content container">
          <div className="page-hero__breadcrumb">
            <Link href="/">Home</Link> / Contact
          </div>
          <h1 className="page-hero__title">
            Let's Start<br />
            a Conversation
          </h1>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section section" aria-label="Contact">
        <div className="container">
          <div className="contact-section__inner">
            {/* Left: Info */}
            <div className="contact-info">
              <span className="eyebrow">Reach Us</span>
              <h2 style={{ marginTop: "16px", marginBottom: "20px" }}>
                We're Here<br />to Help
              </h2>
              <div className="title-line" />
              <p style={{ marginTop: "24px", marginBottom: "40px" }}>
                Whether you have a detailed brief or just an idea — reach out.
                Our team will guide you through the next steps.
              </p>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-action"
                id="contact-whatsapp-link"
              >
                <div className="contact-action__icon">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div className="contact-action__label">WhatsApp</div>
                  <div className="contact-action__value">{PHONE_NUMBER}</div>
                </div>
              </a>

              <a href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`} className="contact-action" id="contact-phone-link">
                <div className="contact-action__icon">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-action__label">Call Studio</div>
                  <div className="contact-action__value">{PHONE_NUMBER} / {ALT_PHONE_NUMBER}</div>
                </div>
              </a>

              <a href={`mailto:${EMAIL}`} className="contact-action" id="contact-email-link">
                <div className="contact-action__icon">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="contact-action__label">Email</div>
                  <div className="contact-action__value">{EMAIL}</div>
                </div>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-action"
                id="contact-instagram-link"
              >
                <div className="contact-action__icon">
                  <InstagramIcon size={20} />
                </div>
                <div>
                  <div className="contact-action__label">Instagram</div>
                  <div className="contact-action__value">@thebrightspaceinterior</div>
                </div>
              </a>

              <div style={{ marginTop: "32px", padding: "24px", background: "var(--stone)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                  <MapPin size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Registered & Corporate Office
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                      {ADDRESS}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <Clock size={16} style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Working Hours
                    </div>
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                      Monday – Saturday: 9:00 AM – 7:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {submitted ? (
                <div
                  className="contact-form"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "480px", gap: "20px" }}
                >
                  <CheckCircle size={56} style={{ color: "var(--gold)" }} />
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400 }}>
                    Thank You, {form.name}!
                  </h3>
                  <p style={{ color: "var(--text-secondary)", maxWidth: "340px" }}>
                    We've received your enquiry and will get back to you within 24 hours.
                    For immediate response, WhatsApp us.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20just%20submitted%20an%20enquiry%20on%20your%20website`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--primary"
                    id="contact-form-whatsapp"
                  >
                    WhatsApp Us Now
                  </a>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate aria-label="Enquiry form">
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 400, marginBottom: "32px" }}>
                    Send Us an Enquiry
                  </h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-name">Full Name *</label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        className="form-input"
                        placeholder="Mohd Mushir"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                      {errors.name && <span style={{ fontSize: "12px", color: "#e74c3c", marginTop: "4px", display: "block" }}>{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-phone">Phone Number *</label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        className="form-input"
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                      {errors.phone && <span style={{ fontSize: "12px", color: "#e74c3c", marginTop: "4px", display: "block" }}>{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">Email Address</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span style={{ fontSize: "12px", color: "#e74c3c", marginTop: "4px", display: "block" }}>{errors.email}</span>}
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-project-type">Project Type *</label>
                      <select
                        id="contact-project-type"
                        name="projectType"
                        className="form-select"
                        value={form.projectType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select type…</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.projectType && <span style={{ fontSize: "12px", color: "#e74c3c", marginTop: "4px", display: "block" }}>{errors.projectType}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-location">Location / City</label>
                      <input
                        id="contact-location"
                        name="location"
                        type="text"
                        className="form-input"
                        placeholder="e.g. South Delhi, Gurugram, Noida"
                        value={form.location}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-budget">Approximate Budget</label>
                    <select
                      id="contact-budget"
                      name="budget"
                      className="form-select"
                      value={form.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select budget range…</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-message">Your Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-textarea"
                      placeholder="Tell us about your project, style preferences, or any specific requirements…"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary btn--large"
                    style={{ width: "100%", justifyContent: "center" }}
                    id="contact-form-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      "Sending…"
                    ) : (
                      <>
                        Send Enquiry <Send size={14} />
                      </>
                    )}
                  </button>

                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "16px", textAlign: "center" }}>
                    We respond within 24 hours. Your information is kept strictly private.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section" aria-label="Office location map">
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--stone)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <MapPin size={36} style={{ color: "var(--gold)" }} />
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", color: "var(--charcoal)" }}>
            Find Us on the Map
          </div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "460px" }}>
            {ADDRESS}
          </div>
          <a
            href="https://maps.google.com/?q=J4/56J+Khirki+Extension+Malviya+Nagar+New+Delhi+110017"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--outline"
            style={{ marginTop: "12px" }}
            id="contact-map-link"
          >
            Open in Google Maps
          </a>
        </div>
      </section>
    </>
  );
}
