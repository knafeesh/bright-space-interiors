"use client";
import { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Printer,
  CheckCircle,
  Clock,
  Send,
  XCircle,
  Search,
  ArrowRight,
  Eye,
  Edit2,
  DollarSign,
  Building,
} from "lucide-react";
import { ADDRESS, EMAIL, PHONE_NUMBER, ALT_PHONE_NUMBER } from "@/lib/data";

interface QuoteItem {
  id: string;
  description: string;
  category: "Civil" | "Woodwork & Modular" | "Electrical & MEP" | "Painting & Finishes" | "Design & Supervision";
  qty: number;
  unit: string;
  rate: number;
}

interface Quotation {
  id: string;
  quoteNo: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectTitle: string;
  location: string;
  date: string;
  validUntil: string;
  status: "Draft" | "Sent" | "Approved" | "Rejected";
  items: QuoteItem[];
  discountPercent: number;
  taxPercent: number; // usually 18% GST
  notes: string;
}

const INITIAL_QUOTES: Quotation[] = [
  {
    id: "q-1",
    quoteNo: "BSI-QT-2024-089",
    clientName: "Look Salon Management",
    clientPhone: "+91 81680 51355",
    clientEmail: "ops@looksalon.in",
    projectTitle: "Look Salon Flagship Turnkey Build",
    location: "New Colony, Old Gurugram",
    date: "2024-07-15",
    validUntil: "2024-08-15",
    status: "Approved",
    discountPercent: 5,
    taxPercent: 18,
    notes: "Turnkey delivery within 14 weeks. Includes custom brass vanity arches, travertine counters, and acoustic ceilings.",
    items: [
      { id: "i-1", description: "Demolition, civil modifications & acoustic drywalling", category: "Civil", qty: 4000, unit: "sq ft", rate: 220 },
      { id: "i-2", description: "Bespoke travertine reception counter & styling stations", category: "Woodwork & Modular", qty: 12, unit: "units", rate: 45000 },
      { id: "i-3", description: "High-CRI salon lighting, concealed wiring & 3-phase MEP", category: "Electrical & MEP", qty: 1, unit: "lump sum", rate: 380000 },
      { id: "i-4", description: "Champagne brass vanity frames & tinted mirror cladding", category: "Painting & Finishes", qty: 14, unit: "sets", rate: 28000 },
      { id: "i-5", description: "Turnkey project management & site supervision", category: "Design & Supervision", qty: 1, unit: "package", rate: 250000 },
    ],
  },
  {
    id: "q-2",
    quoteNo: "BSI-QT-2024-102",
    clientName: "Manish Singh",
    clientPhone: "+91 98112 34567",
    clientEmail: "manish.singh@gmail.com",
    projectTitle: "Park View City Luxury 3BHK Residence",
    location: "Sector 48, Gurugram",
    date: "2024-09-02",
    validUntil: "2024-10-02",
    status: "Approved",
    discountPercent: 0,
    taxPercent: 18,
    notes: "Full residence turnkey interior with German soft-close fittings and Italian marble floor polishing.",
    items: [
      { id: "i-1", description: "Italian marble diamond polishing & stone sealing", category: "Civil", qty: 1300, unit: "sq ft", rate: 110 },
      { id: "i-2", description: "Acrylic finish modular kitchen with tandem drawers", category: "Woodwork & Modular", qty: 1, unit: "set", rate: 420000 },
      { id: "i-3", description: "Master & guest bedrooms floor-to-ceiling wardrobes", category: "Woodwork & Modular", qty: 3, unit: "units", rate: 145000 },
      { id: "i-4", description: "Architectural false ceiling with warm magnetic track lights", category: "Electrical & MEP", qty: 1300, unit: "sq ft", rate: 175 },
      { id: "i-5", description: "Royale luxury emulsion painting & textured accent wall", category: "Painting & Finishes", qty: 4200, unit: "sq ft", rate: 48 },
    ],
  },
  {
    id: "q-3",
    quoteNo: "BSI-QT-2024-118",
    clientName: "Ashok Kumar",
    clientPhone: "+91 98711 22334",
    clientEmail: "ashok.dwarka@outlook.com",
    projectTitle: "Dwarka Modern Living & Modular Kitchen",
    location: "Sector 23, Dwarka, Delhi",
    date: "2024-10-01",
    validUntil: "2024-10-31",
    status: "Sent",
    discountPercent: 3,
    taxPercent: 18,
    notes: "Includes modular kitchen, TV media console, and concealed LED profile lighting.",
    items: [
      { id: "i-1", description: "Premium PU finish modular kitchen with quartz counter", category: "Woodwork & Modular", qty: 1, unit: "set", rate: 360000 },
      { id: "i-2", description: "Living room fluted paneling & floating TV console", category: "Woodwork & Modular", qty: 1, unit: "set", rate: 115000 },
      { id: "i-3", description: "False ceiling & COB dimmable lighting throughout", category: "Electrical & MEP", qty: 900, unit: "sq ft", rate: 160 },
      { id: "i-4", description: "Complete internal anti-bacterial PU wall finishes", category: "Painting & Finishes", qty: 3100, unit: "sq ft", rate: 42 },
    ],
  },
];

