"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  TrendingUp,
  FolderOpen,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Phone,
  Globe,
  Plus,
  X,
} from "lucide-react";
import { Lead, getStoredLeads, fetchServerLeads, saveNewLead } from "@/lib/leads";

const PIPELINE_STAGES = [
  "New",
  "Contacted",
  "Consultation Scheduled",
  "Site Visit Done",
  "Design/3D in Progress",
  "Quotation Sent",
  "Negotiation",
  "Won",
  "Lost",
];

const STATUS_MAP: Record<string, string> = {
  New: "status-badge--new",
  Contacted: "status-badge--contacted",
  "Consultation Scheduled": "status-badge--consultation",
  "Site Visit Done": "status-badge--consultation",
  "Design/3D in Progress": "status-badge--consultation",
  "Quotation Sent": "status-badge--contacted",
  Negotiation: "status-badge--contacted",
  Won: "status-badge--won",
  Lost: "status-badge--lost",
};

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("Residential Interior");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("₹10–25 Lakhs");
  const [source, setSource] = useState("Phone Call");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const load = async () => {
      setLeads(getStoredLeads());
      const serverLeads = await fetchServerLeads();
      if (serverLeads && serverLeads.length > 0) {
        setLeads(serverLeads);
      }
    };
    load();
    window.addEventListener("leadsUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("leadsUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    saveNewLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      project,
      location: location.trim() || "Delhi NCR",
      budget,
      source,
      status: "New",
      assigned: "Mohd Mushir",
      tags: [source],
      notes: notes.trim(),
    });

    setName("");
    setPhone("");
    setEmail("");
    setLocation("");
    setNotes("");
    setShowModal(false);
  };

  // Dynamic Metrics
  const totalLeads = leads.length;
  const wonCount = leads.filter((l) => l.status === "Won").length;
  const followUps = leads.filter(
    (l) => l.status === "New" || l.status === "Contacted" || l.status === "Consultation Scheduled"
  ).length;

  const statCards = [
    {
      label: "Total Leads",
      value: totalLeads.toString(),
      change: totalLeads > 0 ? `${totalLeads} active in CRM` : "No leads yet",
      icon: <Users size={18} />,
      colorClass: "stat-card__icon--gold",
    },
    {
      label: "Won Deals",
      value: wonCount.toString(),
      change: wonCount > 0 ? `${wonCount} closed projects` : "0 closed",
      icon: <CheckCircle size={18} />,
      colorClass: "stat-card__icon--blue",
    },
    {
      label: "Pending Inquiries",
      value: followUps.toString(),
      change: followUps > 0 ? `${followUps} need attention` : "None pending",
      icon: <Clock size={18} />,
      colorClass: "stat-card__icon--purple",
    },
  ];

  // Lead Sources breakdown
  const formCount = leads.filter((l) => l.source === "Form").length;
  const whatsappCount = leads.filter((l) => l.source === "WhatsApp").length;
  const callCount = leads.filter((l) => l.source === "Phone Call" || l.source === "Call").length;
  const instaCount = leads.filter((l) => l.source === "Instagram").length;

  const sourceStats = [
    { source: "Website Form", count: formCount, icon: Globe, pct: totalLeads > 0 ? Math.round((formCount / totalLeads) * 100) : 0 },
    { source: "WhatsApp", count: whatsappCount, icon: MessageSquare, pct: totalLeads > 0 ? Math.round((whatsappCount / totalLeads) * 100) : 0 },
    { source: "Phone Call", count: callCount, icon: Phone, pct: totalLeads > 0 ? Math.round((callCount / totalLeads) * 100) : 0 },
    { source: "Instagram", count: instaCount, icon: TrendingUp, pct: totalLeads > 0 ? Math.round((instaCount / totalLeads) * 100) : 0 },
  ];

  // Pipeline columns
  const pipelineStages = ["New", "Contacted", "Consultation Scheduled", "Design/3D in Progress", "Won"];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Good Morning, MOHD MUSHIR 👋
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Here&apos;s what&apos;s happening with Bright Space today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowModal(true)}
            className="admin-btn admin-btn--primary"
            id="dashboard-add-lead"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card" id={`stat-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className={`stat-card__icon ${card.colorClass}`}>
              {card.icon}
            </div>
            <div className="stat-card__label">{card.label}</div>
            <div className="stat-card__value">{card.value}</div>
            <div className="stat-card__change" style={{ color: "var(--gold)" }}>
              {card.change}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        {/* Recent Leads */}
        <div className="admin-table-wrap">
          <div className="admin-table-header">
            <div className="admin-table-title">Recent Leads</div>
            <Link href="/admin/leads" className="admin-btn admin-btn--outline" id="dashboard-view-leads">
              View All
            </Link>
          </div>
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Project & Location</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)", fontSize: "14px" }}>
                      No leads yet. Click <strong>&quot;+ Add Lead&quot;</strong> above to create a lead, or test the website contact form.
                    </td>
                  </tr>
                ) : (
                  leads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} style={{ cursor: "pointer" }}>
                      <td style={{ fontWeight: 600, color: "var(--charcoal)", whiteSpace: "nowrap" }}>
                        <div>{lead.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>{lead.phone}</div>
                      </td>
                      <td style={{ minWidth: "160px" }}>
                        <div>{lead.project}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{lead.location}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", background: "var(--stone)", borderRadius: "10px", color: "var(--bronze)", whiteSpace: "nowrap" }}>
                          {lead.source}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${STATUS_MAP[lead.status] || "status-badge--new"}`} style={{ whiteSpace: "nowrap" }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>{lead.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="admin-table-wrap" style={{ padding: "24px" }}>
          <div className="admin-table-title" style={{ marginBottom: "20px" }}>Lead Sources</div>
          {sourceStats.map(({ source: sName, count, icon: Icon, pct }) => (
            <div key={sName} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Icon size={14} style={{ color: "var(--gold)" }} />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--charcoal)" }}>{sName}</span>
                </div>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{count} leads</span>
              </div>
              <div style={{ height: "6px", background: "#F0F0F0", borderRadius: "3px" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--gold)", borderRadius: "3px", transition: "width 0.4s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <div className="admin-table-title">Lead Pipeline</div>
          <Link href="/admin/leads" className="admin-btn admin-btn--outline" id="dashboard-full-pipeline">
            Manage Pipeline
          </Link>
        </div>
        <div style={{ padding: "20px" }}>
          <div className="pipeline">
            {pipelineStages.map((stage) => {
              const stageLeads = leads.filter((l) => l.status === stage);
              return (
                <div key={stage} className="pipeline-column">
                  <div className="pipeline-column__header">
                    <span className="pipeline-column__title">{stage}</span>
                    <span className="pipeline-column__count">{stageLeads.length}</span>
                  </div>
                  {stageLeads.map((card) => (
                    <div key={card.id} className="pipeline-card" id={`pipeline-card-${card.id}`}>
                      <div className="pipeline-card__name">{card.name}</div>
                      <div className="pipeline-card__meta">{card.project} · {card.location}</div>
                      <div className="pipeline-card__footer">
                        <span className="pipeline-card__source">{card.source}</span>
                        <span className="pipeline-card__date">{card.date}</span>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div style={{ textAlign: "center", padding: "24px 12px", fontSize: "12px", color: "var(--text-muted)" }}>
                      No leads
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showModal && (
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
          onClick={() => setShowModal(false)}
        >
          <div
            className="admin-table-wrap"
            style={{ width: "100%", maxWidth: "540px", padding: "32px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", color: "var(--charcoal)" }}>
                Add New Lead
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddLead}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Email</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Gurugram, Delhi NCR"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Project Scope</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", background: "#FFF" }}
                  >
                    <option value="Residential Interior">Residential Interior</option>
                    <option value="Commercial Interior">Commercial Interior</option>
                    <option value="Turnkey Architecture">Turnkey Architecture</option>
                    <option value="Modular Kitchen & Wardrobe">Modular Kitchen & Wardrobe</option>
                    <option value="Villa Interior">Villa Interior</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Budget</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", background: "#FFF" }}
                  >
                    <option value="₹5–10 Lakhs">₹5–10 Lakhs</option>
                    <option value="₹10–25 Lakhs">₹10–25 Lakhs</option>
                    <option value="₹25–50 Lakhs">₹25–50 Lakhs</option>
                    <option value="₹50L–1 Crore">₹50L–1 Crore</option>
                    <option value="₹1 Crore+">₹1 Crore+</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Inquiry Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", background: "#FFF" }}
                >
                  <option value="Phone Call">Direct Phone Call</option>
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Form">Website Inquiry</option>
                  <option value="Instagram">Instagram Direct</option>
                  <option value="Referral">Client Referral</option>
                  <option value="Walk-in">Studio Walk-in</option>
                </select>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Notes / Brief</label>
                <textarea
                  rows={3}
                  placeholder="Client requirements, apartment possession date, style preferences..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn--primary"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
