"use client";
import { useState } from "react";
import Link from "next/link";
import {
  useCmsServices,
  useCmsSpecialties,
  cmsUpdateService,
  cmsDeleteService,
  cmsAddService,
  cmsUpdateSpecialty,
  cmsDeleteSpecialty,
  cmsAddSpecialty,
  Service,
  SpecialtyService,
} from "@/lib/cms";
import {
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function ServicesManagerPage() {
  const coreServices = useCmsServices();
  const specialties = useCmsSpecialties();
  const [activeTab, setActiveTab] = useState<"core" | "specialty">("core");

  // Notifications
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCore, setEditingCore] = useState<Service | null>(null);
  const [editingSpecialty, setEditingSpecialty] = useState<SpecialtyService | null>(null);

  // New service state
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("/images/real-bedroom-fluted.jpg");
  const [newSubServices, setNewSubServices] = useState("");

  // Edit core service form
  const [editCoreTitle, setEditCoreTitle] = useState("");
  const [editCoreSubtitle, setEditCoreSubtitle] = useState("");
  const [editCoreImage, setEditCoreImage] = useState("");
  const [editCoreDesc, setEditCoreDesc] = useState("");
  const [editCoreSubServices, setEditCoreSubServices] = useState("");

  // Edit specialty service form
  const [editSpecName, setEditSpecName] = useState("");
  const [editSpecTagline, setEditSpecTagline] = useState("");
  const [editSpecImage, setEditSpecImage] = useState("");
  const [editSpecDesc, setEditSpecDesc] = useState("");

  const notify = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const handleOpenEditCore = (svc: Service) => {
    setEditingCore(svc);
    setEditCoreTitle(svc.title || "");
    setEditCoreSubtitle(svc.subtitle || "");
    setEditCoreImage(svc.image || "");
    setEditCoreDesc(svc.description || "");
    setEditCoreSubServices((svc.subServices || []).join(", "));
  };

  const handleSaveEditCore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCore) return;

    const subServicesArray = editCoreSubServices
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updated: Service = {
      ...editingCore,
      title: editCoreTitle.trim() || editingCore.title,
      subtitle: editCoreSubtitle.trim() || editingCore.subtitle,
      image: editCoreImage.trim() || editingCore.image,
      description: editCoreDesc.trim() || editingCore.description,
      subServices: subServicesArray.length > 0 ? subServicesArray : editingCore.subServices,
    };

    setSaving(true);
    const ok = await cmsUpdateService(updated);
    setSaving(false);
    if (ok) {
      setEditingCore(null);
      notify(`Saved changes to "${updated.title}" and updated website live!`);
    } else {
      notifyError(`Failed to save "${updated.title}" on live website.`);
    }
  };

  const handleOpenEditSpecialty = (spec: SpecialtyService) => {
    setEditingSpecialty(spec);
    setEditSpecName(spec.name || "");
    setEditSpecTagline(spec.tagline || "");
    setEditSpecImage(spec.image || "");
    setEditSpecDesc(spec.description || "");
  };

  const handleSaveEditSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecialty) return;

    const updated: SpecialtyService = {
      ...editingSpecialty,
      name: editSpecName.trim() || editingSpecialty.name,
      tagline: editSpecTagline.trim() || editingSpecialty.tagline,
      image: editSpecImage.trim() || editingSpecialty.image,
      description: editSpecDesc.trim() || editingSpecialty.description,
    };

    setSaving(true);
    const ok = await cmsUpdateSpecialty(editingSpecialty.name, updated);
    setSaving(false);
    if (ok) {
      setEditingSpecialty(null);
      notify(`Saved changes to "${updated.name}" trade and updated website live!`);
    } else {
      notifyError(`Failed to save "${updated.name}" on live website.`);
    }
  };

  const handleDeleteCore = async (slug: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}"? This will immediately update the live website.`)) {
      const ok = await cmsDeleteService(slug);
      if (ok) notify(`Removed "${title}" from services.`);
      else notifyError(`Failed to remove "${title}" from live website.`);
    }
  };

  const handleDeleteSpecialty = async (name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" specialty trade? This will immediately update the live website.`)) {
      const ok = await cmsDeleteSpecialty(name);
      if (ok) notify(`Removed "${name}" from specialty trades.`);
      else notifyError(`Failed to remove "${name}" from live website.`);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    let ok = false;

    if (activeTab === "core") {
      const created: Service = {
        slug: newTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `service-${Date.now()}`,
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || "Tailored Luxury Spaces",
        image: newImage.trim() || "/images/real-bedroom-fluted.jpg",
        description: newDesc.trim() || "Bespoke interior design and turnkey execution services.",
        subServices: newSubServices.split(",").map((s) => s.trim()).filter(Boolean),
        bgColor: "#24201A",
        faqs: [
          { q: "What is the typical execution timeline?", a: "Timelines range from 4 to 12 weeks depending on scope." },
        ],
      };
      ok = await cmsAddService(created);
      if (ok) notify(`Added new service "${created.title}" to live website!`);
    } else {
      const createdSpecialty: SpecialtyService = {
        name: newTitle.trim(),
        tagline: newSubtitle.trim() || "Precision Craftsmanship",
        image: newImage.trim() || "/images/real-kitchen-saket.jpg",
        description: newDesc.trim() || "High-end bespoke material execution.",
      };
      ok = await cmsAddSpecialty(createdSpecialty);
      if (ok) notify(`Added new specialty trade "${createdSpecialty.name}" to live website!`);
    }

    setSaving(false);
    if (ok) {
      setShowAddModal(false);
      setNewTitle("");
      setNewSubtitle("");
      setNewDesc("");
      setNewSubServices("");
    } else {
      notifyError("Failed to add service to live website. Please check connection.");
    }
  };

  return (
    <>
      {/* Toast Feedback */}
      {successMsg && (
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
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Check size={16} />
          {successMsg}
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
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Services Manager
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Configure main design divisions and turnkey specialty trades. Any edits or deletions update live across the website.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/services" target="_blank" className="admin-btn admin-btn--outline" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ExternalLink size={14} /> View Live Services
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn--primary"
            id="services-add-btn"
          >
            <Plus size={14} /> Add {activeTab === "core" ? "Core Service" : "Specialty Service"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-table-wrap" style={{ padding: "8px", marginBottom: "24px", display: "inline-flex", gap: "8px" }}>
        <button
          onClick={() => setActiveTab("core")}
          style={{
            padding: "8px 20px",
            borderRadius: "6px",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            background: activeTab === "core" ? "var(--charcoal)" : "transparent",
            color: activeTab === "core" ? "#FFF" : "var(--text-secondary)",
            transition: "all 0.2s ease",
          }}
        >
          Primary Services ({coreServices.length})
        </button>
        <button
          onClick={() => setActiveTab("specialty")}
          style={{
            padding: "8px 20px",
            borderRadius: "6px",
            border: "none",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            background: activeTab === "specialty" ? "var(--charcoal)" : "transparent",
            color: activeTab === "specialty" ? "#FFF" : "var(--text-secondary)",
            transition: "all 0.2s ease",
          }}
        >
          Turnkey Specialty Trades ({specialties.length})
        </button>
      </div>

      {/* Core Services Section */}
      {activeTab === "core" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "24px" }}>
          {coreServices.map((service) => (
            <div key={service.slug} className="admin-table-wrap" style={{ margin: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", width: "100%", height: "180px", background: "#222" }}>
                <img
                  src={service.image}
                  alt={service.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "22px", color: "#FFF", fontWeight: 600 }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--gold)", fontWeight: 500 }}>
                    {service.subtitle}
                  </p>
                </div>
              </div>

              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px" }}>
                  {service.description}
                </p>

                <div style={{ marginBottom: "16px", flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Included Specializations
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {service.subServices.map((sub) => (
                      <span key={sub} style={{ background: "#F5F5F5", padding: "4px 8px", borderRadius: "4px", fontSize: "11px", color: "var(--text-secondary)" }}>
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #F0F0F0" }}>
                  <Link href={`/services`} target="_blank" className="admin-btn admin-btn--outline" style={{ fontSize: "11px", padding: "6px 12px" }}>
                    <ExternalLink size={12} /> View Page
                  </Link>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleOpenEditCore(service)}
                      className="admin-btn admin-btn--outline"
                      style={{ padding: "6px 12px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCore(service.slug, service.title)}
                      className="admin-btn"
                      style={{ background: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 10px", fontSize: "12px", borderRadius: "6px", cursor: "pointer" }}
                      title="Delete Service"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specialty Trades Section */}
      {activeTab === "specialty" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {specialties.map((spec) => (
            <div key={spec.name} className="admin-table-wrap" style={{ margin: 0, padding: "20px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
                <img
                  src={spec.image}
                  alt={spec.name}
                  style={{ width: "56px", height: "56px", borderRadius: "8px", objectFit: "cover", border: "1px solid #E0E0E0" }}
                />
                <div>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>
                    {spec.name}
                  </h4>
                  <div style={{ fontSize: "12px", color: "var(--gold)", fontWeight: 600, marginTop: "2px" }}>
                    {spec.tagline}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px", flex: 1 }}>
                {spec.description}
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid #F0F0F0", paddingTop: "12px" }}>
                <button
                  onClick={() => handleOpenEditSpecialty(spec)}
                  className="admin-btn admin-btn--outline"
                  style={{ padding: "5px 10px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <Edit2 size={11} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteSpecialty(spec.name)}
                  className="admin-btn"
                  style={{ background: "#FEE2E2", color: "#DC2626", border: "none", padding: "5px 8px", fontSize: "11px", borderRadius: "6px", cursor: "pointer" }}
                  title="Delete Trade"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EDIT CORE SERVICE MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {editingCore && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setEditingCore(null)}
        >
          <div
            className="admin-table-wrap"
            style={{ width: "100%", maxWidth: "560px", padding: "32px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", fontWeight: 600, color: "var(--charcoal)" }}>
                  Edit Primary Service
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  All fields are prefilled. Untouched fields remain intact. Updates sync live on the website.
                </p>
              </div>
              <button onClick={() => setEditingCore(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCore} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editCoreTitle}
                  onChange={(e) => setEditCoreTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={editCoreSubtitle}
                  onChange={(e) => setEditCoreSubtitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <ImageUploadField
                label="Cover Image *"
                value={editCoreImage}
                onChange={setEditCoreImage}
                folder="Services"
                required
              />

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editCoreDesc}
                  onChange={(e) => setEditCoreDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Specialization Sub-Services (comma separated)
                </label>
                <input
                  type="text"
                  value={editCoreSubServices}
                  onChange={(e) => setEditCoreSubServices(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px", borderTop: "1px solid #F0F0F0", paddingTop: "16px" }}>
                <button type="button" onClick={() => setEditingCore(null)} className="admin-btn admin-btn--outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {saving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                  {saving ? "Saving Changes..." : "Save Changes & Update Website"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EDIT SPECIALTY SERVICE MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {editingSpecialty && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setEditingSpecialty(null)}
        >
          <div
            className="admin-table-wrap"
            style={{ width: "100%", maxWidth: "520px", padding: "32px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", fontWeight: 600, color: "var(--charcoal)" }}>
                  Edit Specialty Trade
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  All fields are prefilled. Untouched fields remain intact. Updates sync live on the website.
                </p>
              </div>
              <button onClick={() => setEditingSpecialty(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditSpecialty} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Trade Name *
                </label>
                <input
                  type="text"
                  required
                  value={editSpecName}
                  onChange={(e) => setEditSpecName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Tagline
                </label>
                <input
                  type="text"
                  value={editSpecTagline}
                  onChange={(e) => setEditSpecTagline(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <ImageUploadField
                label="Trade Photo *"
                value={editSpecImage}
                onChange={setEditSpecImage}
                folder="Services"
                required
              />

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editSpecDesc}
                  onChange={(e) => setEditSpecDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px", borderTop: "1px solid #F0F0F0", paddingTop: "16px" }}>
                <button type="button" onClick={() => setEditingSpecialty(null)} className="admin-btn admin-btn--outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {saving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                  {saving ? "Saving Changes..." : "Save Changes & Update Website"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ADD SERVICE MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
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
            style={{ width: "100%", maxWidth: "560px", padding: "32px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", fontWeight: 600, color: "var(--charcoal)" }}>
                Add {activeTab === "core" ? "Primary Service" : "Specialty Trade"}
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateService} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  {activeTab === "core" ? "Service Title" : "Specialty Name"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === "core" ? "e.g. Hospitality & Luxury Resorts" : "e.g. Italian Marble Polishing"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Crafted to Perfection"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <ImageUploadField
                label="Cover Image / Photo *"
                value={newImage}
                onChange={setNewImage}
                folder="Services"
                required
              />

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Service overview and client deliverables..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", resize: "vertical" }}
                />
              </div>

              {activeTab === "core" && (
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Included Specializations (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lounges, Master Suites, Custom Kitchens"
                    value={newSubServices}
                    onChange={(e) => setNewSubServices(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn admin-btn--outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {saving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                  {saving ? "Publishing..." : "Publish to Website"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
