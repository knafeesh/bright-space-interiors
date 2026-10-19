"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Globe,
} from "lucide-react";
import type { SiteSettings } from "@/lib/site-types";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [phone, setPhone] = useState("+91 79823 64617");
  const [altPhone, setAltPhone] = useState("+91 99993 05862");
  const [whatsapp, setWhatsapp] = useState("+91 79823 64617");
  const [email, setEmail] = useState("info@brightspaceinterior.in");
  const [address, setAddress] = useState("DLF Phase 5, Golf Course Road, Gurugram, Delhi NCR");
  const [workingHours, setWorkingHours] = useState("Mon – Sat: 10:00 AM – 7:00 PM");
  const [instagram, setInstagram] = useState("https://www.instagram.com/brightspaceinteriors");
  const [facebook, setFacebook] = useState("https://www.facebook.com/brightspaceinteriors");

  // Storage info
  const [storageInfo, setStorageInfo] = useState<string>("Firestore (Persistent Cloud)");

  // Status feedback
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 6000);
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setSettings(s);
          setPhone(s.phone || "+91 79823 64617");
          setAltPhone(s.altPhone || "+91 99993 05862");
          setWhatsapp(s.whatsapp || "+91 79823 64617");
          setEmail(s.email || "info@brightspaceinterior.in");
          setAddress(s.address || "DLF Phase 5, Golf Course Road, Gurugram, Delhi NCR");
          setWorkingHours(s.workingHours || "Mon – Sat: 10:00 AM – 7:00 PM");
          setInstagram(s.instagram || "");
          setFacebook(s.facebook || "");
        }
      } catch {
        notifyError("Failed to fetch settings from server.");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);
    setErrorMsg("");

    // Client-side validations
    const errors: string[] = [];
    if (phone.replace(/[^0-9]/g, "").length < 10) {
      errors.push("Primary Phone must contain at least 10 digits.");
    }
    if (altPhone && altPhone.replace(/[^0-9]/g, "").length < 10) {
      errors.push("Alternative Phone must contain at least 10 digits.");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push("Email address is invalid.");
    }
    if (!address.trim() || address.trim().length < 5) {
      errors.push("Address must be at least 5 characters.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload: Partial<SiteSettings> = {
      phoneNumber: phone.trim(),
      phone: phone.trim(),
      altPhoneNumber: altPhone.trim(),
      altPhone: altPhone.trim(),
      whatsappNumber: whatsapp.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      address: address.trim(),
      workingHours: workingHours.trim(),
      instagramUrl: instagram.trim(),
      instagram: instagram.trim(),
      facebookUrl: facebook.trim(),
      facebook: facebook.trim(),
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        setStorageInfo(data.storage === "firestore" ? "Firestore (Persistent Cloud)" : "Local Storage");
        notify("Settings successfully written to Firestore and synced across the website!");
      } else {
        if (data.validationErrors) {
          setValidationErrors(data.validationErrors);
        } else {
          notifyError(data.error || "Save to Firestore failed. Please verify credentials.");
        }
      }
    } catch (err) {
      notifyError("Connection failed. Could not communicate with server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toast Feedback */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#10B981",
            color: "#FFF",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Check size={16} />
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "28px",
              fontWeight: 500,
              color: "#F6F5F2",
              margin: "0 0 4px 0",
            }}
          >
            Site Settings & Contact Info
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            The single source of truth for all phone numbers, email, WhatsApp, studio address, and social links.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/contact"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View /contact
          </Link>
        </div>
      </div>

      {/* Persistence Note */}
      <div
        style={{
          background: "rgba(197, 168, 128, 0.08)",
          border: "1px solid rgba(197, 168, 128, 0.22)",
          borderRadius: "10px",
          padding: "14px 18px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <ShieldCheck size={20} color="#C5A880" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: "13px", color: "#D1D5DB", lineHeight: 1.4 }}>
          <strong>Persistent Database Source:</strong> Updating these fields updates the header, footer, WhatsApp floating button, contact page, metadata, and JSON-LD structured data on-demand.
        </div>
      </div>

      {/* Error alert banner */}
      {(errorMsg || validationErrors.length > 0) && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#EF4444", fontWeight: 600, fontSize: "14px", marginBottom: "6px" }}>
            <AlertCircle size={18} />
            <span>Settings Update Failed</span>
          </div>
          {errorMsg && <p style={{ fontSize: "13px", color: "#FCA5A5", margin: "0 0 6px 0" }}>{errorMsg}</p>}
          {validationErrors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#FCA5A5" }}>
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Main Settings Form */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF" }}>
          <Loader2 size={28} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
          <p>Loading settings from Firestore...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
          {/* Card 1: Phone Numbers & WhatsApp */}
          <div
            style={{
              background: "#161920",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Phone size={18} color="#C5A880" />
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#F3F4F6", margin: 0 }}>
                Telephony & Instant Messaging
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label className="admin-label">Primary Studio Phone *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="admin-input"
                  placeholder="+91 79823 64617"
                />
                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Used in website header, footer, and call triggers.</span>
              </div>

              <div>
                <label className="admin-label">Alternative / Secondary Phone</label>
                <input
                  type="text"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="admin-input"
                  placeholder="+91 99993 05862"
                />
                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Secondary direct mobile line for consultations.</span>
              </div>
            </div>

            <div>
              <label className="admin-label">WhatsApp Direct Number (for quick chats)</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="admin-input"
                placeholder="+91 79823 64617"
              />
              <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                Powers the floating WhatsApp widget and "Chat on WhatsApp" buttons.
              </span>
            </div>
          </div>

          {/* Card 2: Email & Address */}
          <div
            style={{
              background: "#161920",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Mail size={18} color="#C5A880" />
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#F3F4F6", margin: 0 }}>
                Email & Physical Studio Address
              </h2>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="admin-label">Official Studio Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="info@brightspaceinterior.in"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label className="admin-label">Studio Address *</label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="admin-input"
                placeholder="DLF Phase 5, Golf Course Road, Gurugram, Delhi NCR 122002"
              />
            </div>

            <div>
              <label className="admin-label">Working Hours</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                className="admin-input"
                placeholder="Mon – Sat: 10:00 AM – 7:00 PM"
              />
            </div>
          </div>

          {/* Card 3: Social Media Links */}
          <div
            style={{
              background: "#161920",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Globe size={18} color="#C5A880" />
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#F3F4F6", margin: 0 }}>
                Social Media Profiles
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label className="admin-label">Instagram Link (Leave empty to hide icon)</label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="admin-input"
                  placeholder="https://www.instagram.com/brightspaceinteriors"
                />
              </div>

              <div>
                <label className="admin-label">Facebook Link (Leave empty to hide icon)</label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="admin-input"
                  placeholder="https://www.facebook.com/brightspaceinteriors"
                />
              </div>
            </div>
          </div>

          {/* Save Button Bar */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn admin-btn--gold"
              style={{ padding: "12px 28px", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              {saving && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
              <span>{saving ? "Saving to Firestore..." : "Save Site Settings"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
