import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight, Sparkles, MessageCircle, Phone } from "lucide-react";
import { Metadata } from "next";
import {
  getAllDesignCategories,
  getDesignCategoryBySlug,
  DESIGN_CATEGORIES,
} from "@/lib/design-ideas-data";
import { WHATSAPP_NUMBER, PHONE_NUMBER, WHATSAPP_MESSAGE } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getAllDesignCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getDesignCategoryBySlug(slug);
  if (!category) {
    return {
      title: "Design Ideas | The Bright Space Interiors",
    };
  }
  return {
    title: category.metaTitle,
    description: category.metaDescription,
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      images: [{ url: category.heroImage }],
    },
  };
}

export default async function DesignCategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getDesignCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Related categories from the same or adjacent groups
  const otherCategories = DESIGN_CATEGORIES.filter((c) => c.slug !== category.slug).slice(0, 6);

  const customWhatsAppMsg = `Hello The Bright Space Interiors, I am interested in your ${category.name} concepts and would like to get a design consultation.`;

  return (
    <main className="design-idea-page" style={{ background: "var(--ivory, #FAF7F2)", minHeight: "100vh" }}>
      {/* ══════════════ CATEGORY HERO SECTION ══════════════ */}
      <section
        className="category-hero"
        style={{
          position: "relative",
          minHeight: "440px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--white, #FFFFFF)",
          padding: "120px 24px 70px",
          overflow: "hidden",
        }}
      >
        {/* Background Image with Dark Elegant Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${category.heroImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.04)",
            filter: "brightness(0.38)",
            zIndex: 1,
          }}
        />

        {/* Subtle Gold Vignette Gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(28,24,22,0.4) 0%, rgba(28,24,22,0.78) 75%, rgba(28,24,22,0.95) 100%)",
            zIndex: 2,
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 3,
            maxWidth: "960px",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.75)",
              marginBottom: "20px",
            }}
          >
            <Link
              href="/"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Home
            </Link>
            <ChevronRight size={13} style={{ color: "var(--gold, #B8975A)" }} />
            <Link
              href="/design-ideas"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              Design Ideas
            </Link>
            <ChevronRight size={13} style={{ color: "var(--gold, #B8975A)" }} />
            <span style={{ color: "var(--gold-light, #DFC59E)", fontWeight: 600 }}>
              {category.name}
            </span>
          </nav>

          {/* Group Tag */}
          <div style={{ marginBottom: "14px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 14px",
                borderRadius: "20px",
                background: "rgba(184, 151, 90, 0.22)",
                border: "1px solid rgba(184, 151, 90, 0.45)",
                color: "var(--gold-light, #DFC59E)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {category.group}
            </span>
          </div>

          {/* Category Hero Title */}
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(28px, 4.2vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.22,
              letterSpacing: "0.02em",
              color: "#FFFFFF",
              margin: "0 0 18px",
              textShadow: "0 2px 14px rgba(0,0,0,0.6)",
            }}
          >
            {category.heroTitle}
          </h1>

          {/* Category Hero Subtitle */}
          <p
            style={{
              fontSize: "clamp(15px, 1.3vw, 17px)",
              lineHeight: 1.65,
              color: "rgba(255, 255, 255, 0.88)",
              maxWidth: "760px",
              margin: "0 auto 28px",
              letterSpacing: "0.01em",
            }}
          >
            {category.heroSubtitle}
          </p>

          {/* Hero Action Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customWhatsAppMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              <MessageCircle size={16} />
              Enquire About {category.name}
            </a>
            <Link
              href="/contact"
              className="btn btn--outline-white"
              style={{
                padding: "12px 24px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Book Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ DESIGN GALLERY SECTION ══════════════ */}
      <section
        className="category-gallery-section"
        style={{
          padding: "70px 0 90px",
          maxWidth: "1320px",
          margin: "0 auto",
          paddingLeft: "clamp(16px, 4vw, 36px)",
          paddingRight: "clamp(16px, 4vw, 36px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--gold-dark, #8C7148)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            <Sparkles size={14} />
            <span>Curated Design Concepts</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(24px, 3vw, 34px)",
              fontWeight: 500,
              color: "var(--charcoal, #1C1C1C)",
              margin: "0 0 12px",
              letterSpacing: "0.03em",
            }}
          >
            Featured {category.name}
          </h2>
          <div className="title-line--center title-line" />
          <p
            style={{
              maxWidth: "620px",
              margin: "14px auto 0",
              color: "var(--charcoal-muted, #666059)",
              fontSize: "14.5px",
              lineHeight: 1.6,
            }}
          >
            Explore our signature portfolio of {category.name.toLowerCase()} tailored for modern luxury homes across Delhi NCR.
          </p>
        </div>

        {/* 2-Column Desktop, 1-Column Mobile Gallery Grid */}
        <div
          className="design-gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 540px), 1fr))",
            gap: "32px",
            width: "100%",
          }}
        >
          {category.designs.map((design, index) => (
            <article
              key={design.id}
              className="design-gallery-card"
              style={{
                background: "#FFFFFF",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(28, 24, 22, 0.06)",
                border: "1px solid rgba(184, 151, 90, 0.2)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image Container with Fixed Proportions */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 10.5",
                  overflow: "hidden",
                  background: "var(--ivory-dark, #ECE6DE)",
                }}
              >
                <img
                  src={design.image}
                  alt={design.title}
                  loading={index < 4 ? "eager" : "lazy"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.45s ease",
                  }}
                  className="design-gallery-card__img"
                />

                {/* Tag Badge */}
                {design.tag && (
                  <span
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background: "rgba(28, 24, 22, 0.78)",
                      backdropFilter: "blur(4px)",
                      color: "var(--gold-light, #DFC59E)",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(184, 151, 90, 0.35)",
                    }}
                  >
                    {design.tag}
                  </span>
                )}
              </div>

              {/* Card Content Below Image */}
              <div
                style={{
                  padding: "24px 26px 22px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                      fontSize: "clamp(18px, 1.5vw, 22px)",
                      fontWeight: 600,
                      color: "var(--charcoal, #1C1C1C)",
                      lineHeight: 1.35,
                      margin: "0 0 10px",
                      letterSpacing: "0.015em",
                    }}
                  >
                    {design.title}
                  </h3>

                  {design.description && (
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.6,
                        color: "var(--charcoal-muted, #666059)",
                        margin: "0 0 18px",
                      }}
                    >
                      {design.description}
                    </p>
                  )}
                </div>

                {/* Card Action */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "14px",
                    borderTop: "1px solid rgba(220, 214, 204, 0.6)",
                  }}
                >
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello, I would like to enquire about the "${design.title}" in ${category.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "var(--gold-dark, #8C7148)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                  >
                    Enquire This Design <ArrowRight size={14} />
                  </a>

                  <Link
                    href="/contact"
                    style={{
                      fontSize: "11.5px",
                      color: "var(--charcoal-muted, #666059)",
                      textDecoration: "none",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════════ CONSULTATION BANNER ══════════════ */}
      <section
        style={{
          background: "var(--charcoal, #1C1C1C)",
          color: "#FFFFFF",
          padding: "60px 24px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "var(--gold, #B8975A)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Personalized Turnkey Execution
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(24px, 3.2vw, 36px)",
              fontWeight: 500,
              margin: "0 0 16px",
              letterSpacing: "0.02em",
            }}
          >
            Need a Customized {category.name.replace(/ Designs$/, "")} for Your Home?
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "15px",
              maxWidth: "680px",
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            Our principal interior architects provide on-site measurements, realistic 3D visualizations, and turnkey craftsmanship with a 10-year warranty.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(customWhatsAppMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <MessageCircle size={16} /> WhatsApp Consultation
            </a>
            <a
              href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`}
              className="btn btn--outline-white"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <Phone size={15} /> Call: {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════ EXPLORE MORE CATEGORIES ══════════════ */}
      <section
        style={{
          padding: "70px 24px 90px",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', serif)",
              fontSize: "clamp(22px, 2.5vw, 30px)",
              fontWeight: 500,
              color: "var(--charcoal, #1C1C1C)",
              margin: "0 0 10px",
            }}
          >
            Explore More Design Ideas
          </h2>
          <div className="title-line--center title-line" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "20px",
          }}
        >
          {otherCategories.map((other) => (
            <Link
              key={other.slug}
              href={`/design-ideas/${other.slug}`}
              style={{
                background: "#FFFFFF",
                borderRadius: "12px",
                border: "1px solid rgba(184, 151, 90, 0.22)",
                padding: "18px 20px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 10px rgba(28, 24, 22, 0.04)",
                transition: "all 0.22s ease",
              }}
              className="related-category-link"
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    color: "var(--gold-dark, #8C7148)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  {other.group}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--charcoal, #1C1C1C)",
                  }}
                >
                  {other.name}
                </span>
              </div>
              <ChevronRight size={18} style={{ color: "var(--gold, #B8975A)" }} />
            </Link>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "36px" }}>
          <Link
            href="/design-ideas"
            className="btn btn--outline-gold"
            style={{
              padding: "12px 28px",
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            View All 32 Design Categories <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
