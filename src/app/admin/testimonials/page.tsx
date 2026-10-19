"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { TestimonialItem } from "@/lib/site-types";

export default function TestimonialsManagerPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("Homeowner");
  const [location, setLocation] = useState("Gurugram, DLF Phase 5");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [published, setPublished] = useState(true);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
      }
    } catch {
      notifyError("Failed to load testimonials from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setAuthor("");
    setRole("Homeowner");
    setLocation("Delhi NCR");
    setQuote("");
    setRating(5);
    setPublished(true);
    setShowModal(true);
  };

  const openEdit = (t: TestimonialItem) => {
    setEditingItem(t);
    setAuthor(t.author || t.name || "");
    setRole(t.role || t.project || "Homeowner");
    setLocation(t.location || "");
    setQuote(t.quote || "");
    setRating(t.rating || 5);
    setPublished(t.published !== false);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !quote.trim()) {
      notifyError("Author name and quote are required.");
      return;
    }

    const payload: TestimonialItem = {
      id: editingItem ? editingItem.id : Date.now(),
      author: author.trim(),
      name: author.trim(),
      role: role.trim(),
      project: role.trim(),
      location: location.trim(),
      quote: quote.trim(),
      rating: Number(rating),
      published,
      order: editingItem ? editingItem.order : testimonials.length + 1,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonial: payload }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials(data.testimonials);
        setShowModal(false);
        setEditingItem(null);
        notify("Testimonial saved and synced to Firestore!");
      } else {
        notifyError(data.error || "Failed to save testimonial.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (t: TestimonialItem) => {
    const updated = { ...t, published: t.published === false ? true : false };
    setSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonial: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
        notify(`Testimonial is now ${updated.published ? "Published" : "Draft"}.`);
      } else {
        notifyError("Failed to update status.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
        notify("Testimonial deleted from Firestore.");
      } else {
        notifyError(data.error || "Failed to delete.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= testimonials.length) return;

    const list = [...testimonials];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setTestimonials(reordered);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk", testimonials: reordered }),
      });
      const data = await res.json();
      if (data.success) {
        notify("Testimonials reordered and saved.");
      } else {
        notifyError("Failed to save reorder.");
        loadTestimonials();
      }
    } catch {
      notifyError("Network error.");
      loadTestimonials();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Toast notifications */}
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

      {errorMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#EF4444",
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
          <AlertCircle size={16} />
          {errorMsg}
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
            Client Testimonials
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Curate customer reviews and testimonials displayed on the homepage. Saved directly to Firestore.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={openAdd}
            className="admin-btn admin-btn--gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> Add Testimonial
          </button>
          <Link
            href="/#testimonials"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View On Site
          </Link>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Order</th>
              <th>Client Name & Role</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Quote</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                  <p style={{ margin: 0, color: "#9CA3AF" }}>Loading testimonials...</p>
                </td>
              </tr>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                  No testimonials found. Click "Add Testimonial" to create one.
                </td>
              </tr>
            ) : (
              testimonials.map((t, idx) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <button
                        onClick={() => handleReorder(idx, "up")}
                        disabled={idx === 0 || saving}
                        style={{
                          background: "none",
                          border: "none",
                          color: idx === 0 ? "#4B5563" : "#C5A880",
                          cursor: idx === 0 ? "not-allowed" : "pointer",
                          padding: "2px",
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleReorder(idx, "down")}
                        disabled={idx === testimonials.length - 1 || saving}
                        style={{
                          background: "none",
                          border: "none",
                          color: idx === testimonials.length - 1 ? "#4B5563" : "#C5A880",
                          cursor: idx === testimonials.length - 1 ? "not-allowed" : "pointer",
                          padding: "2px",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#F3F4F6", fontSize: "14px" }}>
                      {t.author || t.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{t.role || t.project}</div>
                  </td>
                  <td style={{ fontSize: "13px", color: "#D1D5DB" }}>{t.location || "Delhi NCR"}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#FBBF24" }}>
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} size={14} fill="#FBBF24" />
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: "13px", color: "#D1D5DB", maxWidth: "340px", lineHeight: 1.4 }}>
                    "{t.quote}"
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublished(t)}
                      disabled={saving}
                      style={{
                        background: t.published !== false ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        border: `1px solid ${t.published !== false ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                        color: t.published !== false ? "#10B981" : "#F59E0B",
                        padding: "4px 10px",
                        borderRadius: "14px",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {t.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{t.published !== false ? "Published" : "Draft"}</span>
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(t)}
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px" }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px", color: "#EF4444" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Add / Edit Testimonial */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "560px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                {editingItem ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. Vikramaditya Singhania"
                  />
                </div>
                <div>
                  <label className="admin-label">Role / Project Type</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. Luxury Penthouse Owner"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. DLF Magnolias, Gurugram"
                  />
                </div>
                <div>
                  <label className="admin-label">Star Rating (1–5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="admin-select"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Client Feedback Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="admin-input"
                  placeholder="The design philosophy, precision craftsmanship, and turnkey handover surpassed all expectations..."
                />
              </div>

              <div>
                <label className="admin-label">Status</label>
                <select
                  value={published ? "true" : "false"}
                  onChange={(e) => setPublished(e.target.value === "true")}
                  className="admin-select"
                >
                  <option value="true">Published (Live on Website)</option>
                  <option value="false">Draft (Hidden)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-btn admin-btn--outline"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--gold"
                  disabled={saving}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {saving && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                  <span>Save Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
