"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Sparkles,
  Images,
  Star,
  Users,
  Settings,
  Globe,
  Mail,
  Database,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Loader2,
  Check,
  AlertCircle,
  Cloud,
} from "lucide-react";
import { CMS_SAVE_STATUS_EVENT, type CmsSaveStatus } from "@/lib/cms";

interface NavLinkItem {
  href: string;
  label: string;
  icon: any;
  badge?: string;
}

interface NavGroupItem {
  label: string;
  links: NavLinkItem[];
}

const NAV_GROUPS: NavGroupItem[] = [
  {
    label: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
    ],
  },
  {
    label: "Website Content",
    links: [
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/services", label: "Services", icon: FileText },
      { href: "/admin/categories", label: "Categories", icon: Sparkles },
      { href: "/admin/media", label: "Gallery / Images", icon: Images },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
      { href: "/admin/team", label: "Team", icon: Users },
    ],
  },
  {
    label: "Site & SEO",
    links: [
      { href: "/admin/settings", label: "Site Settings", icon: Settings },
      { href: "/admin/seo", label: "Page SEO", icon: Globe },
      { href: "/admin/backup", label: "Backup", icon: Database },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/enquiries": "Customer Enquiries & Leads",
  "/admin/leads": "Customer Enquiries & Leads",
  "/admin/projects": "Portfolio Projects Management",
  "/admin/portfolio": "Portfolio Projects Management",
  "/admin/services": "Services Management (Homepage & Detailed)",
  "/admin/categories": "Design Ideas Categories & Cards",
  "/admin/design-ideas": "Design Ideas Categories & Cards",
  "/admin/media": "Media Gallery & Assets",
  "/admin/testimonials": "Client Testimonials",
  "/admin/team": "Team Members",
  "/admin/settings": "Site Settings (Phone, Address, Socials)",
  "/admin/seo": "Page SEO & Canonical Meta",
  "/admin/backup": "Backup & JSON Store (Export / Import)",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [saveStatus, setSaveStatus] = useState<CmsSaveStatus | null>(null);
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; text: string; mode?: string }>({
    configured: false,
    text: "Connecting...",
  });

  useEffect(() => {
    // 1. Initial local auth check
    const localAuth = typeof window !== "undefined" && localStorage.getItem("bs_admin_authenticated") === "true";
    const sessionAuth = typeof window !== "undefined" && sessionStorage.getItem("bs_admin_authenticated") === "true";
    setIsAuthenticated(localAuth || sessionAuth);

    // 2. Validate cookie session with server
    fetch("/api/admin/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.authenticated === "boolean") {
          setIsAuthenticated(data.authenticated);
          if (!data.authenticated) {
            localStorage.removeItem("bs_admin_authenticated");
            sessionStorage.removeItem("bs_admin_authenticated");
          }
        }
      })
      .catch(() => {});

    // Check storage configuration
    fetch("/api/admin/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.isFirebaseConfigured) {
          setDbStatus({ configured: true, text: "Firestore Cloud Connected", mode: "firestore" });
        } else if (data?.isVercel || data?.storageMode === "ephemeral_tmp") {
          setDbStatus({ configured: false, text: "⚠️ Temporary Memory (Vercel)", mode: "ephemeral_tmp" });
        } else if (data?.success) {
          setDbStatus({ configured: true, text: "Local Disk Store (Dev)", mode: "local_disk" });
        } else {
          setDbStatus({ configured: false, text: "Storage Offline", mode: "offline" });
        }
      })
      .catch(() => {
        setDbStatus({ configured: false, text: "Storage Ready" });
      });

    // 3. Listen to live save status across admin panels
    const handleSaveStatus = (e: Event) => {
      const detail = (e as CustomEvent<CmsSaveStatus>).detail;
      if (detail) {
        setSaveStatus(detail);
        if (detail.state === "saved") {
          setTimeout(() => setSaveStatus(null), 3500);
        }
      }
    };
    window.addEventListener(CMS_SAVE_STATUS_EVENT, handleSaveStatus);
    return () => {
      window.removeEventListener(CMS_SAVE_STATUS_EVENT, handleSaveStatus);
    };
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bs_admin_authenticated");
      localStorage.removeItem("bs_admin_user");
      sessionStorage.removeItem("bs_admin_authenticated");
    }
    fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D0F13",
          color: "#DFBE99",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              border: "3px solid rgba(197, 168, 128, 0.2)",
              borderTopColor: "#C5A880",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, color: "#9CA3AF" }}>
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const currentTitle = PAGE_TITLES[pathname] || "Admin Portal";

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 90,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${mobileMenuOpen ? "admin-sidebar--mobile-open" : ""}`}
        style={mobileMenuOpen ? { display: "flex", position: "fixed", top: 0, left: 0, zIndex: 100, width: "260px" } : {}}
      >
        <div className="admin-sidebar__brand" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }} title="Go to Website Homepage">
            <img
              src="/logo.png"
              alt="Bright Space Interiors"
              width={36}
              height={36}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <div>
              <div className="admin-sidebar__brand-name">Bright Space</div>
              <div className="admin-sidebar__brand-sub">Admin Panel</div>
            </div>
          </Link>
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className="admin-sidebar__section">{group.label}</div>
              {group.links.map(({ href, label, icon: Icon, badge }) => {
                const isActive = pathname === href || (href === "/admin/projects" && pathname === "/admin/portfolio") || (href === "/admin/categories" && pathname === "/admin/design-ideas") || (href === "/admin/enquiries" && pathname === "/admin/leads");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`admin-nav-link${isActive ? " admin-nav-link--active" : ""}`}
                    id={`admin-nav-${label.toLowerCase().replace(/[\s\/]+/g, "-")}`}
                  >
                    <Icon className="admin-nav-link__icon" size={18} />
                    <span>{label}</span>
                    {badge && <span className="admin-nav-link__badge">{badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" target="_blank" className="admin-nav-link" id="admin-view-site">
            <ExternalLink className="admin-nav-link__icon" size={18} />
            <span>View Live Website</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="admin-nav-link"
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
            id="admin-logout"
          >
            <LogOut className="admin-nav-link__icon" size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar__title">
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "none",
                alignItems: "center",
                color: "var(--charcoal)",
                marginRight: "8px",
              }}
              className="admin-menu-toggle"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <span>{currentTitle}</span>
          </div>

          <div className="admin-topbar__right">
            {/* Live Firestore / Persistence Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "16px",
                fontSize: "11px",
                fontWeight: 600,
                background:
                  dbStatus.mode === "firestore"
                    ? "rgba(16, 185, 129, 0.12)"
                    : dbStatus.mode === "ephemeral_tmp"
                    ? "rgba(245, 158, 11, 0.15)"
                    : "rgba(197, 168, 128, 0.12)",
                color:
                  dbStatus.mode === "firestore"
                    ? "#059669"
                    : dbStatus.mode === "ephemeral_tmp"
                    ? "#D97706"
                    : "#9C7A4A",
                border: `1px solid ${
                  dbStatus.mode === "firestore"
                    ? "rgba(16, 185, 129, 0.25)"
                    : dbStatus.mode === "ephemeral_tmp"
                    ? "rgba(245, 158, 11, 0.35)"
                    : "rgba(197, 168, 128, 0.25)"
                }`,
              }}
              title={
                dbStatus.mode === "ephemeral_tmp"
                  ? "Live site is running in temporary memory. Add Firebase environment variables in Vercel to persist permanently."
                  : "Persistent Storage Status"
              }
            >
              <Cloud size={12} />
              <span>{dbStatus.text}</span>
            </div>

            {saveStatus && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background:
                    saveStatus.state === "saving"
                      ? "rgba(197, 168, 128, 0.15)"
                      : saveStatus.state === "saved"
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(239, 68, 68, 0.15)",
                  color:
                    saveStatus.state === "saving"
                      ? "#A27B42"
                      : saveStatus.state === "saved"
                      ? "#059669"
                      : "#DC2626",
                  border: `1px solid ${
                    saveStatus.state === "saving"
                      ? "rgba(197, 168, 128, 0.3)"
                      : saveStatus.state === "saved"
                      ? "rgba(16, 185, 129, 0.3)"
                      : "rgba(239, 68, 68, 0.3)"
                  }`,
                }}
              >
                {saveStatus.state === "saving" && (
                  <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                )}
                {saveStatus.state === "saved" && <Check size={12} />}
                {saveStatus.state === "error" && <AlertCircle size={12} />}
                <span>
                  {saveStatus.state === "saving"
                    ? "Updating live site..."
                    : saveStatus.state === "saved"
                    ? "Live Synced"
                    : "Sync Failed"}
                </span>
              </div>
            )}

            <div className="admin-topbar__user">
              <div className="admin-topbar__avatar">AK</div>
              <div>
                <div className="admin-topbar__user-name">Azam Khan</div>
                <div className="admin-topbar__user-role">Super Admin</div>
              </div>
              <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
            </div>
          </div>
        </header>

        {/* Temporary Ephemeral Warning Banner (Shown on Vercel when Firebase is not connected) */}
        {dbStatus.mode === "ephemeral_tmp" && (
          <div
            style={{
              background: "#451A03",
              color: "#FDE68A",
              padding: "10px 24px",
              fontSize: "12px",
              borderBottom: "1px solid rgba(245, 158, 11, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={16} color="#F59E0B" />
              <span>
                <strong>Storage Notice:</strong> Live website is running on temporary serverless memory. Edits or deleted images will reset on server restart. To make updates permanent, add Firebase credentials in Vercel.
              </span>
            </div>
            <Link
              href="/admin/backup"
              style={{
                color: "#FDE68A",
                textDecoration: "underline",
                fontWeight: 600,
                fontSize: "11px",
              }}
            >
              Export Backup / Firebase Guide →
            </Link>
          </div>
        )}

        {/* Page Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
