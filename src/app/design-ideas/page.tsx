"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Search, ChevronRight } from "lucide-react";
import { DESIGN_CATEGORIES, CATEGORY_GROUPS } from "@/lib/design-ideas-data";

export default function DesignIdeasHubPage() {
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    return DESIGN_CATEGORIES.filter((cat) => {
      const matchesGroup = selectedGroup === "All" || cat.group === selectedGroup;
      const matchesSearch =
        searchQuery.trim() === "" ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.heroTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.designs.some((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, searchQuery]);

  return (
    <main style={{ background: "var(--ivory, #FAF7F2)", minHeight: "100vh" }}>
      {/* ══════════════ HERO SECTION ══════════════ */}
      <section
        style={{
          position: "relative",
          minHeight: "380px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          padding: "130px 24px 60px",
          background:
            "linear-gradient(180deg, rgba(28,24,22,0.85) 0%, rgba(28,24,22,0.95) 100%), url('/images/hero-luxury.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "16px",
            }}
          >
            <Link href="/" style={{ color: "rgba(255, 255, 255, 0.8)", textDecoration: "none" }}>
              Home
            </Link>
            <ChevronRight size={13} style={{ color: "var(--gold, #B8975A)" }} />
            <span style={{ color: "var(--gold-light, #DFC59E)", fontWeight: 600 }}>
              Design Ideas
            </span>
          </nav>

          <span
            style={{
              color: "var(--gold, #B8975A)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Inspiration Gallery
          </span>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(30px, 4.5vw, 50px)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              margin: "0 0 16px",
              textTransform: "uppercase",
            }}
          >
            Explore All 32 Design Categories
          </h1>
          <div className="title-line--center title-line" style={{ background: "var(--gold, #B8975A)" }} />
          <p
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "clamp(15px, 1.2vw, 17px)",
              lineHeight: 1.6,
              maxWidth: "680px",
              margin: "18px auto 0",
            }}
          >
            From bespoke crockery units and modular kitchens to luxury suites and commercial spaces, discover curated interior design concepts crafted for modern lifestyles.
          </p>
        </div>
      </section>

      {/* ══════════════ FILTER & SEARCH CONTROLS ══════════════ */}
      <section
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "40px clamp(16px, 4vw, 36px) 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Search Input */}
          <div
            style={{
              maxWidth: "460px",
              width: "100%",
              position: "relative",
              alignSelf: "center",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--gold-dark, #8C7148)",
              }}
            />
            <input
              type="text"
              placeholder="Search design categories (e.g. Crockery, Kitchen, Wallpaper)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 18px 13px 44px",
                borderRadius: "30px",
                border: "1px solid rgba(184, 151, 90, 0.35)",
                background: "#FFFFFF",
                fontSize: "14px",
                color: "var(--charcoal, #1C1C1C)",
                outline: "none",
                boxShadow: "0 2px 10px rgba(28, 24, 22, 0.04)",
              }}
            />
          </div>

          {/* Group Filter Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {CATEGORY_GROUPS.map((group) => {
              const active = selectedGroup === group;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  type="button"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: active ? "1px solid var(--gold, #B8975A)" : "1px solid rgba(184, 151, 90, 0.25)",
                    background: active ? "var(--charcoal, #1C1C1C)" : "#FFFFFF",
                    color: active ? "var(--gold-light, #DFC59E)" : "var(--charcoal, #1C1C1C)",
                    fontSize: "11.5px",
                    fontWeight: active ? 600 : 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>

        {/* ══════════════ CATEGORY CARDS GRID ══════════════ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gap: "24px",
            marginBottom: "80px",
          }}
        >
          {filteredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/design-ideas/${category.slug}`}
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(184, 151, 90, 0.22)",
                boxShadow: "0 4px 16px rgba(28, 24, 22, 0.05)",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              className="hub-category-card"
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  background: "var(--ivory-dark, #ECE6DE)",
                }}
              >
                <img
                  src={category.heroImage}
                  alt={category.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "rgba(28, 24, 22, 0.78)",
                    backdropFilter: "blur(4px)",
                    color: "var(--gold-light, #DFC59E)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    border: "1px solid rgba(184, 151, 90, 0.35)",
                  }}
                >
                  {category.group}
                </span>
              </div>

              <div
                style={{
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                      fontSize: "19px",
                      fontWeight: 600,
                      color: "var(--charcoal, #1C1C1C)",
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {category.name}
                  </h2>
                  <p
                    style={{
                      fontSize: "12.5px",
                      color: "var(--charcoal-muted, #666059)",
                      margin: "0 0 14px",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {category.heroSubtitle}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid rgba(220, 214, 204, 0.5)",
                    fontSize: "11.5px",
                    color: "var(--gold-dark, #8C7148)",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>{category.designs.length} Curated Designs</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    View Gallery <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
