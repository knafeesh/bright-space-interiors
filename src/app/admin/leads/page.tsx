"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  ChevronDown,
  X,
  Edit2,
  Trash2,
  User,
  Calendar,
  MapPin,
  DollarSign,
  Tag,
  Download,
  CheckCircle,
} from "lucide-react";
import {
  Lead,
  getStoredLeads,
  fetchServerLeads,
  saveNewLead,
  updateStoredLeadStatus,
  deleteStoredLead,
  addStoredLeadNote,
} from "@/lib/leads";

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

const STATUS_COLORS: Record<string, string> = {
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newNote, setNewNote] = useState("");

  // New Lead Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formProject, setFormProject] = useState("Residential Interior");
  const [formLocation, setFormLocation] = useState("");
  const [formBudget, setFormBudget] = useState("₹10–25 Lakhs");
  const [formSource, setFormSource] = useState("Phone Call");
  const [formStatus, setFormStatus] = useState("New");
  const [formAssigned, setFormAssigned] = useState("Mohd Mushir");
  const [formNotes, setFormNotes] = useState("");

  const searchParams = useSearchParams();

  // Load leads from storage on mount & listen for updates
  useEffect(() => {
    const load = async () => {
      setLeads(getStoredLeads());
      const serverLeads = await fetchServerLeads();
      if (serverLeads && serverLeads.length > 0) {
        setLeads(serverLeads);
      }
    };

    load();

    if (searchParams.get("add") === "true") {
      setShowForm(true);
    }

    window.addEventListener("leadsUpdated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("leadsUpdated", load);
      window.removeEventListener("storage", load);
    };
  }, [searchParams]);

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.project.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    saveNewLead({
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      project: formProject,
      location: formLocation.trim() || "Mumbai",
      budget: formBudget,
      source: formSource,
      status: formStatus,
      assigned: formAssigned,
      tags: [formSource],
      notes: formNotes.trim(),
    });

    // Reset & close
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormLocation("");
    setFormNotes("");
    setShowForm(false);
  };

  const handleUpdateStatus = (id: number, status: string) => {
    updateStoredLeadStatus(id, status);
    if (selectedLead?.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleDeleteLead = (id: number) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteStoredLead(id);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const handleAddNote = (id: number) => {
    if (!newNote.trim()) return;
    addStoredLeadNote(id, newNote.trim());
    setNewNote("");
    // Refresh selected lead
    const updated = getStoredLeads().find((l) => l.id === id);
    if (updated) setSelectedLead(updated);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert("No leads to export.");
      return;
    }
    const headers = ["ID", "Name", "Phone", "Email", "Project", "Location", "Budget", "Source", "Status", "Assigned", "Date", "Notes"];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.project.replace(/"/g, '""')}"`,
      `"${l.location.replace(/"/g, '""')}"`,
      `"${l.budget}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.assigned}"`,
      `"${l.date}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bright_space_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "32px", fontWeight: 400, color: "var(--charcoal)" }}>
            Lead Management
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            {leads.length} total leads · {leads.filter(l => l.status === "New").length} new inquiries
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="admin-btn admin-btn--outline"
            id="leads-export"
            onClick={handleExportCSV}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => setShowForm(true)}
            id="leads-add"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search leads by name, phone, project, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="leads-search"
            style={{
              width: "100%",
              padding: "10px 12px 10px 36px",
              border: "1px solid #DADADA",
              borderRadius: "4px",
              fontSize: "13px",
              outline: "none",
              background: "var(--white)",
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          id="leads-status-filter"
          style={{
            padding: "10px 16px",
            border: "1px solid #DADADA",
            borderRadius: "4px",
            fontSize: "13px",
            background: "var(--white)",
            color: "var(--charcoal)",
          }}
        >
          <option value="All">All Statuses ({leads.length})</option>
          {PIPELINE_STAGES.map((s) => (
            <option key={s} value={s}>
              {s} ({leads.filter((l) => l.status === s).length})
            </option>
          ))}
        </select>
      </div>

      {/* Leads Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project & Location</th>
                <th>Budget</th>
                <th>Source</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedLead(lead)}
                  id={`lead-row-${lead.id}`}
                >
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--charcoal)", whiteSpace: "nowrap" }}>{lead.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{lead.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{lead.project}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{lead.location}</div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{lead.budget}</td>
                  <td>
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 10px", background: "var(--stone)", borderRadius: "10px", color: "var(--bronze)", whiteSpace: "nowrap" }}>
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${STATUS_COLORS[lead.status] || "status-badge--new"}`} style={{ whiteSpace: "nowrap" }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--charcoal)", whiteSpace: "nowrap" }}>
                    {lead.assigned || "Mohd Mushir"}
                  </td>
                  <td style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>{lead.date}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        title="WhatsApp"
                        style={{ color: "#25D366", cursor: "pointer", background: "none", border: "none" }}
                        onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g,"")}`, "_blank")}
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button
                        title="Call"
                        style={{ color: "var(--gold)", cursor: "pointer", background: "none", border: "none" }}
                        onClick={() => window.open(`tel:${lead.phone}`, "_self")}
                      >
                        <Phone size={15} />
                      </button>
                      <button
                        title="Delete Lead"
                        style={{ color: "#DC2626", cursor: "pointer", background: "none", border: "none" }}
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)", fontSize: "14px" }}>
                    No leads found. Click <strong>&quot;+ Add Lead&quot;</strong> to manually register a lead, or test the website contact form.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showForm && (
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
          onClick={() => setShowForm(false)}
        >
          <div
            className="admin-table-wrap"
            style={{ width: "100%", maxWidth: "560px", padding: "32px", margin: 0, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "24px", color: "var(--charcoal)" }}>
                Add New Lead
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLead}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhal"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Location / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Bandra West, Mumbai"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Project Scope</label>
                  <select
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", background: "#FFF" }}
                  >
                    <option value="Residential Interior">Residential Interior</option>
                    <option value="Commercial Interior">Commercial Interior</option>
                    <option value="Turnkey Architecture">Turnkey Architecture</option>
                    <option value="Modular Kitchen & Wardrobe">Modular Kitchen & Wardrobe</option>
                    <option value="Villa Interior">Villa Interior</option>
                    <option value="Restaurant / Cafe">Restaurant / Cafe</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Estimated Budget</label>
                  <select
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Lead Source</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", background: "#FFF" }}
                  >
                    <option value="Phone Call">Direct Phone Call</option>
                    <option value="WhatsApp">WhatsApp Inquiry</option>
                    <option value="Form">Website Form</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Client Referral</option>
                    <option value="Walk-in">Studio Walk-in</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Initial Pipeline Stage</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", background: "#FFF" }}
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px" }}>Notes / Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Client design requirements, property dimensions, handover timeline..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "14px", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setShowForm(false)}
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

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            zIndex: 1000,
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              height: "100%",
              background: "#FFF",
              padding: "32px",
              overflowY: "auto",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <span className={`status-badge ${STATUS_COLORS[selectedLead.status] || "status-badge--new"}`}>
                  {selectedLead.status}
                </span>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", marginTop: "8px", color: "var(--charcoal)" }}>
                  {selectedLead.name}
                </h2>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {selectedLead.project}
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Stage Selector */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                Update Pipeline Status
              </label>
              <select
                value={selectedLead.status}
                onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", background: "#FFF" }}
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Quick Contact Actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              <a
                href={`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn"
                style={{ justifyContent: "center", background: "#25D366", color: "white" }}
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
              <a
                href={`tel:${selectedLead.phone}`}
                className="admin-btn admin-btn--outline"
                style={{ justifyContent: "center" }}
              >
                <Phone size={14} /> Call Client
              </a>
            </div>

            {/* Details Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "6px" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Phone</div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "2px" }}>{selectedLead.phone}</div>
              </div>
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "6px" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Location</div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "2px" }}>{selectedLead.location || "Mumbai"}</div>
              </div>
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "6px" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Budget</div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "2px" }}>{selectedLead.budget}</div>
              </div>
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "6px" }}>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Source</div>
                <div style={{ fontSize: "13px", fontWeight: 600, marginTop: "2px" }}>{selectedLead.source}</div>
              </div>
            </div>

            {/* Activity Notes */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "10px" }}>
                Activity & Consultation Notes
              </div>
              {selectedLead.notes ? (
                <div style={{ background: "#F9FAFB", padding: "14px", borderRadius: "6px", fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap", marginBottom: "14px" }}>
                  {selectedLead.notes}
                </div>
              ) : (
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>
                  No notes recorded yet.
                </div>
              )}

              <div style={{ display: "flex", gap: "8px" }}>
                <textarea
                  rows={2}
                  placeholder="Add a progress or follow-up note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", border: "1px solid #E0E0E0", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit" }}
                />
                <button
                  type="button"
                  onClick={() => handleAddNote(selectedLead.id)}
                  className="admin-btn admin-btn--primary"
                  style={{ alignSelf: "flex-end", padding: "8px 16px" }}
                >
                  Save
                </button>
              </div>
            </div>

            {/* Delete Lead Button */}
            <div style={{ paddingTop: "16px", borderTop: "1px solid #F0F0F0" }}>
              <button
                type="button"
                onClick={() => handleDeleteLead(selectedLead.id)}
                style={{ background: "none", border: "none", color: "#DC2626", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Trash2 size={14} /> Delete this lead
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
