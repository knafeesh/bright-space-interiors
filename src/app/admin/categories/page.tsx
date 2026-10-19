"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { CategoryItem } from "@/lib/site-types";

export default function CategoriesManagerPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Category Edit / Add Modal
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catGroup, setCatGroup] = useState("Living & Lounge");
  const [catType, setCatType] = useState<"residential" | "commercial">("residential");
  const [catHeroTitle, setCatHeroTitle] = useState("");
  const [catHeroSubtitle, setCatHeroSubtitle] = useState("");
  const [catHeroImage, setCatHeroImage] = useState("/images/hero-luxury.jpg");
  const [catMetaTitle, setCatMetaTitle] = useState("");
  const [catMetaDesc, setCatMetaDesc] = useState("");
  const [catPublished, setCatPublished] = useState(true);

  // Design Card Modal
  const [showCardModal, setShowCardModal] = useState(false);
  const [targetCategorySlug, setTargetCategorySlug] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState("");
  const [cardImage, setCardImage] = useState("/images/hero-luxury.jpg");

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch {
      notifyError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddCategory = () => {
    setEditingCat(null);
    setCatName("");
    setCatSlug("");
    setCatGroup("Living & Lounge");
    setCatType("residential");
    setCatHeroTitle("");
    setCatHeroSubtitle("");
    setCatHeroImage("/images/hero-luxury.jpg");
    setCatMetaTitle("");
    setCatMetaDesc("");
    setCatPublished(true);
    setShowCatModal(true);
  };

  const openEditCategory = (c: CategoryItem) => {
    setEditingCat(c);
    setCatName(c.name);
    setCatSlug(c.slug);
    setCatGroup(c.group);
    setCatType(c.type || "residential");
    setCatHeroTitle(c.heroTitle || c.name);
    setCatHeroSubtitle(c.heroSubtitle || "");
    setCatHeroImage(c.heroImage || "/images/hero-luxury.jpg");
    setCatMetaTitle(c.metaTitle || "");
    setCatMetaDesc(c.metaDescription || "");
    setCatPublished(c.published !== false);
    setShowCatModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      notifyError("Category name is required.");
      return;
    }

    const cleanSlug =
      catSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
      catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const payload: Partial<CategoryItem> & { slug: string; name: string } = {
      slug: cleanSlug,
      name: catName.trim(),
      group: catGroup,
      type: catType,
      heroTitle: catHeroTitle.trim() || catName.trim(),
      heroSubtitle: catHeroSubtitle.trim(),
      heroImage: catHeroImage.trim(),
      metaTitle: catMetaTitle.trim() || `${catName.trim()} | Bright Space Interiors`,
      metaDescription: catMetaDesc.trim(),
      published: catPublished,
      designs: editingCat ? editingCat.designs : [],
      order: editingCat ? editingCat.order : categories.length + 1,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: payload }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories);
        setShowCatModal(false);
        setEditingCat(null);
        notify(`Category "${payload.name}" saved and synced to Firestore!`);
      } else {
        notifyError(data.error || "Failed to save category.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async (c: CategoryItem) => {
    const updated = { ...c, published: c.published === false ? true : false };
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        notify(`Category "${c.name}" is now ${updated.published ? "Live" : "Draft"}.`);
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (c: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete category "${c.name}" and all its design cards? This will return 404 on /design-ideas/${c.slug}.`)) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories?slug=${c.slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        notify(`Deleted category "${c.name}". Public URL returns 404.`);
      } else {
        notifyError(data.error || "Failed to delete category.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  // --- Design Card Handlers ---
  const openAddCard = (categorySlug: string) => {
    setTargetCategorySlug(categorySlug);
    setEditingCardId(null);
    setCardTitle("");
    setCardImage("/images/hero-luxury.jpg");
    setShowCardModal(true);
  };

  const openEditCard = (categorySlug: string, card: any) => {
    setTargetCategorySlug(categorySlug);
    setEditingCardId(card.id);
    setCardTitle(card.title);
    setCardImage(card.image);
    setShowCardModal(true);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardTitle.trim()) {
      notifyError("Design title is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug: targetCategorySlug,
          designCard: {
            id: editingCardId || undefined,
            title: cardTitle.trim(),
            image: cardImage.trim(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setShowCardModal(false);
        notify("Design card saved to category!");
      } else {
        notifyError(data.error || "Failed to save design card.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (categorySlug: string, cardId: string) => {
    if (!confirm("Are you sure you want to delete this design card?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories?categorySlug=${categorySlug}&cardId=${cardId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        notify("Design card deleted.");
      } else {
        notifyError("Failed to delete card.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = categories.filter((c) => {
    const matchesGroup = groupFilter === "All" || c.group === groupFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const uniqueGroups = Array.from(new Set(categories.map((c) => c.group)));

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
            Design Ideas Categories
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Manage all 32 Design Ideas room categories, hero imagery, SEO, and visual design cards (/design-ideas/[slug]).
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={openAddCategory}
            className="admin-btn admin-btn--gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> Add New Category
          </button>
          <Link
            href="/design-ideas"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View /design-ideas
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flex: 1, maxWidth: "560px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Search category name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ width: "100%", paddingLeft: "36px", height: "40px" }}
            />
          </div>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="admin-select"
            style={{ width: "180px", height: "40px" }}
          >
            <option value="All">All Groups</option>
            {uniqueGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
          Showing <strong>{filtered.length}</strong> of {categories.length} categories
        </div>
      </div>

      {/* Categories Accordion List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
            <p>Loading categories from Firestore...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
            No categories match your search.
          </div>
        ) : (
          filtered.map((cat) => {
            const isExpanded = expandedSlug === cat.slug;
            return (
              <div
                key={cat.slug}
                style={{
                  background: "#161920",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {/* Category Header Bar */}
                <div
                  style={{
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", flex: 1 }}
                    onClick={() => setExpandedSlug(isExpanded ? null : cat.slug)}
                  >
                    <button style={{ background: "none", border: "none", color: "#C5A880", cursor: "pointer", padding: 0 }}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <img
                      src={cat.heroImage || "/images/hero-luxury.jpg"}
                      alt={cat.name}
                      style={{ width: "48px", height: "36px", objectFit: "cover", borderRadius: "6px" }}
                    />
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "#F3F4F6" }}>{cat.name}</div>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "monospace" }}>
                        /design-ideas/{cat.slug} • {cat.group} • {cat.designs?.length || 0} designs
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Status Pill */}
                    <button
                      onClick={() => handleTogglePublished(cat)}
                      disabled={saving}
                      style={{
                        background: cat.published !== false ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        border: `1px solid ${cat.published !== false ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                        color: cat.published !== false ? "#10B981" : "#F59E0B",
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
                      {cat.published !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{cat.published !== false ? "Published" : "Draft"}</span>
                    </button>

                    {cat.published !== false && (
                      <Link
                        href={`/design-ideas/${cat.slug}`}
                        target="_blank"
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px" }}
                        title="View live page"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}

                    <button
                      onClick={() => openEditCategory(cat)}
                      className="admin-btn admin-btn--outline"
                      style={{ padding: "6px 8px" }}
                      title="Edit Category & SEO"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="admin-btn admin-btn--outline"
                      style={{ padding: "6px 8px", color: "#EF4444" }}
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded Design Cards Grid */}
                {isExpanded && (
                  <div
                    style={{
                      padding: "16px 20px 20px",
                      background: "rgba(0,0,0,0.25)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#C5A880" }}>
                        Design Gallery Cards ({cat.designs?.length || 0})
                      </span>
                      <button
                        onClick={() => openAddCard(cat.slug)}
                        className="admin-btn admin-btn--gold"
                        style={{ padding: "4px 10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <Plus size={14} /> Add Design Card
                      </button>
                    </div>

                    {(!cat.designs || cat.designs.length === 0) ? (
                      <div style={{ padding: "20px", textAlign: "center", color: "#6B7280", fontSize: "13px" }}>
                        No design cards in this category yet. Click "Add Design Card" to showcase photo ideas.
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {cat.designs.map((card) => (
                          <div
                            key={card.id}
                            style={{
                              background: "#12141A",
                              border: "1px solid rgba(255,255,255,0.06)",
                              borderRadius: "8px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={card.image}
                              alt={card.title}
                              style={{ width: "100%", height: "120px", objectFit: "cover" }}
                            />
                            <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "12px", fontWeight: 500, color: "#E5E7EB", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {card.title}
                              </span>
                              <div style={{ display: "flex", gap: "4px" }}>
                                <button
                                  onClick={() => openEditCard(cat.slug, card)}
                                  style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", padding: "2px" }}
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCard(cat.slug, card.id)}
                                  style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "2px" }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Category Edit / Add */}
      {showCatModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "680px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                {editingCat ? `Edit Category: ${editingCat.name}` : "Add Design Category"}
              </h2>
              <button
                onClick={() => setShowCatModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. Master Bedroom"
                  />
                </div>
                <div>
                  <label className="admin-label">Slug</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="admin-input"
                    placeholder="master-bedroom"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Group</label>
                  <select
                    value={catGroup}
                    onChange={(e) => setCatGroup(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Living & Lounge">Living & Lounge</option>
                    <option value="Kitchen & Dining">Kitchen & Dining</option>
                    <option value="Bedroom & Dressing">Bedroom & Dressing</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Office & Commercial">Office & Commercial</option>
                    <option value="Architectural & Specialty">Architectural & Specialty</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Type</label>
                  <select
                    value={catType}
                    onChange={(e) => setCatType(e.target.value as any)}
                    className="admin-select"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="admin-label">Publish Status</label>
                  <select
                    value={catPublished ? "true" : "false"}
                    onChange={(e) => setCatPublished(e.target.value === "true")}
                    className="admin-select"
                  >
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label">Hero Banner Image (Firebase Storage / WebP)</label>
                <ImageUploadField
                  value={catHeroImage}
                  onChange={setCatHeroImage}
                  label="Upload or Select Category Hero Banner"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Hero Title</label>
                  <input
                    type="text"
                    value={catHeroTitle}
                    onChange={(e) => setCatHeroTitle(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. Master Bedroom Designs"
                  />
                </div>
                <div>
                  <label className="admin-label">Hero Subtitle</label>
                  <input
                    type="text"
                    value={catHeroSubtitle}
                    onChange={(e) => setCatHeroSubtitle(e.target.value)}
                    className="admin-input"
                    placeholder="Luxury suite concepts tailored for Delhi NCR"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">SEO Meta Title</label>
                <input
                  type="text"
                  value={catMetaTitle}
                  onChange={(e) => setCatMetaTitle(e.target.value)}
                  className="admin-input"
                  placeholder="Master Bedroom Interior Designs in Delhi NCR | Bright Space"
                />
              </div>

              <div>
                <label className="admin-label">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={catMetaDesc}
                  onChange={(e) => setCatMetaDesc(e.target.value)}
                  className="admin-input"
                  placeholder="Explore bespoke master bedroom design ideas crafted by Bright Space Interiors..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Design Card */}
      {showCardModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "540px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "18px", margin: 0, color: "#F3F4F6" }}>
                {editingCardId ? "Edit Design Card" : "Add Design Card"}
              </h2>
              <button
                onClick={() => setShowCardModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCard} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Design Title *</label>
                <input
                  type="text"
                  required
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Modern Fluted Wall Paneling"
                />
              </div>

              <div>
                <label className="admin-label">Card Photo (Firebase Storage / WebP)</label>
                <ImageUploadField
                  value={cardImage}
                  onChange={setCardImage}
                  label="Upload or Select Design Photo"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
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
                  <span>Save Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
