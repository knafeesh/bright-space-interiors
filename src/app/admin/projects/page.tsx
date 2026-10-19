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
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { ProjectItem } from "@/lib/site-types";

export default function ProjectsManagerPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Form states for Add / Edit
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Residential");
  const [location, setLocation] = useState("Delhi NCR");
  const [area, setArea] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [duration, setDuration] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [materials, setMaterials] = useState("");
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState("/images/hero-luxury.jpg");
  const [galleryText, setGalleryText] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (err) {
      notifyError("Failed to load projects from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setTitle("");
    setSlug("");
    setCategory("Residential");
    setLocation("Delhi NCR");
    setArea("2,400 sq.ft");
    setYear(new Date().getFullYear().toString());
    setDuration("3 Months");
    setClient("Private Residence");
    setDescription("");
    setChallenge("");
    setSolution("");
    setMaterials("Italian Marble, Fluted Oak Paneling");
    setQuote("");
    setImage("/images/hero-luxury.jpg");
    setGalleryText("/images/hero-luxury.jpg\n/images/real-living-gold-trim.jpg");
    setStatus("published");
    setShowAddModal(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setCategory(p.category || "Residential");
    setLocation(p.location || "Delhi NCR");
    setArea(p.area || "");
    setYear(p.year || "");
    setDuration(p.duration || "");
    setClient(p.client || "");
    setDescription(p.description || "");
    setChallenge(p.challenge || "");
    setSolution(p.solution || "");
    setMaterials(Array.isArray(p.materials) ? p.materials.join(", ") : (p.materials || ""));
    setQuote(p.quote || "");
    setImage(p.image || "/images/hero-luxury.jpg");
    setGalleryText((p.gallery || []).join("\n"));
    setStatus(p.status || "published");
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      notifyError("Project title is required.");
      return;
    }

    const cleanSlug =
      slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const galleryArray = galleryText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const materialsArray = materials
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload: ProjectItem = {
      id: editingProject ? editingProject.id : Date.now(),
      slug: cleanSlug,
      title: title.trim(),
      category,
      categories: [category],
      location: location.trim(),
      area: area.trim(),
      year: year.trim(),
      duration: duration.trim(),
      client: client.trim(),
      clientName: client.trim(),
      description: description.trim(),
      challenge: challenge.trim(),
      solution: solution.trim(),
      materials: materialsArray,
      quote: quote.trim(),
      clientQuote: quote.trim(),
      image: image.trim(),
      gallery: galleryArray.length > 0 ? galleryArray : [image.trim()],
      bgGradient: "linear-gradient(135deg, #1C1917 0%, #2A231E 100%)",
      featured: true,
      order: editingProject ? editingProject.order : projects.length + 1,
      status,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setProjects(resData.projects);
        setShowAddModal(false);
        setEditingProject(null);
        notify(
          editingProject
            ? `Project "${payload.title}" updated and synced to Firestore!`
            : `Project "${payload.title}" created and published to site!`
        );
      } else {
        notifyError(resData.error || "Failed to persist project to Firestore.");
      }
    } catch (err) {
      notifyError("Connection failed while saving project.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (p: ProjectItem) => {
    const nextStatus = p.status === "published" ? "draft" : "published";
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        notify(`Project is now ${nextStatus === "published" ? "Live" : "Draft (Hidden from site & sitemap)"}.`);
      } else {
        notifyError(data.error || "Failed to update project status.");
      }
    } catch {
      notifyError("Network error while updating status.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: ProjectItem) => {
    if (!confirm(`Are you sure you want to delete "${p.title}"? This permanently removes it from the public website and sitemap. Its URL will return 404.`)) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${p.id}&slug=${p.slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        notify(`Deleted "${p.title}". Public page removed and returns 404.`);
      } else {
        notifyError(data.error || "Failed to delete project.");
      }
    } catch {
      notifyError("Network error deleting project.");
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const reordered = [...projects];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);

    // Update orders
    const updated = reordered.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setProjects(updated);
    setSaving(true);

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updated }),
      });
      const data = await res.json();
      if (data.success) {
        notify("Project order updated and saved to Firestore.");
      } else {
        notifyError("Failed to save reordered projects.");
        loadProjects();
      }
    } catch {
      notifyError("Network error reordering projects.");
      loadProjects();
    } finally {
      setSaving(false);
    }
  };

  const filtered = projects.filter((p) => {
    const matchesCategory = categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(search.toLowerCase())) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            Portfolio Projects
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Manage the luxury portfolio showcased on /portfolio and /portfolio/[slug]. Edits persist directly to Firestore.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={openAddModal}
            className="admin-btn admin-btn--gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> Add New Project
          </button>
          <Link
            href="/portfolio"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View /portfolio
          </Link>
        </div>
      </div>

      {/* Filters bar */}
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
        <div style={{ display: "flex", gap: "12px", flex: 1, maxWidth: "540px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search
              size={16}
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Search by title, location, slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ width: "100%", paddingLeft: "36px", height: "40px" }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="admin-select"
            style={{ width: "160px", height: "40px" }}
          >
            <option value="All">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Hospitality">Hospitality</option>
          </select>
        </div>

        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
          Showing <strong>{filtered.length}</strong> of {projects.length} projects
        </div>
      </div>

      {/* Projects Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Order</th>
              <th style={{ width: "70px" }}>Photo</th>
              <th>Title & URL Slug</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                  <p style={{ margin: 0, color: "#9CA3AF" }}>Loading projects from Firestore...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                  No projects match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((p, idx) => (
                <tr key={p.id}>
                  {/* Reorder Buttons */}
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
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleReorder(idx, "down")}
                        disabled={idx === projects.length - 1 || saving}
                        style={{
                          background: "none",
                          border: "none",
                          color: idx === projects.length - 1 ? "#4B5563" : "#C5A880",
                          cursor: idx === projects.length - 1 ? "not-allowed" : "pointer",
                          padding: "2px",
                        }}
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td>
                    <img
                      src={p.image || "/images/hero-luxury.jpg"}
                      alt={p.title}
                      style={{
                        width: "56px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </td>

                  {/* Title & Slug */}
                  <td>
                    <div style={{ fontWeight: 600, color: "#F3F4F6", fontSize: "14px" }}>{p.title}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "monospace" }}>
                      /portfolio/{p.slug}
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        background: "rgba(197, 168, 128, 0.15)",
                        color: "#C5A880",
                        fontWeight: 500,
                      }}
                    >
                      {p.category}
                    </span>
                  </td>

                  {/* Location */}
                  <td style={{ fontSize: "13px", color: "#D1D5DB" }}>{p.location || "Delhi NCR"}</td>

                  {/* Status Toggle */}
                  <td>
                    <button
                      onClick={() => handleToggleStatus(p)}
                      disabled={saving}
                      style={{
                        background: p.status === "published" ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        border: `1px solid ${p.status === "published" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                        color: p.status === "published" ? "#10B981" : "#F59E0B",
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
                      {p.status === "published" ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{p.status === "published" ? "Published" : "Draft"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      {p.status === "published" && (
                        <Link
                          href={`/portfolio/${p.slug}`}
                          target="_blank"
                          className="admin-btn admin-btn--outline"
                          style={{ padding: "6px 8px" }}
                          title="View live page"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      )}
                      <button
                        onClick={() => openEditModal(p)}
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px" }}
                        title="Edit project"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px", color: "#EF4444" }}
                        title="Delete project"
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

      {/* Add / Edit Project Modal */}
      {(showAddModal || editingProject) && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal"
            style={{ maxWidth: "800px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "22px", margin: 0, color: "#F3F4F6" }}>
                {editingProject ? `Edit Project: ${editingProject.title}` : "Add New Portfolio Project"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProject(null);
                }}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. Luxury Penthouse at DLF Camellias"
                  />
                </div>
                <div>
                  <label className="admin-label">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. luxury-penthouse-camellias"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="admin-select"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                  </select>
                </div>
                <div>
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. Gurugram, Delhi NCR"
                  />
                </div>
                <div>
                  <label className="admin-label">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="admin-select"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Area (sq.ft)</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. 3,800 sq.ft"
                  />
                </div>
                <div>
                  <label className="admin-label">Year Completed</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="admin-input"
                    placeholder="2025"
                  />
                </div>
                <div>
                  <label className="admin-label">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="admin-input"
                    placeholder="e.g. 4 Months"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">Client / Residence Type</label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Private Residence / Corporate Executive"
                />
              </div>

              {/* Hero Image Upload */}
              <div>
                <label className="admin-label">Hero Cover Image (Stored in Firebase Storage / WebP)</label>
                <ImageUploadField
                  value={image}
                  onChange={setImage}
                  label="Upload or Select Project Hero Image"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="admin-label">Gallery Images (One URL per line)</label>
                <textarea
                  rows={3}
                  value={galleryText}
                  onChange={(e) => setGalleryText(e.target.value)}
                  className="admin-input"
                  placeholder="/images/photo-1.jpg&#10;/images/photo-2.jpg"
                  style={{ fontFamily: "monospace", fontSize: "12px" }}
                />
                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                  Tip: Upload images using the media library or image uploader above, then paste their URLs here.
                </span>
              </div>

              <div>
                <label className="admin-label">Project Overview Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="admin-input"
                  placeholder="Describe the architectural and interior vision..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Design Challenge</label>
                  <textarea
                    rows={2}
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    className="admin-input"
                    placeholder="Specific design or spatial constraints..."
                  />
                </div>
                <div>
                  <label className="admin-label">Design Solution</label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="admin-input"
                    placeholder="How the studio resolved it..."
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="admin-label">Materials Used</label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    className="admin-input"
                    placeholder="Italian Marble, Custom Brass, Fluted Oak"
                  />
                </div>
                <div>
                  <label className="admin-label">Client Quote / Testimonial</label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="admin-input"
                    placeholder="Short feedback quote from client..."
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                  }}
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
                  <span>{editingProject ? "Update Project" : "Save Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
