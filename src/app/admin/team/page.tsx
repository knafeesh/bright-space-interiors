"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { TeamMemberItem } from "@/lib/site-types";

export default function TeamManagerPage() {
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMemberItem | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("/images/hero-luxury.jpg");

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const loadTeam = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.team)) {
        setTeam(data.team);
      }
    } catch {
      notifyError("Failed to load team from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setName("");
    setRole("");
    setBio("");
    setImage("/images/hero-luxury.jpg");
    setShowModal(true);
  };

  const openEdit = (m: TeamMemberItem) => {
    setEditingItem(m);
    setName(m.name);
    setRole(m.role);
    setBio(m.bio || "");
    setImage(m.image || "/images/hero-luxury.jpg");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      notifyError("Name and role are required.");
      return;
    }

    const payload: TeamMemberItem = {
      id: editingItem ? editingItem.id : Date.now(),
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      image: image.trim(),
      order: editingItem ? editingItem.order : team.length + 1,
      published: true,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member: payload }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeam(data.team);
        setShowModal(false);
        setEditingItem(null);
        notify("Team member saved to Firestore!");
      } else {
        notifyError(data.error || "Failed to save team member.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setTeam(data.team);
        notify("Team member removed.");
      } else {
        notifyError(data.error || "Failed to delete.");
      }
    } catch {
      notifyError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= team.length) return;

    const list = [...team];
    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setTeam(reordered);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk", team: reordered }),
      });
      const data = await res.json();
      if (data.success) {
        notify("Team order updated and saved.");
      } else {
        notifyError("Failed to save reorder.");
        loadTeam();
      }
    } catch {
      notifyError("Network error.");
      loadTeam();
    } finally {
      setSaving(false);
    }
  };

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
            Studio Team Members
          </h1>
          <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
            Leadership, principal architects, and senior designers featured on the public /about page.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={openAdd}
            className="admin-btn admin-btn--gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> Add Team Member
          </button>
          <Link
            href="/about"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View /about
          </Link>
        </div>
      </div>

      {/* Team Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Order</th>
              <th style={{ width: "70px" }}>Photo</th>
              <th>Name</th>
              <th>Role</th>
              <th>Biography</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px" }} />
                  <p style={{ margin: 0, color: "#9CA3AF" }}>Loading team...</p>
                </td>
              </tr>
            ) : team.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                  No team members found. Click "Add Team Member" to create one.
                </td>
              </tr>
            ) : (
              team.map((m, idx) => (
                <tr key={m.id}>
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
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleReorder(idx, "down")}
                        disabled={idx === team.length - 1 || saving}
                        style={{
                          background: "none",
                          border: "none",
                          color: idx === team.length - 1 ? "#4B5563" : "#C5A880",
                          cursor: idx === team.length - 1 ? "not-allowed" : "pointer",
                          padding: "2px",
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <img
                      src={m.image || "/images/hero-luxury.jpg"}
                      alt={m.name}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#F3F4F6", fontSize: "14px" }}>{m.name}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "3px 8px",
                        borderRadius: "10px",
                        background: "rgba(197, 168, 128, 0.15)",
                        color: "#C5A880",
                        fontWeight: 500,
                      }}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td style={{ fontSize: "13px", color: "#9CA3AF", maxWidth: "340px", lineHeight: 1.4 }}>
                    {m.bio || "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(m)}
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px" }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="admin-btn admin-btn--outline"
                        style={{ padding: "6px 8px", color: "#EF4444" }}
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

      {/* Modal: Add / Edit Team Member */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: "540px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontFamily: "var(--font-serif, serif)", fontSize: "20px", margin: 0, color: "#F3F4F6" }}>
                {editingItem ? `Edit Member: ${editingItem.name}` : "Add Team Member"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="admin-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Mohd Mushir"
                />
              </div>

              <div>
                <label className="admin-label">Role / Title *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Founder & Principal Interior Architect"
                />
              </div>

              <div>
                <label className="admin-label">Portrait Photo (Firebase Storage / WebP)</label>
                <ImageUploadField
                  value={image}
                  onChange={setImage}
                  label="Upload or Select Team Member Photo"
                />
              </div>

              <div>
                <label className="admin-label">Biography / Background</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="admin-input"
                  placeholder="15+ years of bespoke luxury residential and commercial architecture across Delhi NCR..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  <span>Save Member</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
