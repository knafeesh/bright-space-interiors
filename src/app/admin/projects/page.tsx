"use client";

import { useState, useEffect } from "react";
import {
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, X, Save,
  MapPin, Calendar, DollarSign, User, Phone, CheckCircle,
  Clock, AlertCircle, Pause, ChevronDown, ChevronUp, Tag,
  Building2, Home, Briefcase, Layers, ArrowRight, TrendingUp,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";
type ProjectType = "Residential" | "Commercial" | "Turnkey" | "Design & Execution";

interface Milestone {
  id: string;
  name: string;
  done: boolean;
}

interface Project {
  id: string;
  name: string;
  client: string;
  phone: string;
  type: ProjectType;
  location: string;
  budget: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progress: number;
  description: string;
  milestones: Milestone[];
  createdAt: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const STATUS_META: Record<ProjectStatus, { label: string; color: string; bg: string; icon: any }> = {
  planning:    { label: "Planning",     color: "#6366F1", bg: "rgba(99,102,241,0.12)",  icon: Clock },
  "in-progress":{ label: "In Progress", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", icon: TrendingUp },
  "on-hold":   { label: "On Hold",      color: "#F97316", bg: "rgba(249,115,22,0.12)", icon: Pause },
  completed:   { label: "Completed",    color: "#10B981", bg: "rgba(16,185,129,0.12)", icon: CheckCircle },
  cancelled:   { label: "Cancelled",    color: "#EF4444", bg: "rgba(239,68,68,0.12)",  icon: AlertCircle },
};

const TYPE_ICONS: Record<ProjectType, any> = {
  "Residential": Home,
  "Commercial": Building2,
  "Turnkey": Layers,
  "Design & Execution": Briefcase,
};

const STORAGE_KEY = "bs_admin_projects";

function genId() { return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }

const DEFAULT_MILESTONES: Milestone[] = [
  { id: "m1", name: "Site Visit & Measurement", done: false },
  { id: "m2", name: "Design Concept Approval", done: false },
  { id: "m3", name: "Material Selection", done: false },
  { id: "m4", name: "Execution Started", done: false },
  { id: "m5", name: "Final Inspection", done: false },
  { id: "m6", name: "Handover", done: false },
];

function calcProgress(milestones: Milestone[]) {
  if (!milestones.length) return 0;
  return Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100);
}

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "20px",
      background: meta.bg, color: meta.color,
      fontSize: "12px", fontWeight: 600, letterSpacing: "0.02em",
    }}>
      <Icon size={12} /> {meta.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// Progress Bar
// ─────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  return (
    <div style={{ width: "100%", background: "rgba(0,0,0,0.06)", borderRadius: "6px", height: "6px", overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${value}%`,
        background: value === 100
          ? "linear-gradient(90deg,#10B981,#059669)"
          : "linear-gradient(90deg,#C5A880,#A27B42)",
        borderRadius: "6px",
        transition: "width 0.5s ease",
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Form Modal
// ─────────────────────────────────────────────
function ProjectModal({
  project, onClose, onSave,
}: {
  project: Project | null;
  onClose: () => void;
  onSave: (p: Project) => void;
}) {
  const isNew = !project;
  const [form, setForm] = useState<Project>(
    project ?? {
      id: genId(),
      name: "",
      client: "",
      phone: "",
      type: "Residential",
      location: "",
      budget: "",
      startDate: "",
      endDate: "",
      status: "planning",
      progress: 0,
      description: "",
      milestones: DEFAULT_MILESTONES.map((m) => ({ ...m, id: genId() })),
      createdAt: new Date().toISOString(),
    }
  );

  const set = (k: keyof Project, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const toggleMilestone = (id: string) => {
    const updated = form.milestones.map((m) => m.id === id ? { ...m, done: !m.done } : m);
    setForm((f) => ({ ...f, milestones: updated, progress: calcProgress(updated) }));
  };

  const addMilestone = () => {
    const ms = [...form.milestones, { id: genId(), name: "New milestone", done: false }];
    setForm((f) => ({ ...f, milestones: ms }));
  };

  const updateMilestoneName = (id: string, name: string) => {
    setForm((f) => ({ ...f, milestones: f.milestones.map((m) => m.id === id ? { ...m, name } : m) }));
  };

  const deleteMilestone = (id: string) => {
    const ms = form.milestones.filter((m) => m.id !== id);
    setForm((f) => ({ ...f, milestones: ms, progress: calcProgress(ms) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.client.trim()) return;
    onSave({ ...form, progress: calcProgress(form.milestones) });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    background: "#F9FAFB", border: "1px solid #E5E7EB",
    borderRadius: "8px", fontSize: "14px", color: "#111827",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: "12px", fontWeight: 600, color: "#6B7280", marginBottom: "5px", display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }} />
      <div style={{
        position: "relative", width: "100%", maxWidth: "680px", maxHeight: "92vh",
        background: "#FFF", borderRadius: "16px", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        overflow: "hidden", display: "flex", flexDirection: "column",
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>{isNew ? "Add New Project" : "Edit Project"}</h2>
            <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#9CA3AF" }}>{isNew ? "Fill in project details below" : `Editing: ${project?.name}`}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", borderRadius: "6px", padding: "4px" }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: "auto", flex: 1, padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Project Name *</label>
              <input style={inputStyle} placeholder="e.g. Gupta Residence — Living Room" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Client Name *</label>
              <input style={inputStyle} placeholder="Full name" value={form.client} onChange={(e) => set("client", e.target.value)} required />
            </div>
            <div>
              <label style={labelStyle}>Client Phone</label>
              <input style={inputStyle} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Project Type</label>
              <select style={inputStyle} value={form.type} onChange={(e) => set("type", e.target.value as ProjectType)}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Turnkey</option>
                <option>Design & Execution</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={(e) => set("status", e.target.value as ProjectStatus)}>
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} placeholder="City / Area" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Budget</label>
              <input style={inputStyle} placeholder="e.g. ₹15 Lakh" value={form.budget} onChange={(e) => set("budget", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input style={inputStyle} type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Expected End Date</label>
              <input style={inputStyle} type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description / Notes</label>
              <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="Project scope, requirements, special notes..." value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </div>

          {/* Milestones */}
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>Milestones</div>
                <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{form.milestones.filter((m) => m.done).length} / {form.milestones.length} completed</div>
              </div>
              <button type="button" onClick={addMilestone} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", background: "#F3F4F6", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>
                <Plus size={13} /> Add
              </button>
            </div>
            <ProgressBar value={calcProgress(form.milestones)} />
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {form.milestones.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: m.done ? "rgba(16,185,129,0.06)" : "#F9FAFB", borderRadius: "8px", border: `1px solid ${m.done ? "rgba(16,185,129,0.2)" : "#E5E7EB"}` }}>
                  <input type="checkbox" checked={m.done} onChange={() => toggleMilestone(m.id)} style={{ accentColor: "#10B981", cursor: "pointer", flexShrink: 0 }} />
                  <input
                    value={m.name}
                    onChange={(e) => updateMilestoneName(m.id, e.target.value)}
                    style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "13px", color: m.done ? "#6B7280" : "#111827", textDecoration: m.done ? "line-through" : "none" }}
                  />
                  <button type="button" onClick={() => deleteMilestone(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", padding: "2px" }}>
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "24px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ padding: "10px 20px", background: "#F3F4F6", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>Cancel</button>
            <button type="submit" style={{ padding: "10px 24px", background: "linear-gradient(135deg,#C5A880,#A27B42)", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", color: "#FFF", display: "flex", alignItems: "center", gap: "6px" }}>
              <Save size={15} /> {isNew ? "Add Project" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Project Card
// ─────────────────────────────────────────────
function ProjectCard({ project, onEdit, onDelete }: { project: Project; onEdit: () => void; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const TypeIcon = TYPE_ICONS[project.type];

  return (
    <div style={{
      background: "#FFF", borderRadius: "14px",
      border: "1px solid #F3F4F6",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.2s",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")}
    >
      {/* Card Header */}
      <div style={{ padding: "18px 20px 14px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1 }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(197,168,128,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TypeIcon size={18} style={{ color: "#C5A880" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "#6B7280" }}>
                <User size={11} /> {project.client}
                {project.phone && <><span style={{ color: "#D1D5DB" }}>•</span><Phone size={11} /> {project.phone}</>}
              </div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", borderRadius: "6px", padding: "4px" }}
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
                <div style={{ position: "absolute", right: 0, top: "100%", zIndex: 20, background: "#FFF", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #F3F4F6", minWidth: "140px", overflow: "hidden" }}>
                  <button onClick={() => { onEdit(); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#374151" }}>
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => { onDelete(); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: "#EF4444" }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
          <StatusBadge status={project.status} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 9px", background: "#F3F4F6", borderRadius: "20px", fontSize: "11px", color: "#6B7280", fontWeight: 500 }}>
            <Tag size={10} /> {project.type}
          </span>
          {project.location && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 9px", background: "#F3F4F6", borderRadius: "20px", fontSize: "11px", color: "#6B7280", fontWeight: 500 }}>
              <MapPin size={10} /> {project.location}
            </span>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #F9FAFB" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 500 }}>Progress</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: project.progress === 100 ? "#10B981" : "#374151" }}>{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
            {project.milestones.filter((m) => m.done).length} / {project.milestones.length} milestones
          </span>
          {project.budget && (
            <span style={{ fontSize: "11px", color: "#9CA3AF", display: "flex", alignItems: "center", gap: "3px" }}>
              <DollarSign size={10} /> {project.budget}
            </span>
          )}
        </div>
      </div>

      {/* Dates + Expand */}
      <div style={{ padding: "10px 20px 14px", borderTop: "1px solid #F9FAFB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "14px" }}>
            {project.startDate && (
              <span style={{ fontSize: "11px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={11} /> {new Date(project.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            )}
            {project.endDate && (
              <>
                <span style={{ color: "#D1D5DB", fontSize: "11px" }}>→</span>
                <span style={{ fontSize: "11px", color: "#6B7280", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={11} /> {new Date(project.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </>
            )}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "11px", display: "flex", alignItems: "center", gap: "3px" }}
          >
            {expanded ? <><ChevronUp size={13} /> Less</> : <><ChevronDown size={13} /> Details</>}
          </button>
        </div>

        {expanded && (
          <div style={{ marginTop: "14px", borderTop: "1px dashed #F3F4F6", paddingTop: "14px" }}>
            {project.description && (
              <p style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.6, marginBottom: "12px" }}>{project.description}</p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {project.milestones.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: m.done ? "#10B981" : "#6B7280" }}>
                  <CheckCircle size={12} style={{ color: m.done ? "#10B981" : "#D1D5DB" }} />
                  <span style={{ textDecoration: m.done ? "line-through" : "none" }}>{m.name}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
              <button onClick={onEdit} style={{ flex: 1, padding: "8px", background: "rgba(197,168,128,0.1)", border: "1px solid rgba(197,168,128,0.3)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#A27B42", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                <Edit2 size={12} /> Edit Project
              </button>
              {project.phone && (
                <a href={`https://wa.me/${project.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, padding: "8px", background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: "#15803D", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", textDecoration: "none" }}>
                  <Phone size={12} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ProjectStatus>("all");
  const [filterType, setFilterType] = useState<"all" | ProjectType>("all");
  const [modalProject, setModalProject] = useState<Project | null | "new">(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProjects(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (data: Project[]) => {
    setProjects(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handleSave = (p: Project) => {
    const exists = projects.find((x) => x.id === p.id);
    const updated = exists ? projects.map((x) => (x.id === p.id ? p : x)) : [p, ...projects];
    persist(updated);
    setModalProject(null);
  };

  const handleDelete = (id: string) => {
    persist(projects.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = projects.filter((p) => {
    const matchSearch = !search || [p.name, p.client, p.location].some((v) => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchType = filterType === "all" || p.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === "in-progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
    planning: projects.filter((p) => p.status === "planning").length,
  };

  return (
    <div style={{ padding: "0", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Projects", value: stats.total, color: "#6366F1", icon: Briefcase },
          { label: "In Progress", value: stats.inProgress, color: "#F59E0B", icon: TrendingUp },
          { label: "Completed", value: stats.completed, color: "#10B981", icon: CheckCircle },
          { label: "Planning", value: stats.planning, color: "#8B5CF6", icon: Clock },
        ].map((s) => (
          <div key={s.label} style={{ background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6", padding: "16px 20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project, client, location…"
              style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{ padding: "9px 32px 9px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "#FFF", cursor: "pointer", outline: "none" }}
          >
            <option value="all">All Statuses</option>
            {(Object.keys(STATUS_META) as ProjectStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            style={{ padding: "9px 32px 9px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "#FFF", cursor: "pointer", outline: "none" }}
          >
            <option value="all">All Types</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Turnkey</option>
            <option>Design & Execution</option>
          </select>

          {/* Add Button */}
          <button
            id="add-project-btn"
            onClick={() => setModalProject("new")}
            style={{ display: "flex", alignItems: "center", gap: "7px", padding: "9px 18px", background: "linear-gradient(135deg,#C5A880,#A27B42)", border: "none", borderRadius: "8px", color: "#FFF", fontWeight: 700, fontSize: "13px", cursor: "pointer", letterSpacing: "0.02em" }}
          >
            <Plus size={15} /> Add Project
          </button>
        </div>

        {/* Result count */}
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#9CA3AF" }}>
          Showing <strong>{filtered.length}</strong> of <strong>{projects.length}</strong> projects
        </div>
      </div>

      {/* Grid / Empty State */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(197,168,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Briefcase size={28} style={{ color: "#C5A880" }} />
          </div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
            {projects.length === 0 ? "No Projects Yet" : "No Matching Projects"}
          </h3>
          <p style={{ fontSize: "14px", color: "#9CA3AF", margin: "0 0 20px" }}>
            {projects.length === 0 ? "Add your first project to start tracking progress." : "Try adjusting your search or filters."}
          </p>
          {projects.length === 0 && (
            <button onClick={() => setModalProject("new")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 22px", background: "linear-gradient(135deg,#C5A880,#A27B42)", border: "none", borderRadius: "8px", color: "#FFF", fontWeight: 700, cursor: "pointer" }}>
              <Plus size={16} /> Add First Project <ArrowRight size={14} />
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "18px" }}>
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={() => setModalProject(p)}
              onDelete={() => setDeleteConfirm(p.id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalProject !== null && (
        <ProjectModal
          project={modalProject === "new" ? null : modalProject}
          onClose={() => setModalProject(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={() => setDeleteConfirm(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "relative", background: "#FFF", borderRadius: "14px", padding: "28px 32px", boxShadow: "0 20px 50px rgba(0,0,0,0.15)", textAlign: "center", maxWidth: "360px", zIndex: 1 }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Trash2 size={24} style={{ color: "#EF4444" }} />
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 700, color: "#111827" }}>Delete Project?</h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#6B7280" }}>This action cannot be undone. The project and all milestones will be permanently removed.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "10px", background: "#F3F4F6", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "10px", background: "#EF4444", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", color: "#FFF" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
