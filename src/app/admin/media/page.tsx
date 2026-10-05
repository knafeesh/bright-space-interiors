"use client";
import { useState } from "react";
import {
  Image as ImageIcon,
  Search,
  Trash2,
  Copy,
  Check,
  Folder,
  Eye,
  FileText,
  Edit2,
  Plus,
  X,
} from "lucide-react";
import {
  useCmsMedia,
  cmsUpdateMedia,
  cmsDeleteMedia,
  cmsAddMedia,
  MediaAsset,
} from "@/lib/cms";

export default function MediaLibraryPage() {
  const media = useCmsMedia();
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  // Edit Modal State
  const [editingAsset, setEditingAsset] = useState<MediaAsset | null>(null);
  const [editName, setEditName] = useState("");
  const [editAlt, setEditAlt] = useState("");
  const [editFolder, setEditFolder] = useState<MediaAsset["folder"]>("Projects");
  const [editUrl, setEditUrl] = useState("");

  // Add Media Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addAlt, setAddAlt] = useState("");
  const [addFolder, setAddFolder] = useState<MediaAsset["folder"]>("Projects");

  const filtered = media.filter((m) => {
    const matchesFolder = selectedFolder === "All" || m.folder === selectedFolder;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleCopyLink = (url: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleOpenEdit = (asset: MediaAsset) => {
    setEditingAsset(asset);
    setEditName(asset.name || "");
    setEditAlt(asset.altText || "");
    setEditFolder(asset.folder || "Projects");
    setEditUrl(asset.url || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    const updated: MediaAsset = {
      ...editingAsset,
      name: editName.trim() || editingAsset.name,
      altText: editAlt.trim() || editingAsset.altText,
      folder: editFolder,
      url: editUrl.trim() || editingAsset.url,
    };

    cmsUpdateMedia(updated);
    if (activeAsset?.id === updated.id) setActiveAsset(updated);
    setEditingAsset(null);
    notify(`Saved media "${updated.name}" and updated live on website!`);
  };

  const handleDelete = (asset: MediaAsset) => {
    if (
      confirm(
        `Are you sure you want to delete "${asset.name}"? If this image is used in any portfolio projects or service pages, it will be automatically removed from their galleries on the website.`
      )
    ) {
      cmsDeleteMedia(asset.id);
      if (activeAsset?.id === asset.id) setActiveAsset(null);
      notify(`Deleted "${asset.name}" and updated all pages on the website.`);
    }
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUrl.trim()) return;

    const newAsset: MediaAsset = {
      id: `m-${Date.now()}`,
      name: addName.trim() || addUrl.split("/").pop() || "image.jpg",
      url: addUrl.trim(),
      folder: addFolder,
      size: "180 KB",
      dimensions: "1920 × 1080",
      type: addUrl.endsWith(".png") ? "PNG" : addUrl.endsWith(".webp") ? "WebP" : "JPEG",
      altText: addAlt.trim() || "The Bright Space Interiors Real Work",
      dateAdded: new Date().toISOString().split("T")[0],
    };

    cmsAddMedia(newAsset);
    setShowAddModal(false);
    setAddName("");
    setAddUrl("");
    setAddAlt("");
    notify(`Added "${newAsset.name}" to media library and site!`);
  };

  return (
    <div style={{ padding: "0", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* Toast Feedback */}
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
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
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

      {/* Top Banner & Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Assets", value: media.length, icon: ImageIcon, color: "#6366F1" },
          { label: "Project Photos", value: media.filter((m) => m.folder === "Projects").length, icon: Folder, color: "#10B981" },
          { label: "Services Media", value: media.filter((m) => m.folder === "Services").length, icon: FileText, color: "#F59E0B" },
          { label: "Hero & Brand", value: media.filter((m) => m.folder === "Hero").length, icon: Eye, color: "#8B5CF6" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6", padding: "16px 20px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {/* Folders */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["All", "Projects", "Services", "Hero", "Team", "Renders"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: selectedFolder === f ? "#B8975A" : "#E5E7EB",
                background: selectedFolder === f ? "rgba(184,151,90,0.12)" : "#FFF",
                color: selectedFolder === f ? "#B8975A" : "#4B5563",
                fontWeight: selectedFolder === f ? 700 : 500,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search & Upload */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ position: "relative", width: "240px" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder="Search filename or alt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "8px 10px 8px 32px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="admin-btn admin-btn--primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", fontSize: "12px" }}
          >
            <Plus size={14} /> Add Media
          </button>
        </div>
      </div>

      {/* Main Grid + Inspector Sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: activeAsset ? "1fr 340px" : "1fr", gap: "20px", alignItems: "start" }}>
        {/* Media Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setActiveAsset(asset)}
              style={{
                background: "#FFF",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: activeAsset?.id === asset.id ? "#B8975A" : "#F3F4F6",
                boxShadow: activeAsset?.id === asset.id ? "0 0 0 2px #B8975A" : "0 2px 6px rgba(0,0,0,0.03)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ position: "relative", height: "135px", background: "#1F2937", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={asset.url}
                  alt={asset.altText}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    background: "rgba(0,0,0,0.6)",
                    color: "#FFF",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                  }}
                >
                  {asset.type}
                </span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={asset.name}>
                  {asset.name}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", fontSize: "11px", color: "#9CA3AF" }}>
                  <span>{asset.folder}</span>
                  <span>{asset.size}</span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6", color: "#9CA3AF" }}>
              <ImageIcon size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: "14px" }}>No media assets found in this folder</p>
            </div>
          )}
        </div>

        {/* Selected Asset Details Panel */}
        {activeAsset && (
          <div style={{ background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "sticky", top: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#111827", margin: 0 }}>Asset Details</h3>
              <button
                onClick={() => setActiveAsset(null)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: "16px", padding: 0 }}
              >
                ✕
              </button>
            </div>

            <div style={{ width: "100%", height: "180px", borderRadius: "8px", overflow: "hidden", background: "#1F2937", marginBottom: "16px" }}>
              <img
                src={activeAsset.url}
                alt={activeAsset.altText}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "4px", wordBreak: "break-all" }}>
              {activeAsset.name}
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "16px" }}>
              {activeAsset.altText}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px", borderTop: "1px solid #F3F4F6", paddingTop: "12px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Folder:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{activeAsset.folder}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>File Size:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{activeAsset.size}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Dimensions:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{activeAsset.dimensions}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#9CA3AF" }}>Added:</span>
                <span style={{ fontWeight: 600, color: "#111827" }}>{activeAsset.dateAdded}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => handleCopyLink(activeAsset.url, activeAsset.id)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  background: "#FFF",
                  color: "#374151",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                {copiedId === activeAsset.id ? <Check size={14} style={{ color: "#10B981" }} /> : <Copy size={14} />}
                {copiedId === activeAsset.id ? "URL Copied!" : "Copy Image Link"}
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => handleOpenEdit(activeAsset)}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    background: "#FFF",
                    color: "#374151",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <Edit2 size={13} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(activeAsset)}
                  style={{
                    flex: 1,
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#FEE2E2",
                    color: "#DC2626",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EDIT ASSET MODAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {editingAsset && (
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
          onClick={() => setEditingAsset(null)}
        >
          <div
            className="admin-table-wrap"
            style={{ width: "100%", maxWidth: "500px", padding: "28px", margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 600, color: "var(--charcoal)", margin: 0 }}>
                Edit Media Asset
              </h2>
              <button onClick={() => setEditingAsset(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Filename *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Folder Category
                </label>
                <select
                  value={editFolder}
                  onChange={(e) => setEditFolder(e.target.value as MediaAsset["folder"])}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                >
                  <option value="Projects">Projects</option>
                  <option value="Services">Services</option>
                  <option value="Hero">Hero & Brand</option>
                  <option value="Team">Team</option>
                  <option value="Renders">Renders</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Image URL *
                </label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <img
                    src={editUrl || "/images/hero-luxury.jpg"}
                    alt="Preview"
                    style={{ width: "54px", height: "40px", objectFit: "cover", borderRadius: "6px", border: "1px solid #E0E0E0" }}
                  />
                  <input
                    type="text"
                    required
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    style={{ flex: 1, padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Alt Description / SEO Title
                </label>
                <input
                  type="text"
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px", borderTop: "1px solid #F0F0F0", paddingTop: "14px" }}>
                <button type="button" onClick={() => setEditingAsset(null)} className="admin-btn admin-btn--outline">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  Save Changes & Update Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ADD ASSET MODAL */}
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
            style={{ width: "100%", maxWidth: "500px", padding: "28px", margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "22px", fontWeight: 600, color: "var(--charcoal)", margin: 0 }}>
                Add Media Asset
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMedia} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Image URL / Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/images/real-bedroom-headboard.jpg"
                  value={addUrl}
                  onChange={(e) => setAddUrl(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Bedroom Headboard"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Folder Category
                </label>
                <select
                  value={addFolder}
                  onChange={(e) => setAddFolder(e.target.value as MediaAsset["folder"])}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                >
                  <option value="Projects">Projects</option>
                  <option value="Services">Services</option>
                  <option value="Hero">Hero & Brand</option>
                  <option value="Team">Team</option>
                  <option value="Renders">Renders</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "4px" }}>
                  Alt Description / SEO Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Bedroom Wood Panelling and Indirect LED"
                  value={addAlt}
                  onChange={(e) => setAddAlt(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px", borderTop: "1px solid #F0F0F0", paddingTop: "14px" }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn admin-btn--outline">
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
