"use client";
import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  Filter,
} from "lucide-react";
import type { EnquiryItem } from "@/lib/site-types";

const STATUSES = ["All", "New", "Contacted", "Won", "Lost"] as const;

export default function EnquiriesManagerPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  // Feedback states
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Selected enquiry for detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/enquiries", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
      }
    } catch {
      notifyError("Failed to load customer enquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
        notify(`Status updated to "${newStatus}"!`);
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      } else {
        notifyError(data.error || "Failed to update status.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
        notify("Enquiry deleted.");
      } else {
        notifyError(data.error || "Failed to delete.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesStatus = statusFilter === "All" || (e.status || "New").toLowerCase() === statusFilter.toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch =
      e.name.toLowerCase().includes(query) ||
      e.phone.toLowerCase().includes(query) ||
      (e.email && e.email.toLowerCase().includes(query)) ||
      (e.location && e.location.toLowerCase().includes(query)) ||
      (e.projectType && e.projectType.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const countsByStatus = {
    All: enquiries.length,
    New: enquiries.filter((e) => (e.status || "New").toLowerCase() === "new").length,
    Contacted: enquiries.filter((e) => (e.status || "").toLowerCase() === "contacted").length,
    Won: enquiries.filter((e) => (e.status || "").toLowerCase() === "won").length,
    Lost: enquiries.filter((e) => (e.status || "").toLowerCase() === "lost").length,
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
          <CheckCircle size={16} />
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
            Customer Enquiries & Form Submissions
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Every contact form submission from the website is written to Firestore. Filter and update lead progression status.
          </p>
        </div>

        <button
          onClick={loadEnquiries}
          className="admin-btn admin-btn--outline"
          disabled={loading}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : null}
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {STATUSES.map((st) => {
          const count = countsByStatus[st] || 0;
          const isActive = statusFilter === st;
          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid #C5A880" : "2px solid transparent",
                color: isActive ? "#DFBE99" : "#9CA3AF",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>{st}</span>
              <span
                style={{
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: isActive ? "rgba(197, 168, 128, 0.2)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "#DFBE99" : "#9CA3AF",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: "440px", marginBottom: "20px" }}>
        <Search
          size={16}
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
        />
        <input
          type="text"
          placeholder="Search by client name, phone, email, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input"
          style={{ width: "100%", paddingLeft: "36px", height: "40px" }}
        />
      </div>

      {/* Enquiries Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Details</th>
              <th>Contact Info</th>
              <th>Project & Location</th>
              <th>Budget</th>
              <th>Submission Time</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                  <p style={{ margin: 0, color: "#9CA3AF" }}>Loading customer enquiries...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                  No customer enquiries in this category.
                </td>
              </tr>
            ) : (
              filtered.map((enq) => {
                const currentStatus = enq.status || "New";
                return (
                  <tr key={enq.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#F3F4F6", fontSize: "14px" }}>{enq.name}</div>
                      {enq.message && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#9CA3AF",
                            maxWidth: "240px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={enq.message}
                        >
                          "{enq.message}"
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <a
                          href={`tel:${enq.phone.replace(/[^0-9+]/g, "")}`}
                          style={{
                            color: "#DFBE99",
                            fontSize: "13px",
                            fontWeight: 500,
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Phone size={12} /> {enq.phone}
                        </a>
                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            style={{
                              color: "#9CA3AF",
                              fontSize: "12px",
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Mail size={12} /> {enq.email}
                          </a>
                        )}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: "13px", color: "#F3F4F6", fontWeight: 500 }}>
                        {enq.projectType || "General Enquiry"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", display: "inline-flex", alignItems: "center", gap: "2px" }}>
                        <MapPin size={10} /> {enq.location || "Delhi NCR"}
                      </div>
                    </td>

                    <td style={{ fontSize: "13px", color: "#D1D5DB" }}>
                      {enq.budget || "Not Specified"}
                    </td>

                    <td style={{ fontSize: "12px", color: "#9CA3AF" }}>
                      {enq.time || new Date(enq.createdAt || Date.now()).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        disabled={saving}
                        style={{
                          background:
                            currentStatus === "Won"
                              ? "rgba(16, 185, 129, 0.2)"
                              : currentStatus === "Contacted"
                              ? "rgba(59, 130, 246, 0.2)"
                              : currentStatus === "Lost"
                              ? "rgba(239, 68, 68, 0.2)"
                              : "rgba(245, 158, 11, 0.2)",
                          color:
                            currentStatus === "Won"
                              ? "#34D399"
                              : currentStatus === "Contacted"
                              ? "#60A5FA"
                              : currentStatus === "Lost"
                              ? "#F87171"
                              : "#FBBF24",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: "14px",
                          padding: "4px 8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="New" style={{ background: "#161920", color: "#FBBF24" }}>
                          New
                        </option>
                        <option value="Contacted" style={{ background: "#161920", color: "#60A5FA" }}>
                          Contacted
                        </option>
                        <option value="Won" style={{ background: "#161920", color: "#34D399" }}>
                          Won
                        </option>
                        <option value="Lost" style={{ background: "#161920", color: "#F87171" }}>
                          Lost
                        </option>
                      </select>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="admin-btn admin-btn--outline"
                          style={{ padding: "6px 10px", fontSize: "12px" }}
                        >
                          View Message
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id)}
                          className="admin-btn admin-btn--outline"
                          style={{ padding: "6px 8px", color: "#EF4444" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: View Enquiry Details */}
      {selectedEnquiry && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "560px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                Enquiry from {selectedEnquiry.name}
              </h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "rgba(255,255,255,0.02)", padding: "14px", borderRadius: "8px" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Phone Number</div>
                  <a href={`tel:${selectedEnquiry.phone}`} style={{ color: "#DFBE99", fontSize: "14px", fontWeight: 600 }}>
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Email Address</div>
                  <div style={{ color: "#F3F4F6", fontSize: "14px" }}>{selectedEnquiry.email || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Project Type</div>
                  <div style={{ color: "#F3F4F6", fontSize: "14px" }}>{selectedEnquiry.projectType}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Estimated Budget</div>
                  <div style={{ color: "#F3F4F6", fontSize: "14px" }}>{selectedEnquiry.budget}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Location</div>
                  <div style={{ color: "#F3F4F6", fontSize: "14px" }}>{selectedEnquiry.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Submitted Date</div>
                  <div style={{ color: "#F3F4F6", fontSize: "14px" }}>{selectedEnquiry.time}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Message & Scope Description:
                </div>
                <div
                  style={{
                    padding: "14px",
                    background: "#12141A",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedEnquiry.message || "(No message provided by client)"}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${selectedEnquiry.name}, thank you for contacting Bright Space Interiors regarding your ${selectedEnquiry.projectType} project.`)}`}
                  target="_blank"
                  className="admin-btn admin-btn--gold"
                  style={{ fontSize: "13px" }}
                >
                  Chat on WhatsApp
                </a>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="admin-btn admin-btn--outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
