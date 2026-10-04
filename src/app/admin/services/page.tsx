"use client";
import { useState } from "react";
import Link from "next/link";
import { SERVICES, SPECIALTY_SERVICES } from "@/lib/data";
import {
  Layers,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  HelpCircle,
  X,
  Sparkles,
} from "lucide-react";

export default function ServicesManagerPage() {
  const [coreServices, setCoreServices] = useState(SERVICES);
  const [specialties, setSpecialties] = useState(SPECIALTY_SERVICES);
  const [activeTab, setActiveTab] = useState<"core" | "specialty">("core");
  const [showAddModal, setShowAddModal] = useState(false);

  // New service state
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("/images/service-residential.jpg");
  const [newSubServices, setNewSubServices] = useState("");

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeTab === "core") {
      const created = {
        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || "Tailored Luxury Spaces",
        image: newImage,
        description: newDesc.trim() || "Bespoke interior design and turnkey execution services.",
        subServices: newSubServices.split(",").map((s) => s.trim()).filter(Boolean),
        bgColor: "#24201A",
        faqs: [
          { q: "What is the typical execution timeline?", a: "Timelines range from 4 to 12 weeks depending on scope." },
        ],
      };
      setCoreServices([...coreServices, created]);
    } else {
      const createdSpecialty = {
        name: newTitle.trim(),
        tagline: newSubtitle.trim() || "Precision Craftsmanship",
        image: newImage,
        description: newDesc.trim() || "High-end bespoke material execution.",
      };
      setSpecialties([...specialties, createdSpecialty]);
    }

    setShowAddModal(false);
    setNewTitle("");
    setNewSubtitle("");
    setNewDesc("");
    setNewSubServices("");
  };

  const handleDeleteCore = (slug: string) => {
    if (confirm("Are you sure you want to remove this core service?")) {
      setCoreServices(coreServices.filter((s) => s.slug !== slug));
    }
  };

  const handleDeleteSpecialty = (name: string) => {
    if (confirm("Are you sure you want to remove this specialty trade?")) {
      setSpecialties(specialties.filter((s) => s.name !== name));
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Services Manager
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Configure main design divisions and turnkey specialty trades
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
                <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-light)", fontWeight: 600 }}>
                    {service.subtitle}
                  </div>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "22px", color: "#FFF", fontWeight: 400, marginTop: "2px" }}>
                    {service.title}
                  </h3>
                </div>
              </div>

              <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px", flex: 1 }}>
                  {service.description}
                </p>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                    Included Specialties ({service.subServices.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {service.subServices.map((sub) => (
                      <span key={sub} style={{ fontSize: "11px", background: "#F4F5F7", padding: "3px 10px", borderRadius: "10px", color: "var(--charcoal)", fontWeight: 500 }}>
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #F0F0F0" }}>
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    className="admin-btn admin-btn--outline"
                    style={{ fontSize: "11px", padding: "6px 12px" }}
                  >
                    <ExternalLink size={12} /> View Page
                  </Link>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <HelpCircle size={13} /> {service.faqs.length} FAQs
                    </span>
                    <button
                      onClick={() => handleDeleteCore(service.slug)}
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

      {/* Specialty Services Section */}
      {activeTab === "specialty" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {specialties.map((specialty) => (
            <div key={specialty.name} className="admin-table-wrap" style={{ margin: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", width: "100%", height: "150px", background: "#222" }}>
                <img
                  src={specialty.image}
                  alt={specialty.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", bottom: "12px", left: "16px", padding: "3px 10px", background: "rgba(0,0,0,0.7)", borderRadius: "8px", color: "var(--gold-light)", fontSize: "10px", fontWeight: 600 }}>
                  {specialty.tagline}
                </div>
              </div>
              <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "19px", color: "var(--charcoal)", marginBottom: "8px" }}>
                  {specialty.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px", flex: 1 }}>
                  {specialty.description}
                </p>
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "12px", borderTop: "1px solid #F0F0F0" }}>
                  <button
                    onClick={() => handleDeleteSpecialty(specialty.name)}
                    className="admin-btn"
                    style={{ background: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 10px", fontSize: "12px", borderRadius: "6px", cursor: "pointer" }}
                    title="Delete Specialty Trade"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
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
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px" }}>
                Add {activeTab === "core" ? "Core Service" : "Specialty Trade"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateService}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === "core" ? "e.g. Architectural Styling" : "e.g. Smart Home Automation"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Bespoke Finishes"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Photo Image</label>
                <select
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                >
                  <option value="/images/service-residential.jpg">Residential Living Room</option>
                  <option value="/images/service-commercial.jpg">Corporate Office</option>
                  <option value="/images/service-turnkey.jpg">Turnkey Architecture</option>
                  <option value="/images/service-design.jpg">Architectural Drawing</option>
                  <option value="/images/modular-kitchen.jpg">Modular Kitchen</option>
                  <option value="/images/modular-wardrobe.jpg">Modular Wardrobe</option>
                  <option value="/images/specialty-lighting.jpg">Lighting Design</option>
                  <option value="/images/specialty-flooring.jpg">Flooring & Marble</option>
                </select>
              </div>

              {activeTab === "core" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Sub-Services (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Modular Cabinets, Cove Lighting, Stone Countertops"
                    value={newSubServices}
                    onChange={(e) => setNewSubServices(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
              )}

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail the scope and architectural deliverable..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
