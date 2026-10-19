"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layers,
  FileText,
  Sparkles,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { NavServiceItem, ServiceDetailItem } from "@/lib/site-types";

export default function ServicesManagerPage() {
  const [activeTab, setActiveTab] = useState<"homepage" | "detailed" | "specialty">("homepage");
  const [navServices, setNavServices] = useState<NavServiceItem[]>([]);
  const [detailedServices, setDetailedServices] = useState<ServiceDetailItem[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Homepage Service Modals & Form
  const [showAddNavModal, setShowAddNavModal] = useState(false);
  const [editingNavService, setEditingNavService] = useState<NavServiceItem | null>(null);
  const [navTitle, setNavTitle] = useState("");
  const [navSlug, setNavSlug] = useState("");
  const [navDesc, setNavDesc] = useState("");
  const [navImage, setNavImage] = useState("/images/hero-luxury.jpg");
  const [navLink, setNavLink] = useState("/services/residential");
  const [navPublished, setNavPublished] = useState(true);

  // Detailed Service Modal & Form
  const [editingDetailed, setEditingDetailed] = useState<ServiceDetailItem | null>(null);
  const [detTitle, setDetTitle] = useState("");
  const [detSubtitle, setDetSubtitle] = useState("");
  const [detImage, setDetImage] = useState("");
  const [detDesc, setDetDesc] = useState("");
  const [detSubServices, setDetSubServices] = useState("");

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setNavServices(data.navServices || []);
        setDetailedServices(data.detailedServices || []);
        setSpecialties(data.specialties || []);
      }
    } catch {
      notifyError("Failed to load services data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // --- Homepage 6 Services Handlers ---
  const openAddNav = () => {
    setNavTitle("");
    setNavSlug("");
    setNavDesc("");
    setNavImage("/images/hero-luxury.jpg");
    setNavLink("/services/residential");
    setNavPublished(true);
    setEditingNavService(null);
    setShowAddNavModal(true);
  };

  const openEditNav = (s: NavServiceItem) => {
    setEditingNavService(s);
    setNavTitle(s.title);
    setNavSlug(s.slug);
    setNavDesc(s.description || "");
    setNavImage(s.image || "/images/hero-luxury.jpg");
    setNavLink(s.link || "/services");
    setNavPublished(s.published !== false);
    setShowAddNavModal(true);
  };

  const handleSaveNavService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navTitle.trim()) {
      notifyError("Service title is required.");
      return;
    }

    const cleanSlug =
      navSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
      navTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const payload: NavServiceItem = {
      id: editingNavService ? editingNavService.id : `srv-${Date.now()}`,
      slug: cleanSlug,
      title: navTitle.trim(),
      description: navDesc.trim(),
      image: navImage.trim(),
      href: navLink.trim() || `/services/${cleanSlug}`,
      link: navLink.trim() || `/services/${cleanSlug}`,
      caption: "",
      whatsappMsg: `Hello Bright Space Interiors, I am interested in ${navTitle.trim()}.`,
      order: editingNavService ? editingNavService.order : navServices.length + 1,
      published: navPublished,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "navService",
          data: payload,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNavServices(data.navServices);
        setShowAddNavModal(false);
        setEditingNavService(null);
        notify(
          editingNavService
            ? `Homepage service "${payload.title}" updated and synced!`
            : `Homepage service "${payload.title}" created and published!`
        );
      } else {
        notifyError(data.error || "Failed to save service to Firestore.");
      }
    } catch {
      notifyError("Network error while saving service.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNavPublished = async (s: NavServiceItem) => {
    const updated = { ...s, published: s.published === false ? true : false };
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "navService", data: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setNavServices(data.navServices);
        notify(`Service status changed to ${updated.published ? "Published" : "Draft"}.`);
      } else {
        notifyError("Failed to update status.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNav = async (s: NavServiceItem) => {
    if (!confirm(`Are you sure you want to delete service "${s.title}"?`)) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services?slug=${s.slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNavServices(data.navServices);
        notify(`Deleted service "${s.title}".`);
      } else {
        notifyError(data.error || "Failed to delete.");
      }
    } catch {
      notifyError("Network error deleting service.");
    } finally {
      setSaving(false);
    }
  };

  const handleReorderNav = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= navServices.length) return;

    const list = [...navServices];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setNavServices(reordered);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "navServices", items: reordered }),
      });
      const data = await res.json();
      if (data.success) {
        notify("Homepage services reordered and saved to Firestore.");
      } else {
        notifyError("Failed to save reorder.");
        loadServices();
      }
    } catch {
      notifyError("Network error reordering.");
      loadServices();
    } finally {
      setSaving(false);
    }
  };

  // --- Detailed Service Handlers ---
  const openEditDetailed = (s: ServiceDetailItem) => {
    setEditingDetailed(s);
    setDetTitle(s.title);
    setDetSubtitle(s.subtitle || "");
    setDetImage(s.image || "");
    setDetDesc(s.description || "");
    setDetSubServices((s.subServices || []).join("\n"));
  };

  const handleSaveDetailed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDetailed) return;

    const subServicesArray = detSubServices
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: ServiceDetailItem = {
      ...editingDetailed,
      title: detTitle.trim() || editingDetailed.title,
      subtitle: detSubtitle.trim() || editingDetailed.subtitle,
      image: detImage.trim() || editingDetailed.image,
      description: detDesc.trim() || editingDetailed.description,
      subServices: subServicesArray.length > 0 ? subServicesArray : editingDetailed.subServices,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "detailedService", data: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setDetailedServices(data.detailedServices);
        setEditingDetailed(null);
        notify(`Detailed service page for "${updated.title}" updated!`);
      } else {
        notifyError(data.error || "Failed to update detailed service.");
      }
    } catch {
      notifyError("Network error.");
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
            Services Management
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Control the homepage 6-service split accordion layout and dedicated service detail pages (/services/[slug]).
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {activeTab === "homepage" && (
            <button
              onClick={openAddNav}
              className="admin-btn admin-btn--gold"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} /> Add Homepage Service
            </button>
          )}
          <Link
            href="/services"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View /services
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => setActiveTab("homepage")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "homepage" ? "2px solid #C5A880" : "2px solid transparent",
            color: activeTab === "homepage" ? "#DFBE99" : "#9CA3AF",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Layers size={16} />
          <span>Homepage Split Accordion ({navServices.length} Services)</span>
        </button>

        <button
          onClick={() => setActiveTab("detailed")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "detailed" ? "2px solid #C5A880" : "2px solid transparent",
            color: activeTab === "detailed" ? "#DFBE99" : "#9CA3AF",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FileText size={16} />
          <span>Detailed Service Pages ({detailedServices.length} Routes)</span>
        </button>

        <button
          onClick={() => setActiveTab("specialty")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "specialty" ? "2px solid #C5A880" : "2px solid transparent",
            color: activeTab === "specialty" ? "#DFBE99" : "#9CA3AF",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Sparkles size={16} />
          <span>Specialties Grid ({specialties.length})</span>
        </button>
      </div>

      {/* Tab 1: Homepage 6 Services */}
      {activeTab === "homepage" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th style={{ width: "70px" }}>Image</th>
                <th>Service Title</th>
                <th>Description</th>
                <th>Target Link</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                    <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                    <p style={{ margin: 0, color: "#9CA3AF" }}>Loading services...</p>
                  </td>
                </tr>
              ) : navServices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                    No services found. Click "Add Homepage Service" to create one.
                  </td>
                </tr>
              ) : (
                navServices.map((s, idx) => (
                  <tr key={s.id || s.slug}>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <button
                          onClick={() => handleReorderNav(idx, "up")}
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
                          onClick={() => handleReorderNav(idx, "down")}
                          disabled={idx === navServices.length - 1 || saving}
                          style={{
                            background: "none",
                            border: "none",
                            color: idx === navServices.length - 1 ? "#4B5563" : "#C5A880",
                            cursor: idx === navServices.length - 1 ? "not-allowed" : "pointer",
                            padding: "2px",
                          }}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <img
                        src={s.image || "/images/hero-luxury.jpg"}
                        alt={s.title}
                        style={{
                          width: "56px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "#F3F4F6", fontSize: "14px" }}>{s.title}</div>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "monospace" }}>slug: {s.slug}</div>
                    </td>
                    <td style={{ fontSize: "12px", color: "#D1D5DB", maxWidth: "280px" }}>
                      {s.description || "—"}
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", color: "#60A5FA", fontFamily: "monospace" }}>
                        {s.link}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleNavPublished(s)}
                        disabled={saving}
                        style={{
                          background: s.published !== false ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          border: `1px solid ${s.published !== false ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                          color: s.published !== false ? "#10B981" : "#F59E0B",
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
                        {s.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{s.published !== false ? "Published" : "Draft"}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          onClick={() => openEditNav(s)}
                          className="admin-btn admin-btn--outline"
                          style={{ padding: "6px 8px" }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteNav(s)}
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
      )}

      {/* Tab 2: Detailed Services */}
      {activeTab === "detailed" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {detailedServices.map((det) => (
            <div
              key={det.slug}
              style={{
                background: "#161920",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ height: "160px", position: "relative" }}>
                  <img
                    src={det.image}
                    alt={det.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "12px",
                      background: "rgba(0,0,0,0.75)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontFamily: "monospace",
                      color: "#DFBE99",
                    }}
                  >
                    /services/{det.slug}
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#F3F4F6", margin: "0 0 6px 0" }}>
                    {det.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "#C5A880", margin: "0 0 12px 0", fontWeight: 500 }}>
                    {det.subtitle}
                  </p>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                    {det.description}
                  </p>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#6B7280", marginBottom: "6px", fontWeight: 600 }}>
                      Sub-Services Included ({det.subServices?.length || 0})
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(det.subServices || []).slice(0, 4).map((sub, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.04)",
                            color: "#D1D5DB",
                          }}
                        >
                          {sub}
                        </span>
                      ))}
                      {(det.subServices?.length || 0) > 4 && (
                        <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                          +{(det.subServices?.length || 0) - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "16px 20px",
                  background: "rgba(0,0,0,0.2)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Link
                  href={`/services/${det.slug}`}
                  target="_blank"
                  style={{
                    fontSize: "12px",
                    color: "#60A5FA",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ExternalLink size={13} /> View Live Page
                </Link>
                <button
                  onClick={() => openEditDetailed(det)}
                  className="admin-btn admin-btn--gold"
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  <Edit2 size={13} style={{ marginRight: "4px" }} /> Edit Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Specialties */}
      {activeTab === "specialty" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {specialties.map((spec, i) => (
            <div
              key={spec.id || i}
              style={{
                background: "#161920",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#F3F4F6", marginBottom: "4px" }}>
                {spec.name}
              </div>
              <div style={{ fontSize: "12px", color: "#C5A880", marginBottom: "8px" }}>
                {spec.tagline || spec.subtitle}
              </div>
              <p style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.4, margin: 0 }}>
                {spec.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add / Edit Homepage Service */}
      {showAddNavModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                {editingNavService ? `Edit Service: ${editingNavService.title}` : "Add Homepage Service"}
              </h2>
              <button
                onClick={() => setShowAddNavModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNavService} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={navTitle}
                    onChange={(e) => setNavTitle(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. Architecture & Planning"
                  />
                </div>
                <div>
                  <label className="admin-label">Slug</label>
                  <input
                    type="text"
                    value={navSlug}
                    onChange={(e) => setNavSlug(e.target.value)}
                    className="admin-input"
                    placeholder="architecture-planning"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Short Description (Displayed in Split Layout)</label>
                <textarea
                  rows={3}
                  value={navDesc}
                  onChange={(e) => setNavDesc(e.target.value)}
                  className="admin-input"
                  placeholder="Comprehensive structural planning, 3D elevation design, and municipal approvals..."
                />
              </div>

              <div>
                <label className="admin-label">Photo (Firebase Storage / WebP)</label>
                <ImageUploadField
                  value={navImage}
                  onChange={setNavImage}
                  label="Upload or Select Service Photo"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Target Link</label>
                  <input
                    type="text"
                    value={navLink}
                    onChange={(e) => setNavLink(e.target.value)}
                    className="admin-input"
                    placeholder="/services/residential"
                  />
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select
                    value={navPublished ? "true" : "false"}
                    onChange={(e) => setNavPublished(e.target.value === "true")}
                    className="admin-select"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddNavModal(false)}
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
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Detailed Service */}
      {editingDetailed && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                Edit /services/{editingDetailed.slug}
              </h2>
              <button
                onClick={() => setEditingDetailed(null)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDetailed} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Page Title</label>
                <input
                  type="text"
                  required
                  value={detTitle}
                  onChange={(e) => setDetTitle(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Subtitle / Hook</label>
                <input
                  type="text"
                  value={detSubtitle}
                  onChange={(e) => setDetSubtitle(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Hero Banner Image</label>
                <ImageUploadField
                  value={detImage}
                  onChange={setDetImage}
                  label="Upload or Select Service Hero Image"
                />
              </div>

              <div>
                <label className="admin-label">Detailed Description</label>
                <textarea
                  rows={4}
                  value={detDesc}
                  onChange={(e) => setDetDesc(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Sub-Services Included (One per line)</label>
                <textarea
                  rows={4}
                  value={detSubServices}
                  onChange={(e) => setDetSubServices(e.target.value)}
                  className="admin-input"
                  placeholder="Living Room Design&#10;Master Suite Architecture&#10;Modular Kitchens"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingDetailed(null)}
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
                  <span>Save Page Content</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
