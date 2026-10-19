"use client";
import { useState, useEffect, useRef } from "react";
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
  Image as ImageIcon,
  Star,
  Upload,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { ProjectItem } from "@/lib/site-types";
import { broadcastCmsProjects } from "@/lib/cms";

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

  // Gallery Modal
  const [galleryProject, setGalleryProject] = useState<ProjectItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingImageIndex, setReplacingImageIndex] = useState<number | null>(null);

  // Confirmation Modals
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);
  const [imageIndexToDelete, setImageIndexToDelete] = useState<number | null>(null);

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
    } catch {
      notifyError("Failed to load projects from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Sync galleryProject with updated projects array if it's currently open
  useEffect(() => {
    if (galleryProject) {
      const updated = projects.find((p) => p.id === galleryProject.id || p.slug === galleryProject.slug);
      if (updated) {
        setGalleryProject(updated);
      }
    }
  }, [projects]);

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
    setMaterials(Array.isArray(p.materials) ? p.materials.join(", ") : p.materials || "");
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
      status: editingProject ? editingProject.status || "published" : status,
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
        broadcastCmsProjects(resData.projects);
        notify(
          editingProject
            ? `Project "${payload.title}" updated and synced to Firestore!`
            : `Project "${payload.title}" created and published to site!`
        );
      } else {
        notifyError(resData.error || "Failed to persist project to Firestore.");
      }
    } catch {
      notifyError("Connection failed while saving project.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    const p = projectToDelete;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${p.id}&slug=${p.slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        setProjectToDelete(null);
        broadcastCmsProjects(data.projects);
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
        broadcastCmsProjects(updated);
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

  // --- Gallery Management Handlers ---
  const saveProjectGallery = async (targetProject: ProjectItem, newGallery: string[], newCover?: string) => {
    const updatedPayload: ProjectItem = {
      ...targetProject,
      gallery: newGallery,
      image: newCover || (newGallery.includes(targetProject.image) ? targetProject.image : newGallery[0] || targetProject.image),
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects);
        setGalleryProject(updatedPayload);
        broadcastCmsProjects(data.projects);
        notify(`Gallery for "${targetProject.title}" saved to Firestore.`);
      } else {
        notifyError(data.error || "Failed to update project gallery.");
      }
    } catch {
      notifyError("Network error updating gallery.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddImageUrl = async () => {
    if (!galleryProject || !newImageUrl.trim()) return;
    const url = newImageUrl.trim();
    const currentList = Array.isArray(galleryProject.gallery) ? [...galleryProject.gallery] : [galleryProject.image];
    if (currentList.includes(url)) {
      notifyError("This image is already in the gallery.");
      return;
    }
    const updatedGallery = [...currentList, url];
    setNewImageUrl("");
    await saveProjectGallery(galleryProject, updatedGallery);
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !galleryProject) return;

    setUploadingGallery(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const currentList = Array.isArray(galleryProject.gallery) ? [...galleryProject.gallery] : [galleryProject.image];
        const updated = [...currentList, ...uploadedUrls];
        await saveProjectGallery(galleryProject, updated);
        notify(`Uploaded and added ${uploadedUrls.length} photo(s) to gallery.`);
      }
    } catch {
      notifyError("Failed to upload some gallery photos.");
    } finally {
      setUploadingGallery(false);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = "";
      }
    }
  };

  const handleReplaceImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !galleryProject || replacingImageIndex === null) return;

    setUploadingGallery(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const currentList = [...(galleryProject.gallery || [galleryProject.image])];
        const oldUrl = currentList[replacingImageIndex];
        currentList[replacingImageIndex] = data.url;

        let newCover = galleryProject.image;
        if (galleryProject.image === oldUrl) {
          newCover = data.url;
        }

        await saveProjectGallery(galleryProject, currentList, newCover);
        notify("Image replaced successfully.");
      } else {
        notifyError(data.error || "Failed to upload replacement image.");
      }
    } catch {
      notifyError("Error replacing image.");
    } finally {
      setUploadingGallery(false);
      setReplacingImageIndex(null);
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.value = "";
      }
    }
  };

  const handleSetCoverImage = async (imgUrl: string) => {
    if (!galleryProject) return;
    await saveProjectGallery(galleryProject, galleryProject.gallery || [imgUrl], imgUrl);
    notify("Cover image updated and set for public website.");
  };

  const handleReorderGalleryImage = async (idx: number, direction: "left" | "right") => {
    if (!galleryProject) return;
    const currentList = [...(galleryProject.gallery || [galleryProject.image])];
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;

    const [moved] = currentList.splice(idx, 1);
    currentList.splice(targetIdx, 0, moved);

    await saveProjectGallery(galleryProject, currentList);
  };

  const confirmDeleteGalleryImage = async () => {
    if (!galleryProject || imageIndexToDelete === null) return;
    const currentList = [...(galleryProject.gallery || [galleryProject.image])];
    const removedUrl = currentList[imageIndexToDelete];
    currentList.splice(imageIndexToDelete, 1);

    if (currentList.length === 0) {
      currentList.push("/images/hero-luxury.jpg");
    }

    let newCover = galleryProject.image;
    if (galleryProject.image === removedUrl) {
      newCover = currentList[0];
    }

    setImageIndexToDelete(null);
    await saveProjectGallery(galleryProject, currentList, newCover);
    notify("Photo removed from gallery.");
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
            Portfolio Projects
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Manage the luxury portfolio showcased on /portfolio and individual project pages. All changes persist directly to Firestore.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={openAddModal}
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
            <Plus size={16} /> Add New Project
          </button>
          <Link
            href="/portfolio"
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
            <ExternalLink size={14} /> View /portfolio
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
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
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6B7280",
              }}
            />
            <input
              type="text"
              placeholder="Search projects by title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 38px",
                height: "40px",
                background: "#161821",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                color: "#F3F4F6",
                fontSize: "13px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: "160px",
              height: "40px",
              background: "#161821",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "6px",
              color: "#F3F4F6",
              fontSize: "13px",
              padding: "0 10px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Hospitality">Hospitality</option>
          </select>
        </div>

        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>
          Showing <strong style={{ color: "#F3F4F6" }}>{filtered.length}</strong> of {projects.length} projects
        </div>
      </div>

      {/* Projects Table - Dark Theme */}
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
                <th style={{ width: "120px", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Cover Photo</th>
                <th style={{ padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Project Title</th>
                <th style={{ padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Category</th>
                <th style={{ padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Location</th>
                <th style={{ textAlign: "right", padding: "14px 16px", fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "50px 20px" }}>
                    <Loader2 size={26} style={{ animation: "spin 1s linear infinite", margin: "0 auto 10px", color: "#C5A880" }} />
                    <p style={{ margin: 0, color: "#9CA3AF", fontSize: "13px" }}>Loading projects from Firestore...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "50px 20px", color: "#9CA3AF", fontSize: "14px" }}>
                    No projects found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const galleryCount = Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery.length : (p.image ? 1 : 0);
                  const coverSrc = p.image || (Array.isArray(p.gallery) && p.gallery[0]) || "/images/hero-luxury.jpg";

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        transition: "background 0.15s ease",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Reorder Buttons */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <button
                            onClick={() => handleReorder(idx, "up")}
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
                            onClick={() => handleReorder(idx, "down")}
                            disabled={idx === projects.length - 1 || saving}
                            style={{
                              background: "none",
                              border: "none",
                              color: idx === projects.length - 1 ? "#374151" : "#C5A880",
                              cursor: idx === projects.length - 1 ? "not-allowed" : "pointer",
                              padding: "2px",
                              lineHeight: 1,
                            }}
                            title="Move Down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Photo Thumbnail + Count Badge (Clicking opens Gallery) */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <div
                          onClick={() => setGalleryProject(p)}
                          style={{
                            cursor: "pointer",
                            position: "relative",
                            display: "inline-block",
                            borderRadius: "6px",
                            overflow: "hidden",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            transition: "transform 0.15s ease, border-color 0.15s ease",
                          }}
                          title="Click to manage project photo gallery"
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = "#C5A880";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <img
                            src={coverSrc}
                            alt={p.title}
                            style={{
                              width: "68px",
                              height: "46px",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "/images/hero-luxury.jpg";
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "rgba(0, 0, 0, 0.75)",
                              color: "#DFBE99",
                              fontSize: "10px",
                              fontWeight: 600,
                              textAlign: "center",
                              padding: "2px 0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "3px",
                            }}
                          >
                            <ImageIcon size={10} />
                            <span>{galleryCount}</span>
                          </div>
                        </div>
                      </td>

                      {/* Title (Clean readable white; URL slug is hidden from row) */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <div style={{ fontWeight: 600, color: "#F3F4F6", fontSize: "14px", marginBottom: "2px" }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>
                          {p.area ? `${p.area} • ` : ""}{p.year || ""}
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            background: "rgba(197, 168, 128, 0.15)",
                            color: "#DFBE99",
                            fontWeight: 600,
                            display: "inline-block",
                          }}
                        >
                          {p.category}
                        </span>
                      </td>

                      {/* Location */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", fontSize: "13px", color: "#D1D5DB" }}>
                        {p.location || "Delhi NCR"}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
                          <button
                            onClick={() => setGalleryProject(p)}
                            style={{
                              background: "rgba(197, 168, 128, 0.12)",
                              border: "1px solid rgba(197, 168, 128, 0.3)",
                              color: "#DFBE99",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 500,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                            title="Open Photo Gallery"
                          >
                            <ImageIcon size={13} />
                            <span>Photos</span>
                          </button>

                          <Link
                            href={`/portfolio/${p.slug}`}
                            target="_blank"
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              color: "#9CA3AF",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              display: "inline-flex",
                              alignItems: "center",
                              textDecoration: "none",
                              cursor: "pointer",
                            }}
                            title="View public page"
                          >
                            <ExternalLink size={14} />
                          </Link>

                          <button
                            onClick={() => openEditModal(p)}
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              color: "#D1D5DB",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                            title="Edit project details"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            onClick={() => setProjectToDelete(p)}
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(239, 68, 68, 0.3)",
                              color: "#EF4444",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                            title="Delete project"
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
      </div>

      {/* ============================================================== */}
      {/* PROJECT GALLERY MODAL                                          */}
      {/* ============================================================== */}
      {galleryProject && (
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
              maxWidth: "960px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Gallery Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-serif, serif)",
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "#F6F5F2",
                    margin: "0 0 4px 0",
                  }}
                >
                  Project Gallery: {galleryProject.title}
                </h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#9CA3AF" }}>
                  {(galleryProject.gallery || []).length} photos in gallery • Changes save directly to Firestore & public site
                </p>
              </div>
              <button
                onClick={() => setGalleryProject(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#9CA3AF",
                  cursor: "pointer",
                  padding: "6px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Gallery Body */}
            <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
              {/* Add New Photos Controls */}
              <div
                style={{
                  background: "#11131B",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {/* Upload from Computer (Multiple files) */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleMultipleFilesUpload}
                  />
                  <button
                    type="button"
                    disabled={uploadingGallery || saving}
                    onClick={() => galleryFileInputRef.current?.click()}
                    style={{
                      background: "#C5A880",
                      color: "#0E1015",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 16px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: uploadingGallery ? "wait" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {uploadingGallery ? (
                      <>
                        <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>Upload Photos</span>
                      </>
                    )}
                  </button>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                    Select single or multiple images (WebP / JPG / PNG)
                  </span>
                </div>

                {/* Add Image by URL */}
                <div style={{ display: "flex", gap: "8px", flex: 1, minWidth: "280px", maxWidth: "420px" }}>
                  <input
                    type="text"
                    placeholder="Or paste an image URL here..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: "#161821",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "6px",
                      color: "#F3F4F6",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={!newImageUrl.trim() || saving}
                    style={{
                      background: "rgba(197, 168, 128, 0.18)",
                      border: "1px solid #C5A880",
                      color: "#DFBE99",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: !newImageUrl.trim() ? "not-allowed" : "pointer",
                    }}
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Photos Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "16px",
                }}
              >
                {(galleryProject.gallery && galleryProject.gallery.length > 0
                  ? galleryProject.gallery
                  : [galleryProject.image]
                ).map((imgUrl, idx) => {
                  const isCover = galleryProject.image === imgUrl || (!galleryProject.image && idx === 0);

                  return (
                    <div
                      key={`${imgUrl}-${idx}`}
                      style={{
                        background: "#11131B",
                        border: isCover ? "2px solid #C5A880" : "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      {/* Image Thumbnail Container */}
                      <div
                        style={{
                          height: "140px",
                          position: "relative",
                          cursor: "pointer",
                          background: "#0A0B0E",
                        }}
                        onClick={() => setLightboxIndex(idx)}
                        title="Click to view full preview"
                      >
                        <img
                          src={imgUrl}
                          alt={`Gallery photo ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/hero-luxury.jpg";
                          }}
                        />

                        {/* Cover Badge */}
                        {isCover && (
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              left: "8px",
                              background: "#C5A880",
                              color: "#0E1015",
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                            }}
                          >
                            <Star size={10} fill="#0E1015" /> Cover
                          </div>
                        )}

                        {/* Lightbox Zoom Icon on Hover */}
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            background: "rgba(0,0,0,0.6)",
                            color: "#FFF",
                            borderRadius: "4px",
                            padding: "4px",
                            display: "flex",
                          }}
                        >
                          <Maximize2 size={12} />
                        </div>
                      </div>

                      {/* Card Controls */}
                      <div
                        style={{
                          padding: "10px 12px",
                          background: "#151720",
                          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        {/* Make Cover Button */}
                        {!isCover ? (
                          <button
                            type="button"
                            onClick={() => handleSetCoverImage(imgUrl)}
                            disabled={saving}
                            style={{
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              color: "#D1D5DB",
                              borderRadius: "4px",
                              padding: "5px 8px",
                              fontSize: "11px",
                              fontWeight: 500,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "4px",
                            }}
                          >
                            <Star size={11} /> Set as Cover
                          </button>
                        ) : (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#C5A880",
                              fontWeight: 600,
                              textAlign: "center",
                              padding: "4px 0",
                            }}
                          >
                            Active Cover Image
                          </div>
                        )}

                        {/* Action Bar (Reorder, Replace, Delete) */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          {/* Reorder Arrows */}
                          <div style={{ display: "flex", gap: "2px" }}>
                            <button
                              type="button"
                              onClick={() => handleReorderGalleryImage(idx, "left")}
                              disabled={idx === 0 || saving}
                              style={{
                                background: "none",
                                border: "none",
                                color: idx === 0 ? "#374151" : "#9CA3AF",
                                cursor: idx === 0 ? "not-allowed" : "pointer",
                                padding: "3px",
                              }}
                              title="Move Left"
                            >
                              <ArrowLeft size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReorderGalleryImage(idx, "right")}
                              disabled={idx === (galleryProject.gallery?.length || 1) - 1 || saving}
                              style={{
                                background: "none",
                                border: "none",
                                color: idx === (galleryProject.gallery?.length || 1) - 1 ? "#374151" : "#9CA3AF",
                                cursor: idx === (galleryProject.gallery?.length || 1) - 1 ? "not-allowed" : "pointer",
                                padding: "3px",
                              }}
                              title="Move Right"
                            >
                              <ArrowRight size={13} />
                            </button>
                          </div>

                          <div style={{ display: "flex", gap: "6px" }}>
                            {/* Replace Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setReplacingImageIndex(idx);
                                replaceFileInputRef.current?.click();
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#9CA3AF",
                                cursor: "pointer",
                                padding: "3px",
                              }}
                              title="Replace photo"
                            >
                              <RefreshCw size={13} />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setImageIndexToDelete(idx)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#EF4444",
                                cursor: "pointer",
                                padding: "3px",
                              }}
                              title="Remove photo from gallery"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hidden file input for Replace action */}
              <input
                ref={replaceFileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleReplaceImageFile}
              />
            </div>

            {/* Gallery Footer */}
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                background: "#11131B",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setGalleryProject(null)}
                style={{
                  background: "#C5A880",
                  color: "#0E1015",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* LIGHTBOX PREVIEW MODAL                                         */}
      {/* ============================================================== */}
      {lightboxIndex !== null && galleryProject && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.92)",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "24px",
              right: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#FFF",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: "14px", color: "#DFBE99", fontWeight: 500 }}>
              {galleryProject.title} • Photo {lightboxIndex + 1} of{" "}
              {(galleryProject.gallery || [galleryProject.image]).length}
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#FFF",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Image & Prev/Next */}
          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "80vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                style={{
                  position: "absolute",
                  left: "-50px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#FFF",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img
              src={(galleryProject.gallery || [galleryProject.image])[lightboxIndex]}
              alt="Full Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "6px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
              }}
            />

            {/* Next Button */}
            {lightboxIndex < (galleryProject.gallery || [galleryProject.image]).length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                style={{
                  position: "absolute",
                  right: "-50px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#FFF",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRM PROJECT DELETION DIALOG                                */}
      {/* ============================================================== */}
      {projectToDelete && (
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
                Delete Portfolio Project?
              </h3>
            </div>

            <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 20px 0" }}>
              Are you sure you want to permanently delete{" "}
              <strong style={{ color: "#F3F4F6" }}>"{projectToDelete.title}"</strong>? This will remove it from the
              public website and sitemap. Its URL{" "}
              <code style={{ color: "#EF4444" }}>/portfolio/{projectToDelete.slug}</code> will return 404.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
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
                onClick={confirmDeleteProject}
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
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRM IMAGE DELETION DIALOG                                  */}
      {/* ============================================================== */}
      {imageIndexToDelete !== null && galleryProject && (
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
              maxWidth: "420px",
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
                Remove Photo from Gallery?
              </h3>
            </div>

            <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5, margin: "0 0 20px 0" }}>
              Are you sure you want to remove photo #{imageIndexToDelete + 1} from{" "}
              <strong style={{ color: "#F3F4F6" }}>"{galleryProject.title}"</strong>? This will update the project
              gallery immediately.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setImageIndexToDelete(null)}
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
                onClick={confirmDeleteGalleryImage}
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
                Remove Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD / EDIT PROJECT MODAL (Dark Theme)                         */}
      {/* ============================================================== */}
      {(showAddModal || editingProject) && (
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
              maxWidth: "820px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                paddingBottom: "16px",
              }}
            >
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
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Luxury Penthouse at DLF Camellias"
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
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. luxury-penthouse-camellias"
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Gurugram, Delhi NCR"
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
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
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
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Area (sq.ft)
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 3,800 sq.ft"
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
                    Year Completed
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025"
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
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 4 Months"
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
                  Client / Residence Type
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Private Residence / Corporate Executive"
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

              {/* Cover Image Upload */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Hero Cover Image (Stored in Firebase Storage / WebP)
                </label>
                <ImageUploadField
                  value={image}
                  onChange={setImage}
                  label="Upload or Select Project Hero Image"
                  dark={true}
                />
              </div>

              {/* Gallery Images Textarea */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Gallery Images (One URL per line)
                </label>
                <textarea
                  rows={3}
                  value={galleryText}
                  onChange={(e) => setGalleryText(e.target.value)}
                  placeholder="/images/photo-1.jpg&#10;/images/photo-2.jpg"
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
                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                  Tip: You can also manage all gallery images visually via the "Photos" gallery modal on the table.
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                  Project Overview Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the architectural and interior vision..."
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Design Challenge
                  </label>
                  <textarea
                    rows={2}
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder="Specific design or spatial constraints..."
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
                    Design Solution
                  </label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="How the studio resolved it..."
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#D1D5DB", marginBottom: "6px" }}>
                    Materials Used
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="Italian Marble, Custom Brass, Fluted Oak"
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
                    Client Quote / Testimonial
                  </label>
                  <input
                    type="text"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Short feedback quote from client..."
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProject(null);
                  }}
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
