"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  Eye,
  Film,
  Sparkles,
  Maximize2,
  Volume2,
} from "lucide-react";
import { PROJECT_VIDEOS, ProjectVideo, YOUTUBE_URL, WHATSAPP_NUMBER } from "@/lib/data";

const CATEGORIES = ["All", "Salon", "Residential", "Modular Kitchen", "Commercial", "Turnkey"];

function getYouTubeEmbedUrl(input?: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.includes("youtube.com/embed/")) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (/^[\w-]{11}$/.test(trimmed)) {
    return `https://www.youtube-nocookie.com/embed/${trimmed}?autoplay=1&rel=0&modestbranding=1`;
  }
  return null;
}

export default function ProjectVideosSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState<ProjectVideo | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredVideos =
    selectedCategory === "All"
      ? PROJECT_VIDEOS
      : PROJECT_VIDEOS.filter(
          (v) => v.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
  }, [filteredVideos]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(updateScrollButtons, 350);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    if (activeVideo) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideo]);

  return (
    <div
      style={{
        marginTop: "80px",
        paddingTop: "60px",
        borderTop: "1px solid rgba(44, 36, 32, 0.08)",
      }}
      id="project-videos-section"
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "38px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(184, 151, 98, 0.12)",
            color: "#8B6B38",
            border: "1px solid rgba(184, 151, 98, 0.28)",
            padding: "6px 16px",
            borderRadius: "50px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          <Sparkles size={13} />
          Virtual Walkthroughs & On-Site Tours
        </div>

        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(26px, 3.4vw, 40px)",
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#181615",
            margin: "0 0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "1.15em" }}>🎥</span> OUR PROJECT VIDEOS
        </h3>

        <p
          style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            color: "rgba(44, 36, 32, 0.72)",
            maxWidth: "680px",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Take a real virtual walkthrough of our executed salon flagships, bespoke residences, and turnkey modular kitchens across Delhi NCR.
        </p>

        {/* Filter Pills & Controls Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "32px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {/* Category Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "7px 18px",
                    borderRadius: "2px",
                    fontSize: "12px",
                    fontWeight: active ? 600 : 500,
                    letterSpacing: "0.06em",
                    border: active
                      ? "1px solid #B89762"
                      : "1px solid rgba(44, 36, 32, 0.14)",
                    background: active ? "#B89762" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#38312B",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: active
                      ? "0 4px 14px rgba(184, 151, 98, 0.25)"
                      : "0 1px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* YouTube Channel & Carousel Arrows */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginLeft: "auto",
            }}
          >
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                color: "#C5221F",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "2px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <Film size={14} />
              YouTube Channel
              <ExternalLink size={12} />
            </a>

            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Previous videos"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "2px",
                  border: "1px solid rgba(44, 36, 32, 0.16)",
                  background: canScrollLeft ? "#FFFFFF" : "#F0EDE6",
                  color: canScrollLeft ? "#1F1D1A" : "#B5AFA6",
                  cursor: canScrollLeft ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Next videos"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "2px",
                  border: "1px solid rgba(44, 36, 32, 0.16)",
                  background: canScrollRight ? "#FFFFFF" : "#F0EDE6",
                  color: canScrollRight ? "#1F1D1A" : "#B5AFA6",
                  cursor: canScrollRight ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Video Cards Horizontal Shelf / Slider ── */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        style={{
          display: "flex",
          gap: "24px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: "20px",
          scrollbarWidth: "thin",
          scrollbarColor: "#B89762 rgba(44,36,32,0.06)",
        }}
      >
        {filteredVideos.map((video, idx) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            style={{
              flex: "0 0 340px",
              scrollSnapAlign: "start",
              background: "#FFFFFF",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid rgba(44, 36, 32, 0.1)",
              boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
              cursor: "pointer",
              transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
              position: "relative",
            }}
            className="video-card-hover group"
          >
            {/* Thumbnail Box */}
            <div
              style={{
                position: "relative",
                aspectRatio: "16/10",
                overflow: "hidden",
                background: "#1E1A17",
              }}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease, filter 0.3s ease",
                  filter: "brightness(0.92)",
                }}
                className="group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(18, 15, 13, 0.85) 0%, rgba(18, 15, 13, 0.25) 50%, rgba(18, 15, 13, 0.45) 100%)",
                }}
              />

              {/* Top Badges */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  right: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    background: "rgba(0, 0, 0, 0.65)",
                    backdropFilter: "blur(4px)",
                    color: "#D4B87A",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "3px 9px",
                    borderRadius: "2px",
                    border: "1px solid rgba(212, 184, 122, 0.3)",
                  }}
                >
                  {video.tag || video.category}
                </span>

                <span
                  style={{
                    background: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(4px)",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "2px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Clock size={11} />
                  {video.duration}
                </span>
              </div>

              {/* ── Central Glowing Play Button ── */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(184, 151, 98, 0.95)",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 25px rgba(184, 151, 98, 0.65), 0 4px 12px rgba(0,0,0,0.3)",
                    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease",
                  }}
                  className="group-hover:scale-110"
                >
                  <Play size={22} fill="#FFFFFF" style={{ marginLeft: "3px" }} />
                </div>
              </div>

              {/* Video Number Watermark */}
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "12px",
                  zIndex: 2,
                  color: "rgba(255, 255, 255, 0.75)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                VIDEO {idx + 1}
              </div>
            </div>

            {/* Video Details Below */}
            <div style={{ padding: "18px 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8C7148",
                    fontWeight: 700,
                  }}
                >
                  {video.subtitle}
                </span>
                {video.views && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(44, 36, 32, 0.55)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <Eye size={12} />
                    {video.views}
                  </span>
                )}
              </div>

              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: 1.35,
                  color: "#181615",
                  margin: "0 0 8px",
                }}
              >
                {video.title}
              </h4>

              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.55,
                  color: "rgba(44, 36, 32, 0.7)",
                  margin: "0 0 16px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {video.description}
              </p>

              {/* Action Button: [ ▶ Watch Video ] */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(44, 36, 32, 0.08)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "#8B6B38",
                    textTransform: "uppercase",
                  }}
                >
                  <Play size={13} fill="#8B6B38" />
                  Watch Video
                </span>

                {video.projectSlug && (
                  <Link
                    href={`/portfolio/${video.projectSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: "11px",
                      color: "rgba(44, 36, 32, 0.6)",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    View Project
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sub-bar: Schedule a Live Site Walkthrough or Video Consultation ── */}
      <div
        style={{
          marginTop: "30px",
          background: "linear-gradient(135deg, #1C1917 0%, #2A231E 100%)",
          borderRadius: "4px",
          padding: "24px 32px",
          color: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "0 10px 30px rgba(28, 25, 23, 0.15)",
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <h4
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "20px",
              fontWeight: 500,
              color: "#FAF7F2",
              margin: "0 0 6px",
              letterSpacing: "0.04em",
            }}
          >
            Want a Live Video Walkthrough or Site Consultation?
          </h4>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(250, 247, 242, 0.75)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Our senior interior designers can take you on a virtual tour of our ongoing project sites and factory production before you begin your journey.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hello The Bright Space Interiors, I saw your Project Videos on your website and would like to request a site walkthrough / design consultation."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "#B89762",
              color: "#FFFFFF",
              padding: "11px 24px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              borderRadius: "2px",
              boxShadow: "0 4px 14px rgba(184, 151, 98, 0.35)",
            }}
          >
            Request Site Tour
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "transparent",
              color: "#FAF7F2",
              border: "1px solid rgba(250, 247, 242, 0.3)",
              padding: "11px 22px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              borderRadius: "2px",
            }}
          >
            More on YouTube
          </a>
        </div>
      </div>

      {/* ── Interactive Video Modal / Lightbox ── */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(10, 8, 7, 0.88)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.25s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#181615",
              color: "#FAF7F2",
              borderRadius: "4px",
              width: "100%",
              maxWidth: "920px",
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
              border: "1px solid rgba(184, 151, 98, 0.35)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Top Bar with Close button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    background: "rgba(184, 151, 98, 0.2)",
                    color: "#D4B87A",
                    padding: "3px 8px",
                    borderRadius: "2px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {activeVideo.category}
                </span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>
                  {activeVideo.title}
                </span>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  color: "#FAF7F2",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Viewport */}
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                background: "#000000",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {getYouTubeEmbedUrl(activeVideo.youtubeId) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.youtubeId)!}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={activeVideo.thumbnail}
                    alt={activeVideo.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.45)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      textAlign: "center",
                      padding: "32px 24px",
                      zIndex: 2,
                      maxWidth: "540px",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(220, 38, 38, 0.18)",
                        color: "#FF6B6B",
                        border: "1px solid rgba(220, 38, 38, 0.35)",
                        padding: "4px 14px",
                        borderRadius: "50px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: "16px",
                      }}
                    >
                      <Film size={12} />
                      Official YouTube Walkthrough
                    </div>

                    <h4
                      style={{
                        color: "#FFFFFF",
                        margin: "0 0 10px",
                        fontSize: "24px",
                        fontFamily: "var(--font-serif)",
                        fontWeight: 500,
                        letterSpacing: "0.03em",
                      }}
                    >
                      Watch on @thebrightspaceinterior
                    </h4>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.82)",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        margin: "0 auto 22px",
                      }}
                    >
                      Full site walkthrough video is being uploaded to our official YouTube channel. Subscribe now to watch it first!
                    </p>

                    <a
                      href={YOUTUBE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#C5221F",
                        color: "#FFFFFF",
                        padding: "12px 28px",
                        borderRadius: "2px",
                        fontSize: "12px",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        boxShadow: "0 6px 22px rgba(197, 34, 31, 0.4)",
                      }}
                    >
                      <Film size={15} />
                      Open Official YouTube Channel
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details in Modal */}
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: "1 1 500px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "24px",
                      color: "#FFFFFF",
                      margin: "0 0 8px",
                      fontWeight: 600,
                    }}
                  >
                    {activeVideo.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "rgba(250, 247, 242, 0.78)",
                      margin: 0,
                    }}
                  >
                    {activeVideo.description}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    minWidth: "220px",
                  }}
                >
                  <a
                    href={YOUTUBE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      background: "#C5221F",
                      color: "#FFFFFF",
                      padding: "10px 18px",
                      borderRadius: "2px",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                    }}
                  >
                    <Film size={15} />
                    Watch on YouTube
                    <ExternalLink size={13} />
                  </a>

                  {activeVideo.projectSlug && (
                    <Link
                      href={`/portfolio/${activeVideo.projectSlug}`}
                      onClick={() => setActiveVideo(null)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(184, 151, 98, 0.4)",
                        color: "#FAF7F2",
                        padding: "10px 18px",
                        borderRadius: "2px",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                      }}
                    >
                      View Case Study
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
