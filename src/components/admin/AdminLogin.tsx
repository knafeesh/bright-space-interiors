"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUsername, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("bs_admin_authenticated", "true");
        localStorage.setItem("bs_admin_user", JSON.stringify(data.user));
        sessionStorage.setItem("bs_admin_authenticated", "true");
        onLoginSuccess();
      } else {
        setError(data.error || "Invalid username or password. Please try again.");
      }
    } catch (err) {
      // Fallback client check if API unreachable
      if (
        (trimmedUsername === "Azam" || trimmedUsername.toLowerCase() === "azam") &&
        password === "Azam@2005"
      ) {
        localStorage.setItem("bs_admin_authenticated", "true");
        localStorage.setItem(
          "bs_admin_user",
          JSON.stringify({ username: "Azam", name: "Azam Khan", role: "Super Admin" })
        );
        sessionStorage.setItem("bs_admin_authenticated", "true");
        onLoginSuccess();
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 25%, #181c24 0%, #0d0f13 100%)",
        padding: "24px",
        fontFamily: "var(--font-sans, system-ui, -apple-system, sans-serif)",
        position: "relative",
      }}
    >
      {/* Decorative ambient elements */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "480px",
          height: "240px",
          background: "radial-gradient(ellipse, rgba(197, 168, 128, 0.09) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#12141A",
          borderRadius: "16px",
          border: "1px solid rgba(197, 168, 128, 0.22)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(197, 168, 128, 0.05)",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top Gold Accent Bar */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg, #9C7A4A 0%, #DFBE99 50%, #9C7A4A 100%)",
          }}
        />

        <div style={{ padding: "40px 36px 36px" }}>
          {/* Brand Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <img
                src="/logo.png"
                alt="Bright Space Interiors Official Logo"
                width={72}
                height={72}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  objectFit: "contain",
                  boxShadow: "0 0 28px rgba(197, 168, 128, 0.28)",
                }}
              />
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                fontSize: "24px",
                fontWeight: 600,
                color: "#F6F5F2",
                letterSpacing: "0.02em",
                margin: "0 0 6px 0",
              }}
            >
              Bright Space
            </h1>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C5A880",
                margin: 0,
                fontWeight: 600,
              }}
            >
              Admin Portal Authentication
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#FCA5A5",
                fontSize: "13px",
                marginBottom: "24px",
                lineHeight: 1.4,
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label
                htmlFor="admin-username"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#D1D5DB",
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                >
                  <User size={18} />
                </span>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 14px 13px 44px",
                    background: "#181B22",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C5A880";
                    e.target.style.boxShadow = "0 0 0 3px rgba(197, 168, 128, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#D1D5DB",
                  marginBottom: "8px",
                  letterSpacing: "0.04em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    pointerEvents: "none",
                  }}
                >
                  <Lock size={18} />
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 46px 13px 44px",
                    background: "#181B22",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C5A880";
                    e.target.style.boxShadow = "0 0 0 3px rgba(197, 168, 128, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9CA3AF",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              disabled={loading}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #DFBE99 0%, #C5A880 50%, #A27B42 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#0F1115",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                cursor: loading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "opacity 0.2s, transform 0.2s",
                boxShadow: "0 6px 18px rgba(197, 168, 128, 0.25)",
                opacity: loading ? 0.75 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.opacity = "0.95";
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              <span>{loading ? "Authenticating..." : "Sign In to Admin Portal"}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Footer Back link */}
          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              textAlign: "center",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#9CA3AF",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#DFBE99")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#9CA3AF")}
            >
              <ArrowLeft size={14} />
              <span>Back to Main Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
