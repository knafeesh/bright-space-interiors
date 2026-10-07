"use client";

import { useState, useRef } from "react";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import { cmsAddMedia } from "@/lib/cms";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "Projects" | "Services" | "Hero" | "Team" | "Renders";
  placeholder?: string;
  required?: boolean;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "Projects",
  placeholder = "/images/... or upload a photo",
  required = false,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      const uploadedUrl = data.url;
      onChange(uploadedUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Also register into Media Library so admin can reuse it
      cmsAddMedia({
        id: `m-${Date.now()}`,
        name: file.name,
        url: uploadedUrl,
        folder,
        size: `${Math.round(file.size / 1024)} KB`,
        dimensions: "Uploaded Image",
        type: file.type.includes("png") ? "PNG" : file.type.includes("webp") ? "WebP" : "JPEG",
        altText: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        dateAdded: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text-secondary, #4B5563)",
            marginBottom: "6px",
          }}
        >
          {label}
        </label>
      )}

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {/* Thumbnail Preview */}
        <div
          style={{
            width: "60px",
            height: "46px",
            borderRadius: "6px",
            overflow: "hidden",
            background: "#1F2937",
            border: "1px solid #E5E7EB",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            <img
              src={value}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/images/hero-luxury.jpg";
              }}
            />
          ) : (
            <span style={{ fontSize: "10px", color: "#9CA3AF" }}>No img</span>
          )}
        </div>

        {/* Text Input for direct URL or path */}
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #E0E0E0",
            borderRadius: "6px",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #C5A880",
            background: uploading ? "#F3F4F6" : "rgba(197, 168, 128, 0.12)",
            color: uploading ? "#9CA3AF" : "#8A6D3B",
            fontWeight: 600,
            fontSize: "12px",
            cursor: uploading ? "wait" : "pointer",
            flexShrink: 0,
            transition: "all 0.15s ease",
          }}
          title="Upload image from computer"
        >
          {uploading ? (
            <>
              <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
              Uploading...
            </>
          ) : success ? (
            <>
              <Check size={13} style={{ color: "#10B981" }} />
              Uploaded!
            </>
          ) : (
            <>
              <Upload size={13} />
              Upload Image
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#DC2626",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
