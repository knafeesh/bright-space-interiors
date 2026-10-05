"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogin from "@/components/admin/AdminLogin";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Image,
  FileText,
  Star,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  FolderKanban,
  Receipt,
  Images,
} from "lucide-react";

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
    label: "Main",
    links: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/leads", label: "Lead Management", icon: Users },
      { href: "/admin/quotations", label: "Quotations & BOQ", icon: Receipt },
      { href: "/admin/projects", label: "Project Management", icon: FolderKanban },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/admin/portfolio", label: "Portfolio Manager", icon: Image },
      { href: "/admin/media", label: "Media Library", icon: Images },
      { href: "/admin/services", label: "Services Manager", icon: FileText },
      { href: "/admin/testimonials", label: "Testimonials", icon: Star },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/reports", label: "Reports", icon: BarChart2 },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/leads": "Lead Management",
  "/admin/quotations": "Quotation & BOQ Builder",
  "/admin/projects": "Project Management",
  "/admin/portfolio": "Portfolio Manager",
  "/admin/media": "Media Library",
  "/admin/services": "Services Manager",
  "/admin/testimonials": "Client Testimonials",
  "/admin/reports": "Analytics & Reports",
  "/admin/settings": "System Settings",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication in localStorage and sessionStorage
    const localAuth = typeof window !== "undefined" && localStorage.getItem("bs_admin_authenticated") === "true";
    const sessionAuth = typeof window !== "undefined" && sessionStorage.getItem("bs_admin_authenticated") === "true";
    setIsAuthenticated(localAuth || sessionAuth);
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bs_admin_authenticated");
      localStorage.removeItem("bs_admin_user");
      sessionStorage.removeItem("bs_admin_authenticated");
    }
    setIsAuthenticated(false);
  };

  // While checking auth on initial render, show sleek dark background to prevent layout flicker
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

  // If not authenticated, display login screen directly without hint
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
          <div>
            <div className="admin-sidebar__brand-name">Bright Space</div>
            <div className="admin-sidebar__brand-sub">Admin Panel</div>
          </div>
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
              {group.links.map(({ href, label, icon: Icon, badge }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`admin-nav-link${pathname === href ? " admin-nav-link--active" : ""}`}
                  id={`admin-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className="admin-nav-link__icon" />
                  {label}
                  {badge && <span className="admin-nav-link__badge">{badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" target="_blank" className="admin-nav-link" id="admin-view-site">
            <ExternalLink className="admin-nav-link__icon" />
            View Live Website
          </Link>
          <button
            onClick={handleSignOut}
            className="admin-nav-link"
            style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
            id="admin-logout"
          >
            <LogOut className="admin-nav-link__icon" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
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
            <div className="admin-topbar__notification" id="admin-notifications" title="8 unread notifications">
              <Bell size={16} />
              <div className="admin-topbar__notification-dot" />
            </div>
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

        {/* Page Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

