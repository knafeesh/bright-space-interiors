"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ArrowLeft,
  X,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Layers,
  Image as ImageIcon,
  ChevronRight,
  Filter,
} from "lucide-react";
import { DesignCategory, DesignCard } from "@/lib/design-ideas-data";
import {
  saveStoredDesignCategories,
  loadStoredDesignCategories,
} from "@/lib/design-ideas-client";

export default function AdminDesignIdeasPage() {
  const [categories, setCategories] = useState<DesignCategory[]>(() => {
    return loadStoredDesignCategories() || [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Category View: null means Dashboard of all 32 categories; string means managing that category's cards
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");

  // Notifications
  const [successToast, setSuccessToast] = useState("");
  const [errorToast, setErrorToast] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCard, setEditingCard] = useState<{
    design: DesignCard;
    categorySlug: string;
  } | null>(null);
  const [deletingCard, setDeletingCard] = useState<{
    design: DesignCard;
    categorySlug: string;
  } | null>(null);

  // Add Form State
  const [addTitle, setAddTitle] = useState("");
  const [addCategorySlug, setAddCategorySlug] = useState("");
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addUploading, setAddUploading] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editCategorySlug, setEditCategorySlug] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editUploading, setEditUploading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Action State
  const [deleteSaving, setDeleteSaving] = useState(false);

  const notifySuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(""), 5000);
  };

  // ─── Fetch Categories ────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/design-ideas", { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Admin session expired. Please refresh and log in again.");
        }
        throw new Error(`Failed to load data (HTTP ${res.status}).`);
      }
      const data = await res.json();
      if (data && Array.isArray(data.categories)) {
        setCategories(data.categories);
        saveStoredDesignCategories(data.categories);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ─── Computed Statistics ──────────────────────────────────────────────────────
  const totalCategoriesCount = categories.length;
  const totalDesignsCount = useMemo(() => {
    return categories.reduce((sum, cat) => sum + (cat.designs?.length || 0), 0);
  }, [categories]);

  const uniqueGroups = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((cat) => {
      if (cat.group) set.add(cat.group);
    });
    return ["All", ...Array.from(set)];
  }, [categories]);

  // Selected Category Object
  const currentCategory = useMemo(() => {
    if (!selectedCategorySlug) return null;
    return categories.find((c) => c.slug === selectedCategorySlug) || null;
  }, [categories, selectedCategorySlug]);

  // Filtered Categories for Dashboard
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesGroup = groupFilter === "All" || cat.group === groupFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.designs.some((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesGroup && matchesSearch;
    });
  }, [categories, groupFilter, searchQuery]);

  // Filtered Designs for Active Category View
  const filteredCategoryDesigns = useMemo(() => {
    if (!currentCategory) return [];
    if (!searchQuery.trim()) return currentCategory.designs || [];
    const q = searchQuery.toLowerCase();
    return (currentCategory.designs || []).filter((d) => d.title.toLowerCase().includes(q));
  }, [currentCategory, searchQuery]);

  // ─── Image Upload Handler (Shared) ──────────────────────────────────────────
  const handleUploadFile = async (
    file: File,
    onSuccess: (url: string) => void,
    setUploadState: (state: boolean) => void
  ) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      notifyError("Invalid file type. Please upload a JPG, PNG, WebP, GIF, or AVIF image.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      notifyError("Image exceeds 4 MB limit. Please choose a smaller image.");
      return;
    }

    setUploadState(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onSuccess(data.url);
      notifySuccess("Image uploaded successfully!");
    } catch (err: any) {
      notifyError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploadState(false);
    }
  };

  // ─── Open Add Modal ──────────────────────────────────────────────────────────
  const handleOpenAdd = (preselectedSlug?: string) => {
    setAddTitle("");
    setAddImageUrl("");
    setAddCategorySlug(preselectedSlug || selectedCategorySlug || categories[0]?.slug || "crockery-unit-designs");
    setShowAddModal(true);
  };

  // ─── Submit Add Form ─────────────────────────────────────────────────────────
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim()) {
      notifyError("Please enter a design title.");
      return;
    }
    if (!addImageUrl.trim()) {
      notifyError("Please upload or enter an image URL.");
      return;
    }
    if (!addCategorySlug) {
      notifyError("Please select a category.");
      return;
    }

    setAddSaving(true);
    try {
      const res = await fetch("/api/admin/design-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: addCategorySlug,
          title: addTitle.trim(),
          image: addImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add design.");
      }

      notifySuccess(`New design "${addTitle.trim()}" created successfully!`);
      setShowAddModal(false);

      // Update local state smoothly
      setCategories((prev) => {
        const next = data.categories || prev.map((cat) => {
          if (cat.slug === addCategorySlug) {
            return {
              ...cat,
              designs: [data.design, ...(cat.designs || [])],
            };
          }
          return cat;
        });
        saveStoredDesignCategories(next);
        return next;
      });
    } catch (err: any) {
      notifyError(err.message || "Failed to save design.");
    } finally {
      setAddSaving(false);
    }
  };

  // ─── Open Edit Modal ─────────────────────────────────────────────────────────
  const handleOpenEdit = (design: DesignCard, categorySlug: string) => {
    setEditingCard({ design, categorySlug });
    setEditTitle(design.title);
    setEditImageUrl(design.image);
    setEditCategorySlug(categorySlug);
  };

  // ─── Submit Edit Form ────────────────────────────────────────────────────────
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    if (!editTitle.trim()) {
      notifyError("Please enter a design title.");
      return;
    }
    if (!editImageUrl.trim()) {
      notifyError("Please provide an image URL.");
      return;
    }

    setEditSaving(true);
    try {
      const res = await fetch("/api/admin/design-ideas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCard.design.id,
          title: editTitle.trim(),
          image: editImageUrl.trim(),
          categorySlug: editCategorySlug,
          oldCategorySlug: editingCard.categorySlug,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update design.");
      }

      notifySuccess(`Design "${editTitle.trim()}" updated successfully!`);
      const updatedDesign: DesignCard = data.design;

      // Update local state smoothly
      setCategories((prev) => {
        const isMoved = editingCard.categorySlug !== editCategorySlug;
        const next = data.categories || prev.map((cat) => {
          if (isMoved) {
            if (cat.slug === editingCard.categorySlug) {
              return {
                ...cat,
                designs: cat.designs.filter((d) => d.id !== editingCard.design.id),
              };
            }
            if (cat.slug === editCategorySlug) {
              return {
                ...cat,
                designs: [updatedDesign, ...(cat.designs || [])],
              };
            }
          } else if (cat.slug === editCategorySlug) {
            return {
              ...cat,
              designs: cat.designs.map((d) => (d.id === updatedDesign.id ? updatedDesign : d)),
            };
          }
          return cat;
        });
        saveStoredDesignCategories(next);
        return next;
      });

      setEditingCard(null);
    } catch (err: any) {
      notifyError(err.message || "Failed to update design.");
    } finally {
      setEditSaving(false);
    }
  };

  // ─── Confirm Delete ──────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingCard) return;

    setDeleteSaving(true);
    try {
      const res = await fetch(
        `/api/admin/design-ideas?id=${encodeURIComponent(deletingCard.design.id)}&categorySlug=${encodeURIComponent(
          deletingCard.categorySlug
        )}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete design.");
      }

      notifySuccess(`Design "${deletingCard.design.title}" deleted successfully.`);

      // Update local state
      setCategories((prev) => {
        const next = data.categories || prev.map((cat) => {
          if (cat.slug === deletingCard.categorySlug) {
            return {
              ...cat,
              designs: cat.designs.filter((d) => d.id !== deletingCard.design.id),
            };
          }
          return cat;
        });
        saveStoredDesignCategories(next);
        return next;
      });

      setDeletingCard(null);
    } catch (err: any) {
      notifyError(err.message || "Failed to delete design.");
    } finally {
      setDeleteSaving(false);
    }
  };

  return (
    <div className="admin-content" style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "80px" }}>
      {/* ══════════════ TOAST NOTIFICATIONS ══════════════ */}
      {successToast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: "#1C1C1C",
            color: "#FFFFFF",
            padding: "14px 22px",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            borderLeft: "4px solid var(--gold, #B8975A)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 9999,
            fontSize: "13.5px",
            fontWeight: 500,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <Check size={18} style={{ color: "var(--gold, #B8975A)" }} />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: "#EF4444",
            color: "#FFFFFF",
            padding: "14px 22px",
            borderRadius: "8px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 9999,
            fontSize: "13.5px",
            fontWeight: 500,
            animation: "fadeIn 0.2s ease",
          }}
        >
          <AlertCircle size={18} />
          <span>{errorToast}</span>
        </div>
      )}

      {/* ══════════════ TOP HEADER BAR ══════════════ */}
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--gold, #B8975A)",
              }}
            >
              <Sparkles size={13} /> Inspiration Gallery
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(24px, 2.5vw, 32px)",
              fontWeight: 600,
              color: "var(--charcoal, #1C1C1C)",
              margin: 0,
            }}
          >
            Design Ideas Management
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "var(--text-secondary, #6B7280)",
              margin: "6px 0 0",
              maxWidth: "680px",
            }}
          >
            Manage design photographs, titles, and galleries across all 32 Design Ideas categories. Updates publish immediately to the live public website.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/design-ideas"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
          >
            <ExternalLink size={14} /> View Public Gallery
          </Link>

          <button
            onClick={() => handleOpenAdd(selectedCategorySlug || undefined)}
            className="admin-btn admin-btn--primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
            type="button"
          >
            <Plus size={15} /> Add New Design
          </button>
        </div>
      </div>

      {/* ══════════════ STATS BAR ══════════════ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <div className="admin-table-wrap" style={{ padding: "18px 22px", margin: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Total Categories
              </span>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--charcoal, #1C1C1C)", marginTop: "4px" }}>
                {totalCategoriesCount}
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(184, 151, 90, 0.12)",
                color: "var(--gold, #B8975A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Layers size={22} />
            </div>
          </div>
        </div>

        <div className="admin-table-wrap" style={{ padding: "18px 22px", margin: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Total Design Images
              </span>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--gold-dark, #8C7148)", marginTop: "4px" }}>
                {totalDesignsCount}
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(184, 151, 90, 0.12)",
                color: "var(--gold, #B8975A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon size={22} />
            </div>
          </div>
        </div>

        <div className="admin-table-wrap" style={{ padding: "18px 22px", margin: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Active View
              </span>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--charcoal, #1C1C1C)",
                  marginTop: "6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "180px",
                }}
              >
                {currentCategory ? currentCategory.name : "All 32 Categories"}
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "rgba(28, 24, 22, 0.06)",
                color: "var(--charcoal, #1C1C1C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Filter size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ SEARCH & FILTER BAR ══════════════ */}
      <div className="admin-table-wrap" style={{ padding: "16px 20px", marginBottom: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          {/* Breadcrumb / Mode indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {selectedCategorySlug ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategorySlug(null);
                  setSearchQuery("");
                }}
                className="admin-btn admin-btn--outline"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "7px 14px" }}
              >
                <ArrowLeft size={14} /> Back to All Categories
              </button>
            ) : (
              /* Group Filter Buttons on dashboard */
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {uniqueGroups.map((group) => {
                  const active = groupFilter === group;
                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setGroupFilter(group)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "11.5px",
                        fontWeight: active ? 600 : 500,
                        border: active ? "1px solid var(--gold, #B8975A)" : "1px solid #E5E7EB",
                        background: active ? "var(--charcoal, #1C1C1C)" : "#FFFFFF",
                        color: active ? "var(--gold-light, #DFC59E)" : "var(--charcoal, #1C1C1C)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "280px" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted, #9CA3AF)",
              }}
            />
            <input
              type="text"
              placeholder={
                selectedCategorySlug
                  ? `Search designs in ${currentCategory?.name || "category"}...`
                  : "Search designs or categories..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 14px 9px 38px",
                border: "1px solid #E5E7EB",
                borderRadius: "20px",
                fontSize: "13px",
                outline: "none",
                background: "#FFFFFF",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9CA3AF",
                  padding: 0,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════ MAIN CONTENT AREA ══════════════ */}
      {loading ? (
        <div className="admin-table-wrap" style={{ padding: "80px 20px", textAlign: "center" }}>
          <Loader2 size={36} className="spin" style={{ color: "var(--gold, #B8975A)", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "16px", color: "var(--charcoal, #1C1C1C)", margin: 0 }}>
            Loading Design Ideas Repository...
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted, #9CA3AF)", marginTop: "6px" }}>
            Syncing all 32 categories and design images from the database.
          </p>
        </div>
      ) : error ? (
        <div className="admin-table-wrap" style={{ padding: "60px 20px", textAlign: "center" }}>
          <AlertCircle size={36} style={{ color: "#EF4444", margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "17px", color: "#EF4444", margin: "0 0 8px" }}>
            Failed to Load Data
          </h3>
          <p style={{ fontSize: "13.5px", color: "var(--text-secondary, #6B7280)", margin: "0 0 20px" }}>
            {error}
          </p>
          <button onClick={fetchCategories} className="admin-btn admin-btn--primary" type="button">
            Retry Connection
          </button>
        </div>
      ) : selectedCategorySlug && currentCategory ? (
        /* ══════════════ VIEW 2: SINGLE CATEGORY DESIGNS VIEW ══════════════ */
        <div>
          {/* Category Banner */}
          <div
            className="admin-table-wrap"
            style={{
              padding: "24px 28px",
              marginBottom: "28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "18px",
              borderLeft: "4px solid var(--gold, #B8975A)",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "12px",
                    background: "rgba(184, 151, 90, 0.15)",
                    color: "var(--gold-dark, #8C7148)",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {currentCategory.group}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted, #9CA3AF)" }}>
                  Slug: <code style={{ color: "var(--charcoal, #1C1C1C)" }}>{currentCategory.slug}</code>
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "var(--charcoal, #1C1C1C)",
                  margin: "4px 0 6px",
                }}
              >
                {currentCategory.name}
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-secondary, #6B7280)", margin: 0 }}>
                {currentCategory.designs?.length || 0} active design photographs in this gallery.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                href={`/design-ideas/${currentCategory.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn--outline"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
              >
                <ExternalLink size={14} /> Open Public Page
              </Link>
              <button
                type="button"
                onClick={() => handleOpenAdd(currentCategory.slug)}
                className="admin-btn admin-btn--primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px" }}
              >
                <Plus size={15} /> Add Design to {currentCategory.name}
              </button>
            </div>
          </div>

          {/* Design Cards Grid */}
          {filteredCategoryDesigns.length === 0 ? (
            <div className="admin-table-wrap" style={{ padding: "60px 20px", textAlign: "center" }}>
              <ImageIcon size={40} style={{ color: "var(--gold, #B8975A)", margin: "0 auto 14px", opacity: 0.6 }} />
              <h3 style={{ fontSize: "17px", color: "var(--charcoal, #1C1C1C)", margin: "0 0 6px" }}>
                No designs found in this category
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted, #9CA3AF)", margin: "0 0 20px" }}>
                {searchQuery
                  ? `No designs matching "${searchQuery}".`
                  : "Get started by adding the first design photograph to this category."}
              </p>
              <button
                type="button"
                onClick={() => handleOpenAdd(currentCategory.slug)}
                className="admin-btn admin-btn--primary"
              >
                <Plus size={14} /> Add First Design
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                gap: "24px",
              }}
            >
              {filteredCategoryDesigns.map((design, index) => (
                <div
                  key={design.id}
                  className="admin-table-wrap"
                  style={{
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: "14px",
                    boxShadow: "0 4px 16px rgba(28, 24, 22, 0.06)",
                    border: "1px solid rgba(184, 151, 90, 0.2)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* Image Thumbnail Container */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 11",
                      background: "#F3F4F6",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={design.image}
                      alt={design.title}
                      loading={index < 6 ? "eager" : "lazy"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {/* Order Pill */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        padding: "3px 9px",
                        borderRadius: "8px",
                        background: "rgba(28, 24, 22, 0.75)",
                        backdropFilter: "blur(4px)",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      #{index + 1}
                    </div>
                  </div>

                  {/* Card Content & Title */}
                  <div
                    style={{
                      padding: "18px 20px 16px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--gold-dark, #8C7148)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        {currentCategory.name}
                      </span>
                      <h4
                        style={{
                          fontFamily: "var(--font-sans, sans-serif)",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "var(--charcoal, #1C1C1C)",
                          lineHeight: 1.35,
                          margin: "0 0 14px",
                        }}
                      >
                        {design.title}
                      </h4>
                    </div>

                    {/* Card Actions: Edit & Delete */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid #F0F0F0",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(design, currentCategory.slug)}
                        className="admin-btn admin-btn--outline"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          padding: "6px 14px",
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingCard({ design, categorySlug: currentCategory.slug })}
                        className="admin-btn admin-btn--danger"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          padding: "6px 14px",
                        }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ══════════════ VIEW 1: ALL 32 CATEGORIES OVERVIEW ══════════════ */
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))",
              gap: "22px",
            }}
          >
            {filteredCategories.map((category) => {
              const count = category.designs?.length || 0;
              return (
                <div
                  key={category.slug}
                  className="admin-table-wrap"
                  style={{
                    margin: 0,
                    borderRadius: "14px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 16px rgba(28, 24, 22, 0.05)",
                    border: "1px solid rgba(184, 151, 90, 0.2)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  {/* Category Hero Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9.5",
                      background: "#E5E7EB",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={category.heroImage}
                      alt={category.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    {/* Group Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        padding: "3px 9px",
                        borderRadius: "6px",
                        background: "rgba(28, 24, 22, 0.8)",
                        backdropFilter: "blur(4px)",
                        color: "var(--gold-light, #DFC59E)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {category.group}
                    </div>

                    {/* Images Count Badge */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        right: "12px",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: "rgba(28, 24, 22, 0.85)",
                        backdropFilter: "blur(4px)",
                        color: "#FFFFFF",
                        fontSize: "11px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <ImageIcon size={12} style={{ color: "var(--gold, #B8975A)" }} />
                      <span>{count} Designs</span>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div
                    style={{
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                          fontSize: "18.5px",
                          fontWeight: 600,
                          color: "var(--charcoal, #1C1C1C)",
                          margin: "0 0 6px",
                          lineHeight: 1.3,
                        }}
                      >
                        {category.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "12.5px",
                          color: "var(--text-muted, #6B7280)",
                          margin: "0 0 16px",
                          lineHeight: 1.45,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {category.heroSubtitle}
                      </p>
                    </div>

                    {/* Category Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid #F0F0F0",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategorySlug(category.slug);
                          setSearchQuery("");
                        }}
                        className="admin-btn admin-btn--primary"
                        style={{
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "6px",
                          fontSize: "12px",
                          padding: "8px 14px",
                        }}
                      >
                        <span>Manage Designs</span>
                        <ChevronRight size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenAdd(category.slug)}
                        className="admin-btn admin-btn--outline"
                        title={`Add new design to ${category.name}`}
                        style={{
                          padding: "8px 12px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════ MODAL 1: ADD NEW DESIGN ══════════════ */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !addSaving) setShowAddModal(false);
          }}
        >
          <div
            className="admin-table-wrap"
            style={{
              maxWidth: "540px",
              width: "100%",
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              margin: 0,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              maxHeight: "92vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "var(--charcoal, #1C1C1C)",
                    margin: 0,
                  }}
                >
                  Add New Design Image
                </h3>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted, #6B7280)", margin: "4px 0 0" }}>
                  Upload a photo and assign it to a Design Ideas category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={addSaving}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9CA3AF",
                  padding: "6px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd}>
              {/* Category Selector */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", marginBottom: "6px" }}>
                  Category <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  value={addCategorySlug}
                  onChange={(e) => setAddCategorySlug(e.target.value)}
                  disabled={addSaving}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "13.5px",
                    background: "#FFFFFF",
                    color: "var(--charcoal, #1C1C1C)",
                    outline: "none",
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.group})
                    </option>
                  ))}
                </select>
              </div>

              {/* Design Title */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", marginBottom: "6px" }}>
                  Design Title <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Royal Display: Opulence in Every Detail"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  disabled={addSaving}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "13.5px",
                    color: "var(--charcoal, #1C1C1C)",
                    outline: "none",
                  }}
                />
              </div>

              {/* Image Upload & Preview */}
              <div style={{ marginBottom: "22px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", marginBottom: "6px" }}>
                  Design Photograph <span style={{ color: "#EF4444" }}>*</span>
                </label>

                {/* Upload Button & Dropzone */}
                <div
                  style={{
                    border: "2px dashed rgba(184, 151, 90, 0.4)",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    background: "rgba(250, 247, 242, 0.6)",
                    marginBottom: "12px",
                  }}
                >
                  <input
                    type="file"
                    ref={addFileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadFile(file, (url) => setAddImageUrl(url), setAddUploading);
                      }
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "rgba(184, 151, 90, 0.15)",
                        color: "var(--gold-dark, #8C7148)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {addUploading ? <Loader2 size={20} className="spin" /> : <Upload size={20} />}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        disabled={addUploading || addSaving}
                        className="admin-btn admin-btn--outline"
                        style={{ fontSize: "12px", padding: "6px 16px", marginBottom: "4px" }}
                      >
                        {addUploading ? "Uploading to Cloud Storage..." : "Upload New Image"}
                      </button>
                      <div style={{ fontSize: "11px", color: "var(--text-muted, #9CA3AF)" }}>
                        JPG, PNG, WebP or AVIF (Max 4 MB)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted, #6B7280)", display: "block", marginBottom: "4px" }}>
                    Or enter/verify Image URL:
                  </span>
                  <input
                    type="text"
                    placeholder="/images/... or https://..."
                    value={addImageUrl}
                    onChange={(e) => setAddImageUrl(e.target.value)}
                    disabled={addSaving || addUploading}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #D1D5DB",
                      fontSize: "12.5px",
                      fontFamily: "monospace",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Preview Box */}
                {addImageUrl && (
                  <div style={{ marginTop: "14px" }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", display: "block", marginBottom: "6px" }}>
                      Image Preview:
                    </span>
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 11",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#E5E7EB",
                        border: "1px solid #D1D5DB",
                      }}
                    >
                      <img
                        src={addImageUrl}
                        alt="Preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={addSaving}
                  className="admin-btn admin-btn--outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addSaving || addUploading || !addTitle.trim() || !addImageUrl.trim()}
                  className="admin-btn admin-btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {addSaving && <Loader2 size={14} className="spin" />}
                  <span>{addSaving ? "Saving to Database..." : "Save Design"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL 2: EDIT DESIGN ══════════════ */}
      {editingCard && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !editSaving) setEditingCard(null);
          }}
        >
          <div
            className="admin-table-wrap"
            style={{
              maxWidth: "540px",
              width: "100%",
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "28px",
              margin: 0,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              maxHeight: "92vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                    fontSize: "21px",
                    fontWeight: 600,
                    color: "var(--charcoal, #1C1C1C)",
                    margin: 0,
                  }}
                >
                  Edit Design Image
                </h3>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted, #6B7280)", margin: "4px 0 0" }}>
                  Replace image, update title, or move this design to another category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCard(null)}
                disabled={editSaving}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#9CA3AF",
                  padding: "6px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit}>
              {/* Category Selection Field */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", marginBottom: "6px" }}>
                  Category <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  value={editCategorySlug}
                  onChange={(e) => setEditCategorySlug(e.target.value)}
                  disabled={editSaving}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "13.5px",
                    background: "#FFFFFF",
                    color: "var(--charcoal, #1C1C1C)",
                    outline: "none",
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.group})
                    </option>
                  ))}
                </select>
              </div>

              {/* Design Title Field */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", marginBottom: "6px" }}>
                  Design Title <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={editSaving}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #D1D5DB",
                    fontSize: "13.5px",
                    color: "var(--charcoal, #1C1C1C)",
                    outline: "none",
                  }}
                />
              </div>

              {/* Current Image Preview & Replace Option */}
              <div style={{ marginBottom: "22px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", marginBottom: "6px" }}>
                  Current Image Preview
                </label>

                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 11",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "#E5E7EB",
                    border: "1px solid #D1D5DB",
                    marginBottom: "12px",
                  }}
                >
                  <img
                    src={editImageUrl}
                    alt={editTitle}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Upload New Image to Replace */}
                <div
                  style={{
                    border: "2px dashed rgba(184, 151, 90, 0.4)",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    background: "rgba(250, 247, 242, 0.6)",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadFile(file, (url) => setEditImageUrl(url), setEditUploading);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    disabled={editUploading || editSaving}
                    className="admin-btn admin-btn--outline"
                    style={{ fontSize: "12px", padding: "6px 16px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    {editUploading ? <Loader2 size={13} className="spin" /> : <Upload size={13} />}
                    <span>{editUploading ? "Uploading replacement..." : "Upload New Image to Replace"}</span>
                  </button>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted, #6B7280)", display: "block", marginBottom: "4px" }}>
                    Image URL:
                  </span>
                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    disabled={editSaving || editUploading}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #D1D5DB",
                      fontSize: "12.5px",
                      fontFamily: "monospace",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  disabled={editSaving}
                  className="admin-btn admin-btn--outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving || editUploading || !editTitle.trim() || !editImageUrl.trim()}
                  className="admin-btn admin-btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {editSaving && <Loader2 size={14} className="spin" />}
                  <span>{editSaving ? "Saving Changes..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL 3: DELETE CONFIRMATION ══════════════ */}
      {deletingCard && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !deleteSaving) setDeletingCard(null);
          }}
        >
          <div
            className="admin-table-wrap"
            style={{
              maxWidth: "460px",
              width: "100%",
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "26px",
              margin: 0,
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "18px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#FEE2E2",
                  color: "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", margin: 0 }}>
                  Delete Design Image?
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary, #6B7280)", margin: "6px 0 0", lineHeight: 1.45 }}>
                  Are you sure you want to delete this design? This will remove it permanently from the database and public category gallery.
                </p>
              </div>
            </div>

            {/* Design Preview */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "#F9FAFB",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                marginBottom: "22px",
              }}
            >
              <div style={{ width: "64px", height: "48px", borderRadius: "6px", overflow: "hidden", flexShrink: 0, background: "#E5E7EB" }}>
                <img
                  src={deletingCard.design.image}
                  alt={deletingCard.design.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ overflow: "hidden" }}>
                <span style={{ fontSize: "11px", color: "var(--gold-dark, #8C7148)", fontWeight: 600, textTransform: "uppercase" }}>
                  {categories.find((c) => c.slug === deletingCard.categorySlug)?.name || deletingCard.categorySlug}
                </span>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--charcoal, #1C1C1C)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {deletingCard.design.title}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDeletingCard(null)}
                disabled={deleteSaving}
                className="admin-btn admin-btn--outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteSaving}
                className="admin-btn admin-btn--danger"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                {deleteSaving && <Loader2 size={14} className="spin" />}
                <span>{deleteSaving ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
