"use client";
import { useState } from "react";
import {
  Settings,
  Save,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Shield,
  Bell,
  CheckCircle,
} from "lucide-react";
import {
  WHATSAPP_NUMBER,
  PHONE_NUMBER,
  EMAIL,
  ADDRESS,
} from "@/lib/data";

export default function SettingsAdminPage() {
  const [phone, setPhone] = useState(PHONE_NUMBER);
  const [whatsapp, setWhatsapp] = useState(WHATSAPP_NUMBER);
  const [email, setEmail] = useState(EMAIL);
  const [address, setAddress] = useState(ADDRESS);
  const [adminName, setAdminName] = useState("Mohd Mushir");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            System Settings
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Configure studio credentials, lead alert channels, and administrator profile
          </p>
        </div>

        {saved && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "6px",
              background: "#D1FAE5",
              color: "#065F46",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <CheckCircle size={16} /> Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
        {/* Administrator Profile */}
        <div className="admin-table-wrap" style={{ margin: 0, padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Shield size={18} style={{ color: "var(--gold)" }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", color: "var(--charcoal)" }}>
              Administrator Profile
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                Admin Full Name
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                Role & Permissions
              </label>
              <input
                type="text"
                value="Super Admin (Full Access)"
                disabled
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", background: "#F9FAFB", color: "var(--text-muted)" }}
              />
            </div>
          </div>
        </div>

        {/* Public Contact Details */}
        <div className="admin-table-wrap" style={{ margin: 0, padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Phone size={18} style={{ color: "var(--gold)" }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", color: "var(--charcoal)" }}>
              Studio Contact & Inquiry Routing
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                Official Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
                WhatsApp Floating Chat Number
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
              Studio Support Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>
              Registered Studio Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", fontFamily: "inherit" }}
            />
          </div>
        </div>

        {/* Real-time Inquiry Alerts */}
        <div className="admin-table-wrap" style={{ margin: 0, padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Bell size={18} style={{ color: "var(--gold)" }} />
            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", color: "var(--charcoal)" }}>
              Instant Lead Notifications
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--gold)" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--charcoal)" }}>
                  Instant WhatsApp Notification on New Website Inquiry
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Receive immediate client contact details on WhatsApp when a lead fills the consultation form
                </div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--gold)" }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--charcoal)" }}>
                  Email Digest & Real-time Notification
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Sends client briefing details to {email}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", fontSize: "14px" }}
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </>
  );
}
