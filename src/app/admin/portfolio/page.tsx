"use client";
import { useState } from "react";
import Link from "next/link";
import {
  useCmsProjects,
  cmsUpdateProject,
  cmsDeleteProject,
  cmsAddProject,
  Project,
} from "@/lib/cms";
import {
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  X,
  Check,
  ImageIcon,
  Upload,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function PortfolioManagerPage() {
  const projects = useCmsProjects();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [saveErrorMsg, setSaveErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Add Project Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Residential");
  const [formLocation, setFormLocation] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
  const [formDuration, setFormDuration] = useState("");
  const [formStatus, setFormStatus] = useState("Completed");
  const [formClient, setFormClient] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("/images/real-salon-facade.jpg");

  // Edit Project Form State
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editStatus, setEditStatus] = useState("Completed");
  const [editClient, setEditClient] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editChallenge, setEditChallenge] = useState("");
  const [editSolution, setEditSolution] = useState("");
  const [editQuote, setEditQuote] = useState("");
  const [editMaterials, setEditMaterials] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editGallery, setEditGallery] = useState<string[]>([]);
  const [editFeatured, setEditFeatured] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const categories = ["All", "Residential", "Commercial", "Turnkey", "Office", "Salon"];

  const filteredProjects = projects.filter((p) => {
    const matchCategory =
      categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const notifySuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const notifyError = (msg: string) => {
    setSaveErrorMsg(msg);
    setTimeout(() => setSaveErrorMsg(""), 6000);
  };

  const handleToggleFeatured = async (project: Project) => {
    const updated = { ...project, featured: !project.featured };
    const ok = await cmsUpdateProject(updated);
    if (ok) {
      notifySuccess(`Updated featured status for "${project.title}"`);
    } else {
      notifyError("Failed to update featured status on live website.");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from your portfolio? This will immediately update the live website.`)) {
      setSaving(true);
      try {
        const res = await fetch(`/api/admin/portfolio?id=${id}`, {
          method: "DELETE",
          credentials: "same-origin",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          notifyError(data.error || `Failed to delete "${title}" from database.`);
          setSaving(false);
          return;
        }
        await cmsDeleteProject(id);
        notifySuccess(`Project "${title}" deleted and removed from live website.`);
      } catch {
        const ok = await cmsDeleteProject(id);
        if (ok) {
          notifySuccess(`Project "${title}" deleted and removed from website.`);
        } else {
          notifyError(`Failed to delete "${title}" from live website.`);
        }
      } finally {
        setSaving(false);
      }
    }
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setEditTitle(project.title || "");
    setEditCategory(project.category || "Residential");
    setEditLocation(project.location || "");
    setEditArea(project.area || "");
    setEditYear(project.year || new Date().getFullYear().toString());
    setEditDuration(project.duration || "");
    setEditStatus(project.status || "Completed");
    setEditClient(project.clientName || "");
    setEditDesc(project.description || "");
    setEditChallenge(project.challenge || "");
    setEditSolution(project.solution || "");
    setEditQuote(project.clientQuote || "");
    setEditMaterials((project.materials || []).join(", "));
    setEditImage(project.image || "");
    setEditGallery(project.gallery ? [...project.gallery] : [project.image]);
    setEditFeatured(!!project.featured);
    setNewGalleryUrl("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const materialsArray = editMaterials
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const finalMainImage = editImage.trim() || editGallery[0] || "/images/hero-luxury.jpg";
    const finalGallery = editGallery.length > 0 ? editGallery : [finalMainImage];

    const updated: Project = {
      ...editingProject,
      id: editingProject.id,
      slug: editingProject.slug,
      title: editTitle.trim() || editingProject.title,
      category: editCategory || editingProject.category,
      location: editLocation.trim(),
      area: editArea.trim(),
      year: editYear.trim() || editingProject.year,
      duration: editDuration.trim(),
      status: editStatus.trim() || "Completed",
      clientName: editClient.trim(),
      description: editDesc.trim(),
      challenge: editChallenge.trim(),
      solution: editSolution.trim(),
      clientQuote: editQuote.trim(),
      materials: materialsArray.length > 0 ? materialsArray : editingProject.materials,
      image: finalMainImage,
      gallery: finalGallery,
      featured: editFeatured,
    };

    setSaving(true);
    setSaveErrorMsg("");
    setSaveSuccessMsg("");

    try {
      // 1. Direct Server-Side Database Update & Path Revalidation
      const res = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
        credentials: "same-origin",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setSaving(false);
        notifyError(data.error || `Could not save changes to "${updated.title}". Please try again.`);
        return;
      }

      // 2. Sync client-side reactive CMS store
      await cmsUpdateProject(data.project || updated);
      setSaving(false);
      setEditingProject(null);
      notifySuccess(`Changes saved to "${updated.title}" and published live on website!`);
    } catch {
      // Fallback update
      const ok = await cmsUpdateProject(updated);
      setSaving(false);
      if (ok) {
        setEditingProject(null);
        notifySuccess(`Changes saved to "${updated.title}" and updated live on website!`);
      } else {
        notifyError(`Could not update "${updated.title}" on live website. Please check connection.`);
      }
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    const removedUrl = editGallery[indexToRemove];
    const updated = editGallery.filter((_, idx) => idx !== indexToRemove);
    setEditGallery(updated);
    if (editImage === removedUrl) {
      setEditImage(updated[0] || "");
    }
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setEditGallery([...editGallery, newGalleryUrl.trim()]);
    setNewGalleryUrl("");
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const cleanSlug =
      formTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || `project-${Date.now()}`;

    const newProj: Project = {
      id: Date.now(),
      slug: cleanSlug,
      title: formTitle.trim(),
      category: formCategory,
      location: formLocation.trim() || "Delhi NCR",
      area: formArea.trim() || "2,500 sq ft",
      year: formYear.trim() || new Date().getFullYear().toString(),
      duration: formDuration.trim() || "8 weeks",
      status: formStatus || "Completed",
      featured: true,
      image: formImage.trim() || "/images/real-salon-facade.jpg",
      gallery: [formImage.trim() || "/images/real-salon-facade.jpg"],
      description: formDesc.trim() || "Luxury interior design and meticulous turnkey execution.",
      challenge: "Creating bespoke spaces harmonizing natural light and architectural materials.",
      solution: "Precision craftsmanship, refined stone, and custom timber joinery.",
      clientQuote: "The execution precision exceeded our highest expectations.",
      clientName: formClient.trim() || "Valued Client",
      materials: ["Italian Marble", "Warm Timber", "Aged Brass"],
      bgGradient: "linear-gradient(135deg, #24201A 0%, #2E261E 100%)",
    };

    setSaving(true);
    setSaveErrorMsg("");
    setSaveSuccessMsg("");

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProj),
        credentials: "same-origin",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setSaving(false);
        notifyError(data.error || `Could not create project "${newProj.title}".`);
        return;
      }

      await cmsAddProject(data.project || newProj);
      setSaving(false);
      setShowAddModal(false);
      resetAddForm();
      notifySuccess(`New project "${newProj.title}" added to portfolio and published live!`);
    } catch {
      const ok = await cmsAddProject(newProj);
      setSaving(false);
      if (ok) {
        setShowAddModal(false);
        resetAddForm();
        notifySuccess(`New project "${newProj.title}" added to portfolio and published live!`);
      } else {
        notifyError(`Could not publish "${newProj.title}". Please check connection.`);
      }
    }
  };

  const resetAddForm = () => {
    setFormTitle("");
    setFormCategory("Residential");
    setFormLocation("");
    setFormArea("");
    setFormYear(new Date().getFullYear().toString());
    setFormDuration("");
    setFormStatus("Completed");
    setFormClient("");
    setFormDesc("");
  };

  return (
    <>
      {/* Toast Feedback */}
      {saveSuccessMsg && (
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
            animation: "fadeIn 0.3s ease",
          }}
        >
          <Check size={16} />
          {saveSuccessMsg}
        </div>
      )}

      {saveErrorMsg && (
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
          {saveErrorMsg}
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Portfolio Manager
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Add, edit, or delete projects and gallery photos. All edits update live on the public website. ({projects.length} live projects)
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/portfolio" target="_blank" className="admin-btn admin-btn--outline" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ExternalLink size={14} /> View Public Portfolio
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn--primary"
            id="portfolio-add-project"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-table-wrap" style={{ padding: "16px 20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          {/* Category Chips */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: categoryFilter === cat ? "var(--charcoal)" : "#F0F0F0",
                  color: categoryFilter === cat ? "#FFF" : "var(--text-secondary)",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search projects or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 34px",
                border: "1px solid #E0E0E0",
                borderRadius: "20px",
                fontSize: "13px",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="admin-table-wrap"
            style={{ margin: 0, display: "flex", flexDirection: "column", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
          >
            {/* Image Preview Container */}
            <div style={{ position: "relative", width: "100%", height: "200px", background: "#222" }}>
              <img
                src={project.image}
                alt={project.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "rgba(0,0,0,0.65)",
                  color: "#FFF",
                  backdropFilter: "blur(4px)",
                }}
              >
                {project.category}
              </div>

              {/* Gallery count badge */}
              {project.gallery && project.gallery.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontSize: "10px",
                    fontWeight: 600,
                    background: "rgba(0,0,0,0.7)",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <ImageIcon size={10} /> {project.gallery.length} photos
                </div>
              )}

              {/* Featured Badge Toggle */}
              <button
                onClick={() => handleToggleFeatured(project)}
                title={project.featured ? "Featured on Homepage (Click to disable)" : "Not Featured (Click to enable)"}
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: project.featured ? "var(--gold)" : "rgba(0,0,0,0.65)",
                  color: "#FFF",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                <Star size={15} fill={project.featured ? "#FFF" : "none"} />
              </button>
            </div>

            {/* Project Details */}
            <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: 600, color: "var(--charcoal)" }}>
                  {project.title}
                </h3>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{project.year}</span>
              </div>

              <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                <span>📍 {project.location}</span>
                <span>📐 {project.area}</span>
                <span>⏱️ {project.duration}</span>
              </div>

              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "16px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {project.description}
              </p>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid #F0F0F0" }}>
                <Link
                  href={`/portfolio/${project.slug}`}
                  target="_blank"
                  className="admin-btn admin-btn--outline"
                  style={{ fontSize: "11px", padding: "6px 12px" }}
                >
                  <Eye size={12} /> View Page
                </Link>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="admin-btn admin-btn--outline"
                    style={{ padding: "6px 12px", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                    title="Edit Project & Images"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="admin-btn"
                    style={{ background: "#FEE2E2", color: "#DC2626", border: "none", padding: "6px 10px", fontSize: "12px", borderRadius: "6px", cursor: "pointer" }}
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="admin-table-wrap" style={{ padding: "48px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            No portfolio projects matched your search criteria.
          </p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EDIT PROJECT MODAL (Complete & Pre-populated without unwanted changes) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {editingProject && (
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
          onClick={() => setEditingProject(null)}
        >
          <div
            className="admin-table-wrap"
            style={{ width: "100%", maxWidth: "680px", padding: "32px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", fontWeight: 600, color: "var(--charcoal)" }}>
                  Edit Project
                </h2>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  All fields are prefilled. Edit what you need; untouched fields remain intact. Changes sync live on site.
                </p>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Turnkey">Turnkey</option>
                    <option value="Salon">Salon</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gurugram, Delhi NCR"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Area (e.g. 2,500 sq ft)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2,500 sq ft"
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Project Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Project Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 weeks"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Project Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Handed Over">Handed Over</option>
                  </select>
                </div>
              </div>

              {/* Main Featured Image */}
              <ImageUploadField
                label="Primary Featured Image URL *"
                value={editImage}
                onChange={setEditImage}
                folder="Projects"
                required
              />

              {/* Gallery Images with Live Removal & Addition */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Gallery Photos ({editGallery.length}) — Click ✕ to delete any photo
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  {editGallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: "72px",
                        height: "54px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: editImage === imgUrl ? "2px solid var(--gold)" : "1px solid #E0E0E0",
                      }}
                    >
                      <img src={imgUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "2px",
                          background: "rgba(220,38,38,0.85)",
                          color: "#FFF",
                          border: "none",
                          borderRadius: "50%",
                          width: "16px",
                          height: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          fontSize: "10px",
                        }}
                        title="Delete this photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {/* Add image to gallery */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. /images/...)"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    style={{ flex: 1, padding: "6px 10px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "12px" }}
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="admin-btn admin-btn--outline"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                  >
                    + Add URL
                  </button>
                  <label
                    className="admin-btn admin-btn--outline"
                    style={{
                      fontSize: "12px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    title="Upload photo from device"
                  >
                    <Upload size={13} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("file", file);
                        try {
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          if (res.ok) {
                            const data = await res.json();
                            setEditGallery((prev) => [...prev, data.url]);
                          }
                        } catch {}
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Overview Description
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", resize: "vertical" }}
                />
              </div>

              {/* Challenge & Solution */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Design Challenge
                  </label>
                  <textarea
                    rows={2}
                    value={editChallenge}
                    onChange={(e) => setEditChallenge(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Execution Solution
                  </label>
                  <textarea
                    rows={2}
                    value={editSolution}
                    onChange={(e) => setEditSolution(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "12px" }}
                  />
                </div>
              </div>

              {/* Client Quote & Materials */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Client Name & Quote
                  </label>
                  <input
                    type="text"
                    placeholder="Client Name"
                    value={editClient}
                    onChange={(e) => setEditClient(e.target.value)}
                    style={{ width: "100%", padding: "6px 10px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "12px", marginBottom: "6px" }}
                  />
                  <input
                    type="text"
                    placeholder="Testimonial Quote"
                    value={editQuote}
                    onChange={(e) => setEditQuote(e.target.value)}
                    style={{ width: "100%", padding: "6px 10px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "12px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Materials (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Italian Marble, Teak Wood, Aged Brass..."
                    value={editMaterials}
                    onChange={(e) => setEditMaterials(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "12px" }}
                  />
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", marginTop: "12px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={editFeatured}
                      onChange={(e) => setEditFeatured(e.target.checked)}
                    />
                    <span>Feature on Homepage showcase</span>
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px", borderTop: "1px solid #F0F0F0", paddingTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="admin-btn admin-btn--outline"
                >
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
      {/* ADD PROJECT MODAL */}
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
                Add New Project
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 57 Villa Interior"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Turnkey">Turnkey</option>
                    <option value="Salon">Salon</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Office">Office</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gurugram, Delhi NCR"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1,800 sq ft"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Project Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2024"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 weeks"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Handed Over">Handed Over</option>
                  </select>
                </div>
              </div>

              <ImageUploadField
                label="Main Image Path *"
                value={formImage}
                onChange={setFormImage}
                folder="Projects"
                required
              />

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the scope, materials, and execution..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="admin-btn admin-btn--outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn--primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  {saving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                  {saving ? "Publishing Project..." : "Publish to Portfolio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
