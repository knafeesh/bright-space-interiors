"use client";
import { useState } from "react";
import Link from "next/link";
import { TESTIMONIALS as INITIAL_TESTIMONIALS } from "@/lib/data";
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle,
  X,
  MessageSquareQuote,
} from "lucide-react";

export default function TestimonialsManagerPage() {
  const [testimonials, setTestimonials] = useState(
    INITIAL_TESTIMONIALS.map((t) => ({ ...t, status: "Published" }))
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [clientName, setClientName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !quote.trim()) return;

    const newReview = {
      id: Date.now(),
      name: clientName.trim(),
      project: projectLocation.trim() || "Residential Interior",
      rating: Number(rating),
      quote: quote.trim(),
      status: "Published",
    };

    setTestimonials([newReview, ...testimonials]);
    setShowAddModal(false);
    setClientName("");
    setProjectLocation("");
    setQuote("");
    setRating(5);
  };

  const handleToggleStatus = (id: number) => {
    setTestimonials(
      testimonials.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Published" ? "Draft" : "Published" }
          : t
      )
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this client review?")) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Client Testimonials
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Curate customer feedback, reviews, and testimonials displayed on the homepage
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/#testimonials" target="_blank" className="admin-btn admin-btn--outline" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ExternalLink size={14} /> View On Site
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn--primary"
            id="testimonial-add-btn"
          >
            <Plus size={14} /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Review Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px", marginBottom: "24px" }}>
        <div className="stat-card" style={{ margin: 0 }}>
          <div className="stat-card__label">Average Rating</div>
          <div className="stat-card__value" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            5.0 <Star size={24} fill="var(--gold)" color="var(--gold)" />
          </div>
          <div className="stat-card__change" style={{ color: "#27AE60" }}>100% 5-Star Reviews</div>
        </div>

        <div className="stat-card" style={{ margin: 0 }}>
          <div className="stat-card__label">Total Testimonials</div>
          <div className="stat-card__value">{testimonials.length}</div>
          <div className="stat-card__change" style={{ color: "var(--text-muted)" }}>Verified Clients</div>
        </div>

        <div className="stat-card" style={{ margin: 0 }}>
          <div className="stat-card__label">Published on Website</div>
          <div className="stat-card__value">
            {testimonials.filter((t) => t.status === "Published").length}
          </div>
          <div className="stat-card__change" style={{ color: "var(--gold)" }}>Live on Homepage</div>
        </div>
      </div>

      {/* Testimonials List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="admin-table-wrap"
            style={{ margin: 0, padding: "24px", display: "flex", flexDirection: "column", position: "relative" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < t.rating ? "var(--gold)" : "#E0E0E0"}
                      color={i < t.rating ? "var(--gold)" : "#E0E0E0"}
                    />
                  ))}
                </div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: 600, color: "var(--charcoal)" }}>
                  {t.name}
                </h3>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.project}</div>
              </div>

              <button
                onClick={() => handleToggleStatus(t.id)}
                className={`status-badge ${t.status === "Published" ? "status-badge--won" : "status-badge--draft"}`}
                style={{ border: "none", cursor: "pointer" }}
                title="Click to toggle status"
              >
                {t.status}
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic", flex: 1, marginBottom: "20px" }}>
              &ldquo;{t.quote}&rdquo;
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", paddingTop: "12px", borderTop: "1px solid #F0F0F0" }}>
              <button
                onClick={() => handleDelete(t.id)}
                className="admin-btn"
                style={{ background: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 12px", fontSize: "12px", borderRadius: "6px", cursor: "pointer" }}
                title="Delete Testimonial"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="admin-table-wrap"
            style={{ width: "100%", maxWidth: "520px", padding: "32px", margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px" }}>Add Client Review</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTestimonial}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Sneha Kapoor"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Project / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Duplex Penthouse, Juhu"
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Star Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Client feedback regarding design quality, communication, and turnkey handover..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