const STATUS_COLORS: Record<Quotation["status"], { bg: string; text: string; icon: any }> = {
  Draft: { bg: "#F3F4F6", text: "#4B5563", icon: Clock },
  Sent: { bg: "#EFF6FF", text: "#2563EB", icon: Send },
  Approved: { bg: "#ECFDF5", text: "#059669", icon: CheckCircle },
  Rejected: { bg: "#FEF2F2", text: "#DC2626", icon: XCircle },
};

function calculateTotals(q: Quotation) {
  const subtotal = q.items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const discount = (subtotal * q.discountPercent) / 100;
  const taxable = subtotal - discount;
  const tax = (taxable * q.taxPercent) / 100;
  const grandTotal = taxable + tax;
  return { subtotal, discount, taxable, tax, grandTotal };
}

export default function QuotationsPage() {
  const [quotes, setQuotes] = useState<Quotation[]>(INITIAL_QUOTES);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);
  const [editModal, setEditModal] = useState<Quotation | "new" | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.quoteNo.toLowerCase().includes(search.toLowerCase()) ||
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      q.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSaveQuote = (quoteData: Quotation) => {
    if (quotes.some((q) => q.id === quoteData.id)) {
      setQuotes(quotes.map((q) => (q.id === quoteData.id ? quoteData : q)));
    } else {
      setQuotes([quoteData, ...quotes]);
    }
    setEditModal(null);
    if (selectedQuote && selectedQuote.id === quoteData.id) {
      setSelectedQuote(quoteData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      setQuotes(quotes.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) setSelectedQuote(null);
    }
  };

  return (
    <div style={{ padding: "0", fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* Top Header stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Quotations", value: quotes.length, color: "#6366F1", icon: FileText },
          { label: "Approved Value", value: `₹${(quotes.filter(q => q.status === "Approved").reduce((sum, q) => sum + calculateTotals(q).grandTotal, 0) / 100000).toFixed(1)}L`, color: "#10B981", icon: CheckCircle },
          { label: "Pending Sent", value: quotes.filter(q => q.status === "Sent").length, color: "#F59E0B", icon: Send },
          { label: "Draft Proposals", value: quotes.filter(q => q.status === "Draft").length, color: "#8B5CF6", icon: Clock },
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
        <div style={{ display: "flex", gap: "10px", flex: "1 1 300px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder="Search quotation by quote #, client, project, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: "9px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", color: "#374151", background: "#FFF", outline: "none", cursor: "pointer" }}
          >
            <option value="all">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          onClick={() => setEditModal("new")}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "linear-gradient(135deg, #B8975A, #8F723E)", color: "#FFF", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
        >
          <Plus size={16} /> Create Quotation
        </button>
      </div>

      {/* Quotations List */}
      <div style={{ background: "#FFF", borderRadius: "14px", border: "1px solid #F3F4F6", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontWeight: 600, fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              <th style={{ padding: "14px 20px" }}>Quote #</th>
              <th style={{ padding: "14px 20px" }}>Client & Project</th>
              <th style={{ padding: "14px 20px" }}>Date</th>
              <th style={{ padding: "14px 20px" }}>Total Amount</th>
              <th style={{ padding: "14px 20px" }}>Status</th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.map((q) => {
              const { grandTotal } = calculateTotals(q);
              const statusCfg = STATUS_COLORS[q.status];
              const StatusIcon = statusCfg.icon;
              return (
                <tr key={q.id} style={{ borderBottom: "1px solid #F3F4F6", transition: "background 0.15s" }}>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "#111827" }}>
                    {q.quoteNo}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{q.clientName}</div>
                    <div style={{ fontSize: "12px", color: "#6B7280" }}>{q.projectTitle} · {q.location}</div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "#6B7280" }}>
                    <div>{q.date}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>Valid: {q.validUntil}</div>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "#111827" }}>
                    ₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background: statusCfg.bg,
                        color: statusCfg.text,
                      }}
                    >
                      <StatusIcon size={13} />
                      {q.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <button
                        onClick={() => setSelectedQuote(q)}
                        title="View & Print Quote"
                        style={{ padding: "6px 10px", background: "#F3F4F6", border: "none", borderRadius: "6px", cursor: "pointer", color: "#374151" }}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setEditModal(q)}
                        title="Edit Quote"
                        style={{ padding: "6px 10px", background: "#F3F4F6", border: "none", borderRadius: "6px", cursor: "pointer", color: "#374151" }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        title="Delete Quote"
                        style={{ padding: "6px 10px", background: "#FEE2E2", border: "none", borderRadius: "6px", cursor: "pointer", color: "#DC2626" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quote Preview / Print Modal */}
      {selectedQuote && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={() => setSelectedQuote(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} />
          <div
            style={{
              position: "relative",
              background: "#FFF",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "850px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "40px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              zIndex: 1,
            }}
          >
            {/* Header / Actions bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "1px solid #E5E7EB", paddingBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#B8975A" }}>
                OFFICIAL PROPOSAL & BOQ ESTIMATE
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handlePrint}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: "#111827", color: "#FFF", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedQuote(null)}
                  style={{ padding: "8px 14px", background: "#F3F4F6", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Document Sheet */}
            <div id="quotation-print-area">
              {/* Brand Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                <div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "28px", fontWeight: 700, color: "#1C1C1C", letterSpacing: "0.05em" }}>
                    THE BRIGHT SPACE INTERIORS
                  </div>
                  <div style={{ fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8975A", marginTop: "2px" }}>
                    Luxury Interior Design & Turnkey Execution
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "8px", maxWidth: "340px", lineHeight: 1.5 }}>
                    {ADDRESS}<br />
                    Phone: {PHONE_NUMBER} / {ALT_PHONE_NUMBER}<br />
                    Email: {EMAIL}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827" }}>{selectedQuote.quoteNo}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>Date: <strong>{selectedQuote.date}</strong></div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>Valid Until: <strong>{selectedQuote.validUntil}</strong></div>
                  <div style={{ marginTop: "8px" }}>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, background: STATUS_COLORS[selectedQuote.status].bg, color: STATUS_COLORS[selectedQuote.status].text }}>
                      STATUS: {selectedQuote.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Client & Project Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", background: "#F9FAFB", padding: "18px 20px", borderRadius: "10px", marginBottom: "28px" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client Details</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginTop: "4px" }}>{selectedQuote.clientName}</div>
                  <div style={{ fontSize: "13px", color: "#4B5563", marginTop: "2px" }}>{selectedQuote.clientPhone} · {selectedQuote.clientEmail}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em" }}>Project Location & Scope</div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginTop: "4px" }}>{selectedQuote.projectTitle}</div>
                  <div style={{ fontSize: "13px", color: "#4B5563", marginTop: "2px" }}>{selectedQuote.location}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginBottom: "24px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #111827", color: "#111827", fontWeight: 700, textAlign: "left" }}>
                    <th style={{ padding: "10px 0", width: "40px" }}>#</th>
                    <th style={{ padding: "10px 12px" }}>Description of Work / Material Scope</th>
                    <th style={{ padding: "10px 12px", width: "120px" }}>Category</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", width: "70px" }}>Qty</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", width: "90px" }}>Rate (₹)</th>
                    <th style={{ padding: "10px 0", textAlign: "right", width: "110px" }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedQuote.items.map((item, idx) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #E5E7EB" }}>
                      <td style={{ padding: "12px 0", color: "#9CA3AF" }}>{idx + 1}</td>
                      <td style={{ padding: "12px 12px", fontWeight: 500, color: "#1F2937" }}>{item.description}</td>
                      <td style={{ padding: "12px 12px", fontSize: "11px", color: "#6B7280" }}>{item.category}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right", color: "#4B5563" }}>{item.qty} {item.unit}</td>
                      <td style={{ padding: "12px 12px", textAlign: "right", color: "#4B5563" }}>{item.rate.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 700, color: "#111827" }}>
                        {(item.qty * item.rate).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculations Box */}
              {(() => {
                const { subtotal, discount, taxable, tax, grandTotal } = calculateTotals(selectedQuote);
                return (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
                    <div style={{ width: "320px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#6B7280" }}>
                        <span>Subtotal:</span>
                        <span style={{ fontWeight: 600, color: "#111827" }}>₹{subtotal.toLocaleString("en-IN")}</span>
                      </div>
                      {selectedQuote.discountPercent > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#059669" }}>
                          <span>Discount ({selectedQuote.discountPercent}%):</span>
                          <span>- ₹{discount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#6B7280" }}>
                        <span>Taxable Value:</span>
                        <span style={{ fontWeight: 600, color: "#111827" }}>₹{taxable.toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#6B7280" }}>
                        <span>GST ({selectedQuote.taxPercent}%):</span>
                        <span style={{ fontWeight: 600, color: "#111827" }}>₹{tax.toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ borderTop: "2px solid #111827", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: "#111827" }}>
                        <span>Grand Total:</span>
                        <span style={{ color: "#B8975A" }}>₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Terms / Notes */}
              <div style={{ background: "#F9FAFB", padding: "16px 20px", borderRadius: "8px", fontSize: "12px", color: "#4B5563", lineHeight: 1.6, marginBottom: "36px" }}>
                <strong>Terms & Execution Notes:</strong> {selectedQuote.notes}
                <div style={{ marginTop: "6px", color: "#9CA3AF" }}>
                  • Payment Milestones: 10% Advance Booking, 40% Design & Procurement Sign-off, 30% Civil/MEP stage, 20% on Quality Inspection & Handover.
                </div>
              </div>

              {/* Signature stamp */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: "20px", borderTop: "1px solid #E5E7EB" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "uppercase" }}>Client Acceptance Signature</div>
                  <div style={{ width: "200px", borderBottom: "1px dashed #9CA3AF", marginTop: "36px" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1C1C1C" }}>For The Bright Space Interiors</div>
                  <div style={{ fontSize: "12px", color: "#B8975A", marginTop: "2px" }}>Mohd Mushir · Principal Designer</div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "18px" }}>Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / New Modal */}
      {editModal !== null && (
        <QuoteEditorModal
          initial={editModal === "new" ? null : editModal}
          onClose={() => setEditModal(null)}
          onSave={handleSaveQuote}
        />
      )}
    </div>
  );
}

function QuoteEditorModal({
  initial,
  onClose,
  onSave,
}: {
  initial: Quotation | null;
  onClose: () => void;
  onSave: (q: Quotation) => void;
}) {
  const [form, setForm] = useState<Quotation>(
    initial || {
      id: `q-${Date.now()}`,
      quoteNo: `BSI-QT-2024-${Math.floor(100 + Math.random() * 900)}`,
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      projectTitle: "",
      location: "New Delhi",
      date: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "Draft",
      discountPercent: 0,
      taxPercent: 18,
      notes: "Quotation valid for 30 days. Material specifications governed by approved 3D renders.",
      items: [
        { id: "i-1", description: "Design, 3D concept & turnkey civil planning", category: "Design & Supervision", qty: 1, unit: "lump sum", rate: 50000 },
      ],
    }
  );

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { id: `i-${Date.now()}`, description: "", category: "Woodwork & Modular", qty: 1, unit: "units", rate: 0 },
      ],
    });
  };

  const removeItem = (id: string) => {
    setForm({ ...form, items: form.items.filter((i) => i.id !== id) });
  };

  const updateItem = (id: string, field: keyof QuoteItem, val: any) => {
    setForm({
      ...form,
      items: form.items.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div
        style={{
          position: "relative",
          background: "#FFF",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "32px",
          zIndex: 1,
        }}
      >
        <h3 style={{ margin: "0 0 20px", fontSize: "20px", fontWeight: 700, color: "#111827" }}>
          {initial ? "Edit Quotation" : "Create New Quotation"}
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Quote Number</label>
            <input
              value={form.quoteNo}
              onChange={(e) => setForm({ ...form, quoteNo: e.target.value })}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
            >
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Client Name</label>
            <input
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder="e.g. Manish Singh"
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Client Phone</label>
            <input
              value={form.clientPhone}
              onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              placeholder="+91..."
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Project Title</label>
            <input
              value={form.projectTitle}
              onChange={(e) => setForm({ ...form, projectTitle: e.target.value })}
              placeholder="e.g. Park View City 3BHK"
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Gurugram, Delhi NCR"
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Items */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700 }}>Line Items ({form.items.length})</span>
            <button
              type="button"
              onClick={addItem}
              style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "6px 12px", background: "#F3F4F6", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          {form.items.map((item) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "3fr 1.5fr 1fr 1fr auto", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
              <input
                placeholder="Description of work"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                style={{ padding: "8px 10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "12px" }}
              />
              <select
                value={item.category}
                onChange={(e) => updateItem(item.id, "category", e.target.value)}
                style={{ padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "12px" }}
              >
                <option value="Civil">Civil</option>
                <option value="Woodwork & Modular">Woodwork & Modular</option>
                <option value="Electrical & MEP">Electrical & MEP</option>
                <option value="Painting & Finishes">Painting & Finishes</option>
                <option value="Design & Supervision">Design & Supervision</option>
              </select>
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                style={{ padding: "8px 10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "12px" }}
              />
              <input
                type="number"
                placeholder="Rate (₹)"
                value={item.rate}
                onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                style={{ padding: "8px 10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "12px" }}
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                style={{ padding: "8px", color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer controls */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{ padding: "10px 18px", background: "#F3F4F6", border: "none", borderRadius: "6px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            style={{ padding: "10px 22px", background: "linear-gradient(135deg, #B8975A, #8F723E)", color: "#FFF", border: "none", borderRadius: "6px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
          >
            Save Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
