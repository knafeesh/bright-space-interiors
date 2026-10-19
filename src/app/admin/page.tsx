"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Sparkles,
  Images,
  Star,
  Users,
  Mail,
  Settings,
  Globe,
  Database,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
  Plus,
} from "lucide-react";

interface DashboardData {
  projects: number;
  projectsPublished: number;
  navServices: number;
  categories: number;
  designCards: number;
  media: number;
  testimonials: number;
  team: number;
  enquiriesTotal: number;
  enquiriesNew: number;
  recentEnquiries: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    projects: 12,
    projectsPublished: 12,
    navServices: 6,
    categories: 32,
    designCards: 120,
    media: 25,
    testimonials: 6,
    team: 4,
    enquiriesTotal: 0,
    enquiriesNew: 0,
    recentEnquiries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [contentRes, enquiriesRes] = await Promise.all([
          fetch("/api/admin/content", { cache: "no-store" }),
          fetch("/api/admin/enquiries", { cache: "no-store" }),
        ]);

        const content = await contentRes.json();
        const enquiriesData = await enquiriesRes.json();

        if (content.success && content.store) {
          const store = content.store;
          const projects = store.projects || [];
          const publishedProjects = projects.filter((p: any) => p.status === "published").length;
          const categories = store.categories || [];
          let designCount = 0;
          categories.forEach((c: any) => {
            designCount += (c.designs || []).length;
          });

          const enquiries = enquiriesData.enquiries || [];
          const newEnquiries = enquiries.filter((e: any) => (e.status || "New") === "New").length;

          setData({
            projects: projects.length,
            projectsPublished: publishedProjects,
            navServices: store.navServices?.length || 6,
            categories: categories.length,
            designCards: designCount,
            media: store.media?.length || 0,
            testimonials: store.testimonials?.length || 6,
            team: store.team?.length || 4,
            enquiriesTotal: enquiries.length,
            enquiriesNew: newEnquiries,
            recentEnquiries: enquiries.slice(0, 5),
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      label: "Portfolio Projects",
      count: data.projects,
      sub: `${data.projectsPublished} Published on Site`,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "#DFBE99",
    },
    {
      label: "Core Services",
      count: data.navServices,
      sub: "Homepage Split Accordion",
      icon: FileText,
      href: "/admin/services",
      color: "#60A5FA",
    },
    {
      label: "Design Categories",
      count: data.categories,
      sub: `${data.designCards} Total Design Cards`,
      icon: Sparkles,
      href: "/admin/categories",
      color: "#F472B6",
    },
    {
      label: "Customer Enquiries",
      count: data.enquiriesTotal,
      sub: `${data.enquiriesNew} New Enquiries`,
      icon: Mail,
      href: "/admin/enquiries",
      color: "#34D399",
      badge: data.enquiriesNew > 0 ? `${data.enquiriesNew} New` : undefined,
    },
    {
      label: "Media Assets",
      count: data.media,
      sub: "Storage Images & Photos",
      icon: Images,
      href: "/admin/media",
      color: "#A78BFA",
    },
    {
      label: "Client Testimonials",
      count: data.testimonials,
      sub: "Published Reviews",
      icon: Star,
      href: "/admin/testimonials",
      color: "#FBBF24",
    },
    {
      label: "Team Members",
      count: data.team,
      sub: "Studio Leadership",
      icon: Users,
      href: "/admin/team",
      color: "#38BDF8",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #181c24 0%, #12141a 100%)",
          border: "1px solid rgba(197, 168, 128, 0.2)",
          borderRadius: "14px",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif, serif)",
              fontSize: "26px",
              fontWeight: 600,
              color: "#F6F5F2",
              margin: "0 0 6px 0",
            }}
          >
            Welcome, Azam Khan
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#9CA3AF" }}>
            Bright Space Interiors Administrative Central Hub. Every section syncs live to Firestore and the public website.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/admin/projects"
            className="admin-btn admin-btn--gold"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={16} /> Manage Projects
          </Link>
          <Link
            href="/"
            target="_blank"
            className="admin-btn admin-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <ExternalLink size={14} /> View Live Site
          </Link>
        </div>
      </div>

      {/* Simple Counts Grid */}
      <div>
        <h2
          style={{
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#C5A880",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          Overview Counts
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "16px",
          }}
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                style={{
                  background: "#161920",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  padding: "20px",
                  textDecoration: "none",
                  transition: "transform 0.2s, border-color 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(197, 168, 128, 0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#9CA3AF" }}>{card.label}</span>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.color,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                    {loading ? "..." : card.count}
                  </div>
                  <div style={{ fontSize: "12px", color: card.badge ? "#10B981" : "#6B7280", fontWeight: card.badge ? 600 : 400 }}>
                    {card.sub}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation & Recent Enquiries */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Quick Actions */}
        <div
          style={{
            background: "#161920",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#F3F4F6",
              marginBottom: "16px",
              fontFamily: "var(--font-serif, serif)",
            }}
          >
            Quick Management Links
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              href="/admin/services"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                color: "#E5E7EB",
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              <span>Edit Homepage 6 Services (Split Accordion)</span>
              <ArrowRight size={14} color="#C5A880" />
            </Link>

            <Link
              href="/admin/media"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                color: "#E5E7EB",
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              <span>Design Philosophy Carousel & Image Uploads</span>
              <ArrowRight size={14} color="#C5A880" />
            </Link>

            <Link
              href="/admin/settings"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                color: "#E5E7EB",
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              <span>Site Settings (Phones, WhatsApp, Socials)</span>
              <ArrowRight size={14} color="#C5A880" />
            </Link>

            <Link
              href="/admin/seo"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                color: "#E5E7EB",
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              <span>Page SEO, Canonical URLs & Phone Validation</span>
              <ArrowRight size={14} color="#C5A880" />
            </Link>

            <Link
              href="/admin/backup"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                color: "#E5E7EB",
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              <span>Export / Import Entire Site Store (Backup)</span>
              <ArrowRight size={14} color="#C5A880" />
            </Link>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div
          style={{
            background: "#161920",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#F3F4F6",
                margin: 0,
                fontFamily: "var(--font-serif, serif)",
              }}
            >
              Recent Customer Enquiries
            </h3>
            <Link
              href="/admin/enquiries"
              style={{ fontSize: "12px", color: "#C5A880", textDecoration: "none", fontWeight: 500 }}
            >
              View All ({data.enquiriesTotal})
            </Link>
          </div>

          {data.recentEnquiries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: "#6B7280", fontSize: "13px" }}>
              No inquiries yet. New submissions from website contact forms will appear here in real-time.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {data.recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  style={{
                    padding: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#F3F4F6" }}>{enq.name}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF" }}>
                      {enq.phone} • {enq.projectType || enq.project} • {enq.location}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      background:
                        enq.status === "Won"
                          ? "rgba(16, 185, 129, 0.2)"
                          : enq.status === "Contacted"
                          ? "rgba(59, 130, 246, 0.2)"
                          : "rgba(245, 158, 11, 0.2)",
                      color:
                        enq.status === "Won"
                          ? "#34D399"
                          : enq.status === "Contacted"
                          ? "#60A5FA"
                          : "#FBBF24",
                    }}
                  >
                    {enq.status || "New"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
