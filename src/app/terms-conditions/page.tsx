import type { Metadata } from "next";
import Link from "next/link";
import { ADDRESS, EMAIL, PHONE_NUMBER } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions | The Bright Space Interiors",
  description: "Terms and conditions for interior design, turnkey projects, and services provided by The Bright Space Interiors.",
};

export default function TermsConditionsPage() {
  return (
    <div style={{ background: "#F8F4EC", minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "32px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8975A" }}>
            Contractual Guidelines
          </span>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "40px", color: "#1C1C1C", margin: "8px 0" }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: "13px", color: "#6B7280" }}>Last Updated: October 2024</p>
        </div>

        <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "14px", border: "1px solid #E6DFD3", lineHeight: 1.8, color: "#374151", fontSize: "15px" }}>
          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "0", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            1. Scope of Services
          </h2>
          <p>
            The Bright Space Interiors provides residential interior design, commercial interior design, turnkey build/execution, project management, and custom furniture fabrication. The precise scope, deliverables, timeline, and material schedule for each engagement are defined in the mutually approved Project Agreement and Bill of Quantities (BOQ).
          </p>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            2. Design Proposals & 3D Visualizations
          </h2>
          <p>
            Conceptual drawings, 3D renderings, and mood boards presented during the design development phase represent artistic impressions. Final material selections, architectural tolerances, and site dimensions confirmed during execution govern the physical deliverable.
          </p>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            3. Quotations & Payment Milestones
          </h2>
          <p>
            All quotations provided by The Bright Space Interiors remain valid for 30 calendar days from the date of issue. Turnkey and execution projects proceed according to agreed milestone payment stages: Initial Booking Advance, Design Sign-off & Procurement, Civil/MEP Execution, Finishing/Carpentry, and Final Handover Balance.
          </p>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            4. Quality Assurance & Snags Handover
          </h2>
          <p>
            Upon completion of site works, a joint walk-through inspection is conducted. Any minor snags or adjustments are documented in a formal Snag List and resolved promptly prior to final handover certificate issuance.
          </p>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            5. Jurisdiction & Contact
          </h2>
          <p>
            These terms are governed by the laws of India, subject to the jurisdiction of the courts of New Delhi. For legal or contractual inquiries:
          </p>
          <div style={{ background: "#F8F4EC", padding: "18px 24px", borderRadius: "8px", marginTop: "12px", fontSize: "14px" }}>
            <div><strong>The Bright Space Interiors</strong></div>
            <div>Registered & Corporate Office: {ADDRESS}</div>
            <div>Email: <a href={`mailto:${EMAIL}`} style={{ color: "#B8975A" }}>{EMAIL}</a></div>
            <div>Phone: <a href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`} style={{ color: "#B8975A" }}>{PHONE_NUMBER}</a></div>
          </div>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <Link href="/" style={{ color: "#B8975A", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
            ← Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
