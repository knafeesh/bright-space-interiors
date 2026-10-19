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
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Layers,
  FileText,
  Sparkles,
  Compass,
  ShieldCheck,
  Clock,
  Hammer,
  Palette,
  Award,
  Gem,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { NavServiceItem, ServiceDetailItem, SpecialtyServiceItem } from "@/lib/site-types";

export default function ServicesManagerPage() {
  const [activeTab, setActiveTab] = useState<"homepage" | "detailed" | "specialty">("homepage");
  const [navServices, setNavServices] = useState<NavServiceItem[]>([]);
  const [detailedServices, setDetailedServices] = useState<ServiceDetailItem[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyServiceItem[]>([]);
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

  // Specialty Service Modal & Form
  const [showAddSpecialtyModal, setShowAddSpecialtyModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<SpecialtyServiceItem | null>(null);
  const [specName, setSpecName] = useState("");
  const [specTagline, setSpecTagline] = useState("");
  const [specDesc, setSpecDesc] = useState("");
  const [specIcon, setSpecIcon] = useState("Sparkles");

  // Confirmation Modals
  const [serviceToDelete, setServiceToDelete] = useState<NavServiceItem | null>(null);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<SpecialtyServiceItem | null>(null);

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

  // --- Homepage Services Handlers ---
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
            ? `Homepage service "${payload.title}" updated and synced to Firestore!`
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

  const confirmDeleteNav = async () => {
    if (!serviceToDelete) return;
    const s = serviceToDelete;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services?slug=${s.slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setNavServices(data.navServices);
        setServiceToDelete(null);
        notify(`Deleted service "${s.title}" from Firestore.`);
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
        notify(`Detailed service page for "${updated.title}" updated in Firestore!`);
      } else {
        notifyError(data.error || "Failed to update detailed service.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  // --- Specialty Services Handlers ---
  const openAddSpecialty = () => {
    setSpecName("");
    setSpecTagline("");
    setSpecDesc("");
    setSpecIcon("Sparkles");
    setEditingSpecialty(null);
    setShowAddSpecialtyModal(true);
  };

  const openEditSpecialty = (spec: SpecialtyServiceItem) => {
    setEditingSpecialty(spec);
    setSpecName(spec.name);
    setSpecTagline(spec.tagline || "");
    setSpecDesc(spec.description || "");
    setSpecIcon(spec.icon || "Sparkles");
    setShowAddSpecialtyModal(true);
  };

  const handleSaveSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specName.trim()) {
      notifyError("Specialty service name is required.");
      return;
    }

    const payload: SpecialtyServiceItem = {
      id: editingSpecialty ? editingSpecialty.id : `spec-${Date.now()}`,
      name: specName.trim(),
      tagline: specTagline.trim(),
      description: specDesc.trim(),
      icon: specIcon.trim() || "Sparkles",
      image: editingSpecialty?.image || "",
      order: editingSpecialty?.order !== undefined ? editingSpecialty.order : specialties.length + 1,
      published: true,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "specialty", data: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setSpecialties(data.specialties);
        setShowAddSpecialtyModal(false);
        setEditingSpecialty(null);
        notify(`Specialty "${payload.name}" saved to Firestore.`);
      } else {
        notifyError(data.error || "Failed to save specialty.");
      }
    } catch {
      notifyError("Network error saving specialty.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteSpecialty = async () => {
    if (!specialtyToDelete) return;
    const spec = specialtyToDelete;
    setSaving(true);
    try {
      const idOrName = spec.id || encodeURIComponent(spec.name);
      const res = await fetch(`/api/admin/services?specialtyId=${idOrName}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSpecialties(data.specialties);
        setSpecialtyToDelete(null);
        notify(`Deleted specialty "${spec.name}".`);
      } else {
        notifyError(data.error || "Failed to delete specialty.");
      }
    } catch {
      notifyError("Network error deleting specialty.");
    } finally {
      setSaving(false);
    }
  };

  const handleReorderSpecialty = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= specialties.length) return;

    const list = [...specialties];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setSpecialties(reordered);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "specialties", items: reordered }),
      });
      const data = await res.json();
      if (data.success) {
        notify("Specialties reordered and saved to Firestore.");
      } else {
        notifyError("Failed to save reorder.");
        loadServices();
      }
    } catch {
      notifyError("Network error.");
      loadServices();
    } finally {
      setSaving(false);
    }
  };

  // Helper to render icon for specialty
  const renderSpecialtyIcon = (iconName?: string) => {
    const props = { size: 20, color: "#DFBE99" };
    switch (iconName?.toLowerCase()) {
      case "compass":
        return <Compass {...props} />;
      case "shieldcheck":
      case "shield":
        return <ShieldCheck {...props} />;
      case "clock":
        return <Clock {...props} />;
      case "hammer":
        return <Hammer {...props} />;
      case "palette":
        return <Palette {...props} />;
      case "award":
        return <Award {...props} />;
      case "gem":
        return <Gem {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div style={{ color: "#F3F4F6", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* Toast Notifications */}
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
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
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
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
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
              margin: "0 0 6px 0",
            }}
          >
            Services Management
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Control homepage 6-service split accordion layout, dedicated /services/[slug] pages, and specialized solutions. All changes persist directly to Firestore.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {activeTab === "homepage" && (
            <button
              onClick={openAddNav}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#C5A880",
                color: "#0E1015",
                fontWeight: 600,
                fontSize: "13px",
                padding: "10px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#DFBE99")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#C5A880")}
            >
              <Plus size={16} /> Add Homepage Service
            </button>
          )}

          {activeTab === "specialty" && (
            <button
              onClick={openAddSpecialty}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#C5A880",
                color: "#0E1015",
                fontWeight: 600,
                fontSize: "13px",
                padding: "10px 18px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#DFBE99")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#C5A880")}
            >
              <Plus size={16} /> Add Specialty Service
            </button>
          )}

          <Link
            href="/services"
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              color: "#D1D5DB",
              fontWeight: 500,
              fontSize: "13px",
              padding: "10px 16px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              textDecoration: "none",
              cursor: "pointer",
            }}
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

      {/* ============================================================== */}
      {/* TAB 1: Homepage 6 Services                                     */}
      {/* ============================================================== */}
      {activeTab === "homepage" && (
        <div
          style={{
            background: "#151720",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "#1B1E28", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  <th style={{ width: "60px", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Order</th>
                  <th style={{ width: "80px", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Image</th>
                  <th style={{ padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Service Title</th>
                  <th style={{ padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Description</th>
                  <th style={{ padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Target Link</th>
                  <th style={{ padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</th>
                  <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "50px 20px" }}>
                      <Loader2 size={26} style={{ animation: "spin 1s linear infinite", margin: "0 auto 10px", color: "#C5A880" }} />
                      <p style={{ margin: 0, color: "#9CA3AF", fontSize: "13px" }}>Loading services from Firestore...</p>
                    </td>
                  </tr>
                ) : navServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "50px 20px", color: "#9CA3AF", fontSize: "14px" }}>
                      No services found. Click "Add Homepage Service" to create one.
                    </td>
                  </tr>
                ) : (
                  navServices.map((s, idx) => (
                    <tr
                      key={s.id || s.slug}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Order Buttons */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <button
                            onClick={() => handleReorderNav(idx, "up")}
                            disabled={idx === 0 || saving}
                            style={{
                              background: "none",
                              border: "none",
                              color: idx === 0 ? "#374151" : "#C5A880",
                              cursor: idx === 0 ? "not-allowed" : "pointer",
                              padding: "2px",
                              lineHeight: 1,
                            }}
                            title="Move Up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleReorderNav(idx, "down")}
                            disabled={idx === navServices.length - 1 || saving}
                            style={{
                              background: "none",
                              border: "none",
                              color: idx === navServices.length - 1 ? "#374151" : "#C5A880",
                              cursor: idx === navServices.length - 1 ? "not-allowed" : "pointer",
                              padding: "2px",
                              lineHeight: 1,
                            }}
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Thumbnail */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <img
                          src={s.image || "/images/hero-luxury.jpg"}
                          alt={s.title}
                          style={{
                            width: "60px",
                            height: "42px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            display: "block",
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/hero-luxury.jpg";
                          }}
                        />
                      </td>

                      {/* Title & Slug */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <div style={{ fontWeight: 600, color: "#F3F4F6", fontSize: "14px" }}>{s.title}</div>
                        <div style={{ fontSize: "11px", color: "#6B7280", fontFamily: "monospace" }}>
                          slug: {s.slug}
                        </div>
                      </td>

                      {/* Description */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", fontSize: "12px", color: "#D1D5DB", maxWidth: "280px" }}>
                        {s.description || "—"}
                      </td>

                      {/* Link */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <span style={{ fontSize: "12px", color: "#60A5FA", fontFamily: "monospace" }}>
                          {s.link}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
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

                      {/* Actions */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          <button
                            onClick={() => openEditNav(s)}
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              color: "#D1D5DB",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                            title="Edit Service"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setServiceToDelete(s)}
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "#EF4444",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                            title="Delete Service"
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
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: Detailed Service Pages                                  */}
      {/* ============================================================== */}
      {activeTab === "detailed" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {detailedServices.map((det) => (
            <div
              key={det.slug}
              style={{
                background: "#151720",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div>
                <div style={{ height: "160px", position: "relative" }}>
                  <img
                    src={det.image}
                    alt={det.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/hero-luxury.jpg";
                    }}
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
                    <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#6B7280", marginBottom: "8px", fontWeight: 600 }}>
                      Sub-Services Included ({det.subServices?.length || 0})
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(det.subServices || []).slice(0, 5).map((sub, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.04)",
                            color: "#D1D5DB",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {sub}
                        </span>
                      ))}
                      {(det.subServices?.length || 0) > 5 && (
                        <span style={{ fontSize: "11px", color: "#9CA3AF", alignSelf: "center" }}>
                          +{(det.subServices?.length || 0) - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "16px 20px",
                  background: "#11131B",
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
                  style={{
                    background: "#C5A880",
                    color: "#0E1015",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Edit2 size={13} /> Edit Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: Specialties Grid (Specialized Interior Solutions)        */}
      {/* ============================================================== */}
      {activeTab === "specialty" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px" }}>
          {specialties.map((spec, idx) => (
            <div
              key={spec.id || idx}
              style={{
                background: "#151720",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "rgba(197, 168, 128, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {renderSpecialtyIcon(spec.icon)}
                  </div>

                  {/* Reorder Up/Down */}
                  <div style={{ display: "flex", gap: "2px" }}>
                    <button
                      type="button"
                      onClick={() => handleReorderSpecialty(idx, "up")}
                      disabled={idx === 0 || saving}
                      style={{
                        background: "none",
                        border: "none",
                        color: idx === 0 ? "#374151" : "#C5A880",
                        cursor: idx === 0 ? "not-allowed" : "pointer",
                        padding: "3px",
                      }}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorderSpecialty(idx, "down")}
                      disabled={idx === specialties.length - 1 || saving}
                      style={{
                        background: "none",
                        border: "none",
                        color: idx === specialties.length - 1 ? "#374151" : "#C5A880",
                        cursor: idx === specialties.length - 1 ? "not-allowed" : "pointer",
                        padding: "3px",
                      }}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "15px", fontWeight: 600, color: "#F3F4F6", marginBottom: "4px" }}>
                  {spec.name}
                </div>
                <div style={{ fontSize: "12px", color: "#C5A880", marginBottom: "10px", fontWeight: 500 }}>
                  {spec.tagline}
                </div>
                <p style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: 1.5, margin: 0 }}>
                  {spec.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <button
                  onClick={() => openEditSpecialty(spec)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    color: "#D1D5DB",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => setSpecialtyToDelete(spec)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#EF4444",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT HOMEPAGE SERVICE                             */}
      {/* ============================================================== */}
      {showAddNavModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(6px)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#151720",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "620px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px" }}>
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={navTitle}
                    onChange={(e) => setNavTitle(e.target.value)}
                    placeholder="e.g. Architecture & Planning"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#0E1015",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#F3F4F6",
                      fontSize: "13px",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Slug
                  </label>
                  <input
                    type="text"
                    value={navSlug}
                    onChange={(e) => setNavSlug(e.target.value)}
                    placeholder="architecture-planning"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#0E1015",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#F3F4F6",
                      fontSize: "13px",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Short Description (Displayed in Split Layout)
                </label>
                <textarea
                  rows={3}
                  value={navDesc}
                  onChange={(e) => setNavDesc(e.target.value)}
                  placeholder="Comprehensive structural planning, 3D elevation design, and municipal approvals..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Photo (Firebase Storage / WebP)
                </label>
                <ImageUploadField
                  value={navImage}
                  onChange={setNavImage}
                  label="Upload or Select Service Photo"
                  dark={true}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Target Link
                  </label>
                  <input
                    type="text"
                    value={navLink}
                    onChange={(e) => setNavLink(e.target.value)}
                    placeholder="/services/residential"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#0E1015",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#F3F4F6",
                      fontSize: "13px",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Status
                  </label>
                  <select
                    value={navPublished ? "true" : "false"}
                    onChange={(e) => setNavPublished(e.target.value === "true")}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      background: "#0E1015",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#F3F4F6",
                      fontSize: "13px",
                      boxSizing: "border-box",
                      outline: "none",
                      cursor: "pointer",
                    }}
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
                  disabled={saving}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#D1D5DB",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: "#C5A880",
                    color: "#0E1015",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 22px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: saving ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {saving && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT DETAILED SERVICE                                   */}
      {/* ============================================================== */}
      {editingDetailed && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(6px)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#151720",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px" }}>
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={detTitle}
                  onChange={(e) => setDetTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Subtitle / Hook
                </label>
                <input
                  type="text"
                  value={detSubtitle}
                  onChange={(e) => setDetSubtitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Hero Banner Image
                </label>
                <ImageUploadField
                  value={detImage}
                  onChange={setDetImage}
                  label="Upload or Select Service Hero Image"
                  dark={true}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={detDesc}
                  onChange={(e) => setDetDesc(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Sub-Services Included (One per line)
                </label>
                <textarea
                  rows={4}
                  value={detSubServices}
                  onChange={(e) => setDetSubServices(e.target.value)}
                  placeholder="Living Room Design&#10;Master Suite Architecture&#10;Modular Kitchens"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "12px",
                    fontFamily: "monospace",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingDetailed(null)}
                  disabled={saving}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#D1D5DB",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: "#C5A880",
                    color: "#0E1015",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 22px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: saving ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {saving && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                  <span>Save Page Content</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT SPECIALTY SERVICE                            */}
      {/* ============================================================== */}
      {showAddSpecialtyModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(6px)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#151720",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "540px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "14px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                {editingSpecialty ? `Edit Specialty: ${editingSpecialty.name}` : "Add Specialty Service"}
              </h2>
              <button
                onClick={() => setShowAddSpecialtyModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSpecialty} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Specialty Name *
                </label>
                <input
                  type="text"
                  required
                  value={specName}
                  onChange={(e) => setSpecName(e.target.value)}
                  placeholder="e.g. Bespoke Joinery & Millwork"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={specTagline}
                  onChange={(e) => setSpecTagline(e.target.value)}
                  placeholder="e.g. Master craftsmanship in wood and metal"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Icon Style
                </label>
                <select
                  value={specIcon}
                  onChange={(e) => setSpecIcon(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="Sparkles">Sparkles (Luxury & Finish)</option>
                  <option value="Compass">Compass (Architecture & Planning)</option>
                  <option value="Palette">Palette (Color & Design)</option>
                  <option value="Hammer">Hammer (Execution & Craft)</option>
                  <option value="ShieldCheck">ShieldCheck (Quality Guarantee)</option>
                  <option value="Clock">Clock (On-time Turnkey)</option>
                  <option value="Award">Award (Premium Materials)</option>
                  <option value="Gem">Gem (Exclusive Spaces)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  value={specDesc}
                  onChange={(e) => setSpecDesc(e.target.value)}
                  placeholder="Details about what makes this specialty unique..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "#0E1015",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "6px",
                    color: "#F3F4F6",
                    fontSize: "13px",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddSpecialtyModal(false)}
                  disabled={saving}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#D1D5DB",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: "#C5A880",
                    color: "#0E1015",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 22px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: saving ? "wait" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {saving && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                  <span>Save Specialty</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRM SERVICE DELETION DIALOG                                */}
      {/* ============================================================== */}
      {serviceToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#161822",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EF4444",
                  flexShrink: 0,
                }}
              >
                <AlertCircle size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: "18px", color: "#F3F4F6", fontWeight: 600 }}>
                Delete Homepage Service?
              </h3>
            </div>

            <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 20px 0" }}>
              Are you sure you want to delete{" "}
              <strong style={{ color: "#F3F4F6" }}>"{serviceToDelete.title}"</strong>? This will remove it from the
              homepage 6-service split layout immediately.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                disabled={saving}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#D1D5DB",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteNav}
                disabled={saving}
                style={{
                  background: "#EF4444",
                  border: "none",
                  color: "#FFF",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: saving ? "wait" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {saving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                <span>Delete Service</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRM SPECIALTY DELETION DIALOG                              */}
      {/* ============================================================== */}
      {specialtyToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#161822",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "440px",
              width: "100%",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(239, 68, 68, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EF4444",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: "17px", color: "#F3F4F6", fontWeight: 600 }}>
                Delete Specialty Service?
              </h3>
            </div>

            <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 20px 0" }}>
              Are you sure you want to remove{" "}
              <strong style={{ color: "#F3F4F6" }}>"{specialtyToDelete.name}"</strong> from the public services grid?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setSpecialtyToDelete(null)}
                disabled={saving}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#D1D5DB",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSpecialty}
                disabled={saving}
                style={{
                  background: "#EF4444",
                  border: "none",
                  color: "#FFF",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: saving ? "wait" : "pointer",
                }}
              >
                Remove Specialty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
