"use client";
import { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Folder,
  Eye,
  ExternalLink,
  FileText,
  Video,
} from "lucide-react";

interface MediaAsset {
  id: string;
  name: string;
  url: string;
  folder: "Projects" | "Services" | "Team" | "Hero" | "Renders";
  size: string;
  dimensions: string;
  type: "WebP" | "JPEG" | "PNG" | "MP4";
  altText: string;
  dateAdded: string;
}

const INITIAL_MEDIA: MediaAsset[] = [
  { id: "m-1", name: "project-serene-villa.jpg", url: "/images/project-serene-villa.jpg", folder: "Projects", size: "340 KB", dimensions: "1920 × 1080", type: "JPEG", altText: "Park View City Gurugram Luxury Residence Living Room", dateAdded: "2024-09-10" },
  { id: "m-2", name: "project-salon.jpg", url: "/images/project-salon.jpg", folder: "Projects", size: "410 KB", dimensions: "1920 × 1280", type: "JPEG", altText: "Look Salon Flagship Turnkey Build Old Gurugram", dateAdded: "2024-08-25" },
  { id: "m-3", name: "project-city-penthouse.jpg", url: "/images/project-city-penthouse.jpg", folder: "Projects", size: "380 KB", dimensions: "1920 × 1080", type: "JPEG", altText: "Dwarka Sector 23 Delhi Modern Residence", dateAdded: "2024-09-18" },
  { id: "m-4", name: "project-atelier-office.jpg", url: "/images/project-atelier-office.jpg", folder: "Projects", size: "450 KB", dimensions: "1920 × 1200", type: "JPEG", altText: "V-Deliver Commercial Kitchen Sushant Lok", dateAdded: "2024-07-12" },
  { id: "m-5", name: "service-residential.jpg", url: "/images/service-residential.jpg", folder: "Services", size: "290 KB", dimensions: "1200 × 800", type: "JPEG", altText: "Residential Interior Design Service Header", dateAdded: "2024-06-01" },
  { id: "m-6", name: "service-commercial.jpg", url: "/images/service-commercial.jpg", folder: "Services", size: "310 KB", dimensions: "1200 × 800", type: "JPEG", altText: "Commercial & Office Interior Turnkey Service", dateAdded: "2024-06-01" },
  { id: "m-7", name: "project-turnkey.jpg", url: "/images/project-turnkey.jpg", folder: "Projects", size: "360 KB", dimensions: "1600 × 1000", type: "JPEG", altText: "Turnkey Modular Kitchen Execution Saket South Delhi", dateAdded: "2024-08-14" },
  { id: "m-8", name: "about-story.jpg", url: "/images/about-story.jpg", folder: "Hero", size: "480 KB", dimensions: "1920 × 1080", type: "JPEG", altText: "The Bright Space Interiors Design Studio", dateAdded: "2024-05-20" },
  { id: "m-9", name: "hero-luxury-interior.jpg", url: "/images/hero-luxury-interior.jpg", folder: "Hero", size: "520 KB", dimensions: "2560 × 1440", type: "JPEG", altText: "Luxury Living Room Showcase Hero Background", dateAdded: "2024-04-10" },
];

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaAsset[]>(INITIAL_MEDIA);
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [activeAsset, setActiveAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = media.filter((m) => {
    const matchesFolder = selectedFolder === "All" || m.folder === selectedFolder;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleCopyLink = (url: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAsset: MediaAsset = {
        id: `m-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        folder: "Projects",
        size: `${(file.size / 1024).toFixed(0)} KB`,
        dimensions: "1920 × 1080",
        type: file.name.endsWith(".png") ? "PNG" : file.name.endsWith(".webp") ? "WebP" : "JPEG",
        altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        dateAdded: new Date().toISOString().split("T")[0],
      };
      setMedia([newAsset, ...media]);
      setActiveAsset(newAsset);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this media asset?")) {
      setMedia(media.filter((m) => m.id !== id));
      if (activeAsset?.id === id) setActiveAsset(null);
    }
  };

  return (
    <div style={{ padding: "0", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
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

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 16px",
              background: "linear-gradient(135deg, #B8975A, #8F723E)",
              color: "#FFF",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <Upload size={14} /> Upload Media
            <input type="file" accept="image/*,video/*" onChange={handleUploadSimulate} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      {/* Main Grid & Inspector */}
      <div style={{ display: "grid", gridTemplateColumns: activeAsset ? "1fr 340px" : "1fr", gap: "20px" }}>
        {/* Media Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {filtered.map((asset) => {
            const isSelected = activeAsset?.id === asset.id;
            return (
              <div
                key={asset.id}
                onClick={() => setActiveAsset(asset)}
                style={{
                  background: "#FFF",
                  borderRadius: "12px",
                  border: isSelected ? "2px solid #B8975A" : "1px solid #E5E7EB",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 4px 16px rgba(184,151,90,0.2)" : "0 2px 6px rgba(0,0,0,0.03)",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ height: "140px", background: "#1C1C1C", position: "relative", overflow: "hidden" }}>
                  <img
                    src={asset.url}
                    alt={asset.altText}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      background: "rgba(0,0,0,0.65)",
                      color: "#FFF",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {asset.type}
                  </span>
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {asset.name}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>
                    <span>{asset.folder}</span>
                    <span>{asset.size}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Inspector Drawer */}
        {activeAsset && (
          <div style={{ background: "#FFF", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "20px", height: "fit-content", position: "sticky", top: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#B8975A" }}>
                Asset Details
              </span>
              <button
                onClick={() => setActiveAsset(null)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: "18px" }}
              >
                ×
              </button>
            </div>

            <div style={{ borderRadius: "8px", overflow: "hidden", background: "#1C1C1C", maxHeight: "180px", marginBottom: "16px" }}>
              <img src={activeAsset.url} alt={activeAsset.altText} style={{ width: "100%", height: "100%", objectFit: "contain", maxHeight: "180px" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
              <div>
                <label style={{ display: "block", color: "#6B7280", fontWeight: 600, marginBottom: "2px" }}>Filename</label>
                <div style={{ fontWeight: 700, color: "#111827", wordBreak: "break-all" }}>{activeAsset.name}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div>
                  <span style={{ color: "#6B7280" }}>Dimensions:</span>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{activeAsset.dimensions}</div>
                </div>
                <div>
                  <span style={{ color: "#6B7280" }}>File Size:</span>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{activeAsset.size}</div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#6B7280", fontWeight: 600, marginBottom: "4px" }}>Alt Text (SEO)</label>
                <input
                  type="text"
                  value={activeAsset.altText}
                  onChange={(e) => {
                    const updated = { ...activeAsset, altText: e.target.value };
                    setActiveAsset(updated);
                    setMedia(media.map((m) => (m.id === activeAsset.id ? updated : m)));
                  }}
                  style={{ width: "100%", padding: "7px 10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "12px", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#6B7280", fontWeight: 600, marginBottom: "4px" }}>Asset URL</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    readOnly
                    value={activeAsset.url}
                    style={{ flex: 1, padding: "7px 10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "11px", background: "#F9FAFB" }}
                  />
                  <button
                    onClick={() => handleCopyLink(activeAsset.url, activeAsset.id)}
                    style={{ padding: "7px 10px", background: "#111827", color: "#FFF", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    {copiedId === activeAsset.id ? <Check size={14} style={{ color: "#10B981" }} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <a
                  href={activeAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, padding: "8px", textAlign: "center", background: "#F3F4F6", borderRadius: "6px", color: "#374151", fontWeight: 600, textDecoration: "none", fontSize: "12px" }}
                >
                  Open Original
                </a>
                <button
                  onClick={() => handleDelete(activeAsset.id)}
                  style={{ padding: "8px 12px", background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
