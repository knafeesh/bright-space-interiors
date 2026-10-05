"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle, Phone, ArrowRight, Home } from "lucide-react";
import { WHATSAPP_NUMBER, PHONE_NUMBER, ALT_PHONE_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "there";

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello The Bright Space Interiors, I just submitted an enquiry on your website. My name is ${name}. I'd like to discuss my project.`
  )}`;

  return (
    <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px" }}>
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E6DFD3",
          padding: "48px 36px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(28,28,28,0.06)",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(184, 151, 90, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <CheckCircle2 size={40} style={{ color: "#B8975A" }} />
        </div>

        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#B8975A",
            display: "block",
            marginBottom: "8px",
          }}
        >
          Enquiry Received
        </span>

        <h1
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "36px",
            fontWeight: 400,
            color: "#1C1C1C",
            margin: "0 0 16px",
          }}
        >
          Thank You, {name}!
        </h1>

        <p
          style={{
            fontSize: "15px",
            color: "#6B7280",
            lineHeight: 1.7,
            margin: "0 auto 32px",
            maxWidth: "460px",
          }}
        >
          We have received your project details and logged them in our CRM. Our principal designer, Mohd Mushir, or a project specialist will get in touch with you within 24 hours.
        </p>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "36px" }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "14px 28px",
              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
              color: "#FFF",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(37,211,102,0.25)",
            }}
          >
            <MessageCircle size={18} />
            Connect Instantly on WhatsApp
          </a>

          <a
            href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "12px 28px",
              border: "1px solid #E6DFD3",
              background: "#F8F4EC",
              color: "#1C1C1C",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            <Phone size={16} style={{ color: "#B8975A" }} />
            Call Principal Office ({PHONE_NUMBER})
          </a>
        </div>

        {/* Steps Preview */}
        <div
          style={{
            background: "#F8F4EC",
            borderRadius: "12px",
            padding: "20px 24px",
            textAlign: "left",
            marginBottom: "32px",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1C1C1C", marginBottom: "12px" }}>
            What Happens Next?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", color: "#4B5563" }}>
            <div><strong>1. Free Consultation:</strong> We review your space requirements and budget.</div>
            <div><strong>2. Site Visit:</strong> We conduct detailed site measurements across Delhi NCR.</div>
            <div><strong>3. 3D Concept & Quotation:</strong> You receive an itemized proposal with photorealistic renders.</div>
          </div>
        </div>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#6B7280",
            textDecoration: "none",
          }}
        >
          <Home size={15} /> Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          Loading...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
