import type { Metadata } from "next";
import Link from "next/link";
import { ADDRESS, EMAIL, PHONE_NUMBER } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy | The Bright Space Interiors",
  description: "Privacy policy and client data handling guidelines for The Bright Space Interiors.",
};

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: "#F8F4EC", minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <div style={{ marginBottom: "32px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8975A" }}>
            Legal & Compliance
          </span>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "40px", color: "#1C1C1C", margin: "8px 0" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "13px", color: "#6B7280" }}>Last Updated: October 2024</p>
        </div>

        <div style={{ background: "#FFFFFF", padding: "40px", borderRadius: "14px", border: "1px solid #E6DFD3", lineHeight: 1.8, color: "#374151", fontSize: "15px" }}>
          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "0", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            1. Information We Collect
          </h2>
          <p>
            The Bright Space Interiors collects personal information necessary to deliver luxury interior design, turnkey execution, and consultation services. This includes your name, phone number, email address, physical property location, project budget, and design preferences submitted via our contact forms or direct communications.
          </p>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            2. How We Use Your Information
          </h2>
          <p>
            Your information is strictly used to:
          </p>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            <li>Schedule design consultations and physical site visits.</li>
            <li>Prepare custom 3D visualizations, material schedules, and itemized quotations.</li>
            <li>Coordinate site execution, contractors, and project milestones.</li>
            <li>Communicate project progress and warranty/handover documentation.</li>
          </ul>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            3. Client Privacy & Portfolio Photography
          </h2>
          <p>
            In accordance with our strict privacy standards, we never publish private client names, exact residential flat numbers, personal family photographs, or confidential commercial information without express written consent. Case studies featured on our website highlight architectural craftsmanship while respecting your personal privacy.
          </p>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            4. Data Security & Storage
          </h2>
          <p>
            We implement administrative and technical security measures to protect your contact data against unauthorized access. We do not sell, rent, or lease customer data to third-party marketing brokers.
          </p>

          <h2 style={{ fontSize: "20px", color: "#1C1C1C", marginTop: "28px", marginBottom: "12px", fontFamily: "Cormorant Garamond, serif" }}>
            5. Contact Our Privacy Office
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to modify your stored consultation records, please contact:
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
