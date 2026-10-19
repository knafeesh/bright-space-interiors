"use client";
import { useState, useEffect } from "react";
import {
  Images,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  AlertCircle,
  Loader2,
  Edit2,
  Plus,
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { MediaAssetItem, PhilosophySlide } from "@/lib/site-types";

export default function MediaLibraryPage() {
  const [activeTab, setActiveTab] = useState<"library" | "carousel">("library");
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<PhilosophySlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Feedback states
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [blockedUsage, setBlockedUsage] = useState<{ url: string; list: string[] } | null>(null);
  const [saving, setSaving] = useState(false);

  // Upload / Edit Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadedAlt, setUploadedAlt] = useState("");

  const [editingAsset, setEditingAsset] = useState<MediaAssetItem | null>(null);
  const [editAlt, setEditAlt] = useState("");

  // Carousel Modal
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [carouselImage, setCarouselImage] = useState("/images/hero-luxury.jpg");
  const [carouselAlt, setCarouselAlt] = useState("");
  const [carouselCaption, setCarouselCaption] = useState("");
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [mediaRes, carouselRes] = await Promise.all([
        fetch("/api/admin/media", { cache: "no-store" }),
        fetch("/api/admin/philosophy", { cache: "no-store" }),
      ]);
      const mediaData = await mediaRes.json();
      const carouselData = await carouselRes.json();

      if (mediaData.success) setMediaList(mediaData.media || []);
      if (carouselData.success) setCarouselSlides(carouselData.slides || []);
    } catch {
      notifyError("Failed to load media assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopy = (url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const handleDeleteMedia = async (asset: MediaAssetItem) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(asset.id)}&url=${encodeURIComponent(asset.url)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMediaList(data.media);
        notify(`Image deleted and removed from storage.`);
      } else if (data.usedIn && Array.isArray(data.usedIn) && data.usedIn.length > 0) {
        // Blocked deletion due to active usage
        setBlockedUsage({
          url: asset.url,
          list: data.usedIn,
        });
      } else {
        notifyError(data.error || "Failed to delete image.");
      }
    } catch {
      notifyError("Network error while deleting image.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeduplicate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deduplicate" }),
      });
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media);
        notify("Media library deduplicated successfully.");
      }
    } catch {
      notifyError("Failed to deduplicate.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAssetEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;

    setSaving(true);
    try {
      const updated = { ...editingAsset, alt: editAlt.trim() };
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setMediaList(data.media);
        setEditingAsset(null);
        notify("Image details updated.");
      }
    } catch {
      notifyError("Failed to update image details.");
    } finally {
      setSaving(false);
    }
  };

  // --- Philosophy Carousel Handlers ---
  const handleSaveCarouselSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carouselImage.trim()) {
      notifyError("Image is required for carousel slide.");
      return;
    }

    setSaving(true);
    try {
      const payload: PhilosophySlide = {
        id: editingSlideId || `slide-${Date.now()}`,
        src: carouselImage.trim(),
        alt: carouselAlt.trim() || "Bright Space Interior Design Philosophy",
        caption: carouselCaption.trim(),
        order: carouselSlides.length + 1,
      };

      const res = await fetch("/api/admin/philosophy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slide: payload }),
      });
      const data = await res.json();
      if (data.success) {
        setCarouselSlides(data.slides);
        setShowCarouselModal(false);
        setEditingSlideId(null);
        notify("Carousel slide saved and live on homepage!");
      } else {
        notifyError(data.error || "Failed to save slide.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to remove this slide from the homepage carousel?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/philosophy?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCarouselSlides(data.slides);
        notify("Carousel slide removed.");
      }
    } catch {
      notifyError("Failed to delete slide.");
    } finally {
      setSaving(false);
    }
  };

  const handleReorderSlide = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= carouselSlides.length) return;

    const list = [...carouselSlides];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((sl, index) => ({
      ...sl,
      order: index + 1,
    }));

    setCarouselSlides(reordered);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/philosophy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: reordered }),
      });
      const data = await res.json();
      if (data.success) {
        notify("Carousel reordered and synced to homepage.");
      }
    } catch {
      notifyError("Failed to reorder carousel.");
      loadData();
    } finally {
      setSaving(false);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const nameMatch = (m.name || "").toLowerCase().includes(search.toLowerCase());
    const altMatch = (m.alt || "").toLowerCase().includes(search.toLowerCase());
    return nameMatch || altMatch;
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

      {/* Blocked Deletion Modal */}
      {blockedUsage && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "520px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", color: "#EF4444" }}>
              <ShieldAlert size={24} />
              <h2 style={{ fontSize: "18px", margin: 0, fontWeight: 600 }}>Cannot Delete Image In Use</h2>
            </div>

            <p style={{ fontSize: "13px", color: "#D1D5DB", lineHeight: 1.5, marginBottom: "16px" }}>
              This image cannot be deleted because it is currently actively displayed on the website in the following locations:
            </p>

            <div
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px",
                maxHeight: "180px",
                overflowY: "auto",
              }}
            >
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#FCA5A5" }}>
                {blockedUsage.list.map((loc, i) => (
                  <li key={i} style={{ marginBottom: "6px" }}>
                    {loc}
                  </li>
                ))}
              </ul>
            </div>

            <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>
              To delete this image, first replace or remove it from the projects, services, or categories listed above.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setBlockedUsage(null)}
                className="admin-btn admin-btn--gold"
                style={{ padding: "8px 18px" }}
              >
                Understood
              </button>
            </div>
          </div>
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
            Gallery & Media Management
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Upload images (converted to WebP & saved in Firebase Storage) and manage the homepage Design Philosophy carousel.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {activeTab === "library" ? (
            <>
              <button
                onClick={handleDeduplicate}
                className="admin-btn admin-btn--outline"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                disabled={saving}
              >
                <Sparkles size={14} /> Remove Duplicates
              </button>
              <button
                onClick={() => {
                  setUploadedUrl("");
                  setShowUploadModal(true);
                }}
                className="admin-btn admin-btn--gold"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Upload size={16} /> Upload New Image
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setEditingSlideId(null);
                setCarouselImage("/images/hero-luxury.jpg");
                setCarouselAlt("");
                setCarouselCaption("");
                setShowCarouselModal(true);
              }}
              className="admin-btn admin-btn--gold"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Plus size={16} /> Add Carousel Slide
            </button>
          )}
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
          onClick={() => setActiveTab("library")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "library" ? "2px solid #C5A880" : "2px solid transparent",
            color: activeTab === "library" ? "#DFBE99" : "#9CA3AF",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Images size={16} />
          <span>Image Library ({mediaList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("carousel")}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === "carousel" ? "2px solid #C5A880" : "2px solid transparent",
            color: activeTab === "carousel" ? "#DFBE99" : "#9CA3AF",
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
          <span>Design Philosophy Carousel ({carouselSlides.length} Slides)</span>
        </button>
      </div>

      {/* Tab 1: Image Library */}
      {activeTab === "library" && (
        <div>
          {/* Search Bar */}
          <div style={{ position: "relative", maxWidth: "440px", marginBottom: "20px" }}>
            <Search
              size={16}
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
            />
            <input
              type="text"
              placeholder="Search images by name or alt text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ width: "100%", paddingLeft: "36px", height: "40px" }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF" }}>
              <Loader2 size={28} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
              <p>Loading media assets from Cloud Storage & Firestore...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#9CA3AF" }}>
              No images found. Click "Upload New Image" to add images.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {filteredMedia.map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    background: "#161920",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ height: "140px", position: "relative", background: "#0D0F13" }}>
                    <img
                      src={asset.url}
                      alt={asset.alt || asset.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {asset.type && (
                      <span
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "rgba(0,0,0,0.7)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          color: "#DFBE99",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {asset.type.replace("image/", "")}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: "12px" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#F3F4F6",
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={asset.name}
                    >
                      {asset.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#9CA3AF",
                        marginBottom: "10px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      alt: {asset.alt || "(none)"}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button
                        onClick={() => handleCopy(asset.url)}
                        style={{
                          background: "none",
                          border: "none",
                          color: copiedUrl === asset.url ? "#10B981" : "#C5A880",
                          cursor: "pointer",
                          fontSize: "11px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: 0,
                        }}
                      >
                        {copiedUrl === asset.url ? <Check size={12} /> : <Copy size={12} />}
                        <span>{copiedUrl === asset.url ? "Copied" : "Copy URL"}</span>
                      </button>

                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          onClick={() => {
                            setEditingAsset(asset);
                            setEditAlt(asset.alt || "");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#9CA3AF",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                          title="Edit Alt Text"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(asset)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                          title="Delete Image"
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
        </div>
      )}

      {/* Tab 2: Design Philosophy Carousel */}
      {activeTab === "carousel" && (
        <div>
          <div style={{ marginBottom: "16px", color: "#9CA3AF", fontSize: "13px" }}>
            These images rotate in the dynamic Design Philosophy section on the homepage. Reorder them using the arrows or add new slides.
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>Order</th>
                  <th style={{ width: "100px" }}>Slide Photo</th>
                  <th>Image Alt Text</th>
                  <th>Caption</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {carouselSlides.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                      No carousel slides configured.
                    </td>
                  </tr>
                ) : (
                  carouselSlides.map((slide, idx) => (
                    <tr key={slide.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <button
                            onClick={() => handleReorderSlide(idx, "up")}
                            disabled={idx === 0 || saving}
                            style={{
                              background: "none",
                              border: "none",
                              color: idx === 0 ? "#4B5563" : "#C5A880",
                              cursor: idx === 0 ? "not-allowed" : "pointer",
                              padding: "2px",
                            }}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleReorderSlide(idx, "down")}
                            disabled={idx === carouselSlides.length - 1 || saving}
                            style={{
                              background: "none",
                              border: "none",
                              color: idx === carouselSlides.length - 1 ? "#4B5563" : "#C5A880",
                              cursor: idx === carouselSlides.length - 1 ? "not-allowed" : "pointer",
                              padding: "2px",
                            }}
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          style={{
                            width: "80px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        />
                      </td>
                      <td style={{ fontSize: "13px", color: "#F3F4F6", fontWeight: 500 }}>
                        {slide.alt}
                      </td>
                      <td style={{ fontSize: "12px", color: "#9CA3AF" }}>
                        {slide.caption || "—"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="admin-btn admin-btn--outline"
                          style={{ padding: "6px 8px", color: "#EF4444" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Upload New Image */}
      {showUploadModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "520px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                Upload Image to Storage
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Choose Image File</label>
                <ImageUploadField
                  value={uploadedUrl}
                  onChange={(url) => {
                    setUploadedUrl(url);
                    loadData();
                  }}
                  label="Select Image to Upload"
                />
              </div>

              {uploadedUrl && (
                <div style={{ padding: "12px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px" }}>
                  <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 600, marginBottom: "4px" }}>
                    ✓ Uploaded & Registered
                  </div>
                  <div style={{ fontSize: "11px", color: "#D1D5DB", wordBreak: "break-all" }}>
                    {uploadedUrl}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="admin-btn admin-btn--gold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Alt Text */}
      {editingAsset && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "18px", margin: 0, color: "#F3F4F6" }}>
                Edit Image Alt Text
              </h2>
              <button
                onClick={() => setEditingAsset(null)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAssetEdit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Image Alt Text (SEO Accessibility)</label>
                <input
                  type="text"
                  value={editAlt}
                  onChange={(e) => setEditAlt(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Modern living room with fluted oak panelling"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="admin-btn admin-btn--outline"
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn--gold">
                  Save Alt Text
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Carousel Slide */}
      {showCarouselModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "540px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                Add Philosophy Carousel Slide
              </h2>
              <button
                onClick={() => setShowCarouselModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCarouselSlide} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Slide Image</label>
                <ImageUploadField
                  value={carouselImage}
                  onChange={setCarouselImage}
                  label="Upload or Select Slide Image"
                />
              </div>

              <div>
                <label className="admin-label">Alt Text</label>
                <input
                  type="text"
                  value={carouselAlt}
                  onChange={(e) => setCarouselAlt(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Bespoke luxury living room architecture"
                />
              </div>

              <div>
                <label className="admin-label">Optional Caption</label>
                <input
                  type="text"
                  value={carouselCaption}
                  onChange={(e) => setCarouselCaption(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Sculptural elegance meets functional warmth"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowCarouselModal(false)}
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
                  <span>Save Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
