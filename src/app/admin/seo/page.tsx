"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Edit2,
  ExternalLink,
  Check,
  AlertTriangle,
  AlertCircle,
  Loader2,
  X,
  Search,
  CheckCircle2,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { PageSeoItem } from "@/lib/site-types";

export default function PageSeoManagerPage() {
  const [seoList, setSeoList] = useState<PageSeoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit Modal
  const [editingItem, setEditingItem] = useState<PageSeoItem | null>(null);
  const [editPath, setEditPath] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editOgImage, setEditOgImage] = useState("");
  const [editCanonical, setEditCanonical] = useState("");

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadSeo = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/seo", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.list)) {
        setSeoList(data.list);
      }
    } catch {
      notifyError("Failed to load Page SEO configurations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const openEdit = (item: PageSeoItem) => {
    setEditingItem(item);
    setEditPath(item.path);
    setEditTitle(item.title);
    setEditDesc(item.description || "");
    setEditOgImage(item.ogImage || "/images/hero-luxury.jpg");
    setEditCanonical(item.canonical || `https://www.brightspaceinterior.in${item.path === "/" ? "" : item.path}`);
    setWarningMsg(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      notifyError("Page title is required.");
      return;
    }

    const payload: PageSeoItem = {
      path: editPath,
      title: editTitle.trim(),
      description: editDesc.trim(),
      ogImage: editOgImage.trim(),
      canonical: editCanonical.trim() || `https://www.brightspaceinterior.in${editPath === "/" ? "" : editPath}`,
    };

    setSaving(true);
    setWarningMsg(null);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seoItem: payload }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSeoList(data.list);
        if (data.warning) {
          setWarningMsg(data.warning);
        } else {
          setEditingItem(null);
          notify(`Page SEO for "${editPath}" updated and synced live!`);
        }
      } else {
        notifyError(data.error || "Failed to save SEO.");
      }
    } catch {
      notifyError("Network error saving SEO.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = seoList.filter((s) => {
    return s.path.toLowerCase().includes(search.toLowerCase()) || s.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
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
            Page SEO & Metadata Management
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Configure per-page title tags, meta descriptions, and OG images with automatic self-referencing canonical URLs.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View Live sitemap.xml
          </Link>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: "440px", marginBottom: "20px" }}>
        <Search
          size={16}
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}
        />
        <input
          type="text"
          placeholder="Filter by page path or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input"
          style={{ width: "100%", paddingLeft: "36px", height: "40px" }}
        />
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "120px" }}>Route Path</th>
              <th>Meta Title</th>
              <th>Description Preview</th>
              <th>Canonical URL</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                  <p style={{ margin: 0, color: "#9CA3AF" }}>Loading SEO configurations...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                  No page found matching search.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.path}>
                  <td>
                    <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#DFBE99", fontWeight: 600 }}>
                      {item.path}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#F3F4F6", maxWidth: "260px" }}>
                      {item.title}
                    </div>
                  </td>
                  <td style={{ fontSize: "12px", color: "#9CA3AF", maxWidth: "340px", lineHeight: 1.4 }}>
                    {item.description || "—"}
                  </td>
                  <td>
                    <div style={{ fontSize: "11px", color: "#60A5FA", fontFamily: "monospace" }}>
                      {item.canonical || `https://www.brightspaceinterior.in${item.path === "/" ? "" : item.path}`}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <Link
                        href={item.path}
                        target="_blank"
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px" }}
                        title="View page"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => openEdit(item)}
                        className="admin-btn admin-btn--gold"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        <Edit2 size={13} style={{ marginRight: "4px" }} /> Edit SEO
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit SEO Modal */}
      {editingItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "640px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                Edit SEO: {editingItem.path}
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Warning if phone mismatch */}
            {warningMsg && (
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#FBBF24",
                  fontSize: "13px",
                }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>{warningMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Page Route Path (Fixed)</label>
                <input
                  type="text"
                  disabled
                  value={editPath}
                  className="admin-input"
                  style={{ opacity: 0.7, cursor: "not-allowed", fontFamily: "monospace" }}
                />
              </div>

              <div>
                <label className="admin-label">Title Tag (50–60 characters recommended) *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="admin-input"
                />
                <span style={{ fontSize: "11px", color: editTitle.length > 60 ? "#F59E0B" : "#9CA3AF" }}>
                  {editTitle.length} characters
                </span>
              </div>

              <div>
                <label className="admin-label">Meta Description (140–160 characters recommended)</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="admin-input"
                  placeholder="Enter compelling description for Google search snippets..."
                />
                <span style={{ fontSize: "11px", color: editDesc.length > 160 ? "#F59E0B" : "#9CA3AF" }}>
                  {editDesc.length} characters
                </span>
              </div>

              <div>
                <label className="admin-label">Canonical URL (Automatic Self-Reference)</label>
                <input
                  type="text"
                  value={editCanonical}
                  onChange={(e) => setEditCanonical(e.target.value)}
                  className="admin-input"
                  placeholder={`https://www.brightspaceinterior.in${editPath === "/" ? "" : editPath}`}
                />
              </div>

              <div>
                <label className="admin-label">Social Share / OG Image (Firebase Storage / WebP)</label>
                <ImageUploadField
                  value={editOgImage}
                  onChange={setEditOgImage}
                  label="Upload or Select OG Image"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
                  <span>Save Page SEO</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
