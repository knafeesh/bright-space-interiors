"use client";
import { useState } from "react";
import {
  Database,
  Download,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  FileJson,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function BackupPage() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Feedback states
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [importResult, setImportResult] = useState<any | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const notifyError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 6000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bright-space-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      notify("Site Store JSON successfully exported and downloaded!");
    } catch {
      notifyError("Failed to export site database backup.");
    } finally {
      setExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setJsonText(String(event.target?.result || ""));
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonText.trim()) {
      notifyError("Please select a JSON backup file or paste store JSON.");
      return;
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseErr) {
      notifyError("Invalid JSON syntax. Please check file formatting.");
      return;
    }

    if (!confirm("Are you sure you want to import this store? This will update content in Firestore and revalidate live public pages.")) {
      return;
    }

    setImporting(true);
    setImportResult(null);
    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setImportResult(data);
        notify("Database store imported and saved to Firestore successfully!");
      } else {
        notifyError(data.error || "Import validation failed.");
      }
    } catch {
      notifyError("Network error while importing backup.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px" }}>
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
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "28px",
            fontWeight: 500,
            color: "#F6F5F2",
            margin: "0 0 4px 0",
          }}
        >
          Database Backup & Migration
        </h1>
        <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
          Export your complete site store to a verified JSON snapshot, or restore content with strict schema validation.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Card 1: Export */}
        <div
          style={{
            background: "#161920",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <Download size={20} color="#C5A880" />
            <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#F3F4F6", margin: 0 }}>
              Export Store JSON
            </h2>
          </div>

          <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5, marginBottom: "20px" }}>
            Generate a full snapshot of all projects, 6-service homepage split sections, detailed service pages, 32 design ideas categories, testimonials, team members, site settings, and page SEO.
          </p>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="admin-btn admin-btn--gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
          >
            {exporting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={16} />}
            <span>{exporting ? "Generating Snapshot..." : "Export Store JSON"}</span>
          </button>
        </div>

        {/* Card 2: Import */}
        <div
          style={{
            background: "#161920",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <Upload size={20} color="#C5A880" />
            <h2 style={{ fontSize: "17px", fontWeight: 600, color: "#F3F4F6", margin: 0 }}>
              Import & Restore Store JSON
            </h2>
          </div>

          <p style={{ fontSize: "13px", color: "#9CA3AF", lineHeight: 1.5, marginBottom: "20px" }}>
            Upload a valid JSON backup file. All entities will be verified against our schema before being written to Firestore.
          </p>

          <form onSubmit={handleImport} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label className="admin-label">Upload JSON File</label>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="admin-input"
                style={{ padding: "8px" }}
              />
            </div>

            <div>
              <label className="admin-label">Or Paste Store JSON Content</label>
              <textarea
                rows={6}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="admin-input"
                placeholder='{"site": "Bright Space Interiors", "store": { ... }}'
                style={{ fontFamily: "monospace", fontSize: "12px" }}
              />
            </div>

            {importResult && (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "8px",
                  padding: "16px",
                  color: "#D1D5DB",
                  fontSize: "13px",
                }}
              >
                <div style={{ color: "#10B981", fontWeight: 600, marginBottom: "6px" }}>
                  ✓ {importResult.message}
                </div>
                {importResult.counts && (
                  <div>
                    Restored: {importResult.counts.projects} projects, {importResult.counts.navServices} services, {importResult.counts.categories} categories, {importResult.counts.testimonials} testimonials, {importResult.counts.team} team members.
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={importing || !jsonText.trim()}
                className="admin-btn admin-btn--gold"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
              >
                {importing ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={16} />}
                <span>{importing ? "Validating & Restoring..." : "Validate & Import Store"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
