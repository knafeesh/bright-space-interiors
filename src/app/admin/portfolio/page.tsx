"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS as INITIAL_PORTFOLIO } from "@/lib/data";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  X,
  Check,
} from "lucide-react";

export default function PortfolioManagerPage() {
  const [projects, setProjects] = useState(INITIAL_PORTFOLIO);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<(typeof INITIAL_PORTFOLIO)[0] | null>(null);

  // New project state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Residential");
  const [formLocation, setFormLocation] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formImage, setFormImage] = useState("/images/project-oak-hills.jpg");

  const categories = ["All", "Residential", "Commercial", "Turnkey", "Hotel", "Salon"];

  const filteredProjects = projects.filter((p) => {
    const matchCategory = categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const handleToggleFeatured = (id: number) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to remove this project from your portfolio?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newProj = {
      id: Date.now(),
      slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: formTitle.trim(),
      category: formCategory,
      location: formLocation.trim() || "Delhi NCR",
      area: formArea.trim() || "2,500 sq ft",
      year: new Date().getFullYear().toString(),
      duration: formDuration.trim() || "8 weeks",
      featured: true,
      image: formImage,
      gallery: [formImage],
      description: formDesc.trim() || "Luxury interior design and meticulous turnkey execution.",
      challenge: "Creating bespoke spaces harmonizing natural light and architectural materials.",
      solution: "Precision craftsmanship, refined stone, and custom timber joinery.",
      clientQuote: "The execution precision exceeded our highest expectations.",
      clientName: formClient.trim() || "Valued Client",
      materials: ["Italian Marble", "Warm Timber", "Aged Brass"],
      bgGradient: "linear-gradient(135deg, #24201A 0%, #2E261E 100%)",
    };

    setProjects([newProj, ...projects]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle("");
    setFormCategory("Residential");
    setFormLocation("");
    setFormArea("");
    setFormDuration("");
    setFormClient("");
    setFormDesc("");
  };

  return (
    <>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Portfolio Manager
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Manage showcase projects, featured status, and gallery images ({projects.length} live projects)
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

              {/* Featured Badge Toggle */}
              <button
                onClick={() => handleToggleFeatured(project.id)}
                title={project.featured ? "Featured on Home" : "Not Featured"}
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
                    onClick={() => handleDelete(project.id)}
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

      {/* Add Project Modal */}
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
            style={{ width: "100%", maxWidth: "560px", padding: "32px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px" }}>Add Portfolio Project</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mirage Villa"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Turnkey">Turnkey</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Salon">Salon</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Gurugram, Delhi NCR"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Carpet Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 3,200 sq ft"
                    value={formArea}
                    onChange={(e) => setFormArea(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Execution Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 weeks"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Mehta"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Featured Image Path</label>
                <select
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                >
                  <option value="/images/project-oak-hills.jpg">Oak Hills Villa (Residential)</option>
                  <option value="/images/project-city-penthouse.jpg">City Penthouse (Luxury)</option>
                  <option value="/images/project-atelier-office.jpg">Atelier Corporate Office</option>
                  <option value="/images/project-waterfront-home.jpg">Waterfront Villa</option>
                  <option value="/images/project-turnkey.jpg">Turnkey Penthouse</option>
                  <option value="/images/project-salon.jpg">Lumina Salon</option>
                  <option value="/images/project-hotel.jpg">Azure Hotel Suite</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Project Summary</label>
                <textarea
                  rows={3}
                  placeholder="Describe the architectural concept, aesthetic styling, and design highlights..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
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
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
