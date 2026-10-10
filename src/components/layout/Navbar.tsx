"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { DESIGN_CATEGORIES } from "@/lib/design-ideas-data";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/design-ideas", label: "Design Ideas", isDropdown: true },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close menu and dropdown on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdownOpen(false);
  }, [pathname]);

  const navClass = [
    "navbar",
    isHome && !scrolled ? "navbar--transparent" : "navbar--solid",
  ]
    .filter(Boolean)
    .join(" ");

  // 4 columns for desktop dropdown
  const col1 = DESIGN_CATEGORIES.slice(0, 8);
  const col2 = DESIGN_CATEGORIES.slice(8, 16);
  const col3 = DESIGN_CATEGORIES.slice(16, 24);
  const col4 = DESIGN_CATEGORIES.slice(24, 32);

  return (
    <>
      <nav className={navClass} aria-label="Main navigation">
        <Link href="/" className="navbar__logo" aria-label="Bright Space Interiors Home">
          <img
            src="/logo.png"
            alt="Bright Space Interiors Official Logo"
            width={46}
            height={46}
            className="navbar__logo-img"
          />
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">Bright Space</span>
            <span className="navbar__logo-tagline">Interiors</span>
          </div>
        </Link>

        <ul className="navbar__nav" role="list">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            if (link.isDropdown) {
              return (
                <li key={link.href} className="nav-dropdown">
                  <Link
                    href={link.href}
                    className={`navbar__link${isActive ? " navbar__link--active" : ""}`}
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontSize: "12px",
                      fontWeight: 500,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={13} style={{ opacity: 0.7 }} />
                  </Link>

                  {/* Desktop Mega Dropdown */}
                  <div className="nav-dropdown__menu" role="menu">
                    <div className="nav-dropdown__header">
                      <div>
                        <span className="nav-dropdown__eyebrow">Inspiration Gallery</span>
                        <h4 className="nav-dropdown__title">32 Design Categories</h4>
                      </div>
                      <Link href="/design-ideas" className="nav-dropdown__all-link">
                        View All Categories <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="nav-dropdown__columns">
                      <div className="nav-dropdown__col">
                        <span className="nav-dropdown__col-title">Dining & Living</span>
                        {col1.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/design-ideas/${cat.slug}`}
                            className="nav-dropdown__item"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>

                      <div className="nav-dropdown__col">
                        <span className="nav-dropdown__col-title">Bedrooms & Suites</span>
                        {col2.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/design-ideas/${cat.slug}`}
                            className="nav-dropdown__item"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>

                      <div className="nav-dropdown__col">
                        <span className="nav-dropdown__col-title">Hospitality & Commercial</span>
                        {col3.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/design-ideas/${cat.slug}`}
                            className="nav-dropdown__item"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>

                      <div className="nav-dropdown__col">
                        <span className="nav-dropdown__col-title">Decor & Architecture</span>
                        {col4.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/design-ideas/${cat.slug}`}
                            className="nav-dropdown__item"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            }

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`navbar__link${pathname === link.href ? " navbar__link--active" : ""}`}
                  style={{ textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "12px", fontWeight: 500 }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/contact"
          className="navbar__cta"
          id="nav-get-quote"
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            fontSize: "11px",
            fontWeight: 600,
            border: "1px solid var(--gold)",
            background: "transparent",
            color: "var(--charcoal)",
            padding: "10px 22px",
            borderRadius: "1px",
            transition: "all var(--transition-fast)",
          }}
        >
          Get a Quote
        </Link>

        <button
          className="navbar__hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Navigation (Clean Elegant White Menu matching reference) */}
      <div
        className={`mobile-nav${mobileOpen ? " mobile-nav--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button
          className="mobile-nav__close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          type="button"
        >
          <X size={30} strokeWidth={1.35} />
        </button>

        <nav className="mobile-nav__menu" aria-label="Mobile links">
          {navLinks.map((link) => {
            if (link.isDropdown) {
              return (
                <div key={link.href} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`mobile-nav__link${pathname.startsWith(link.href) ? " mobile-nav__link--active" : ""}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      aria-label="Toggle Design Ideas categories"
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--gold, #B8975A)",
                        padding: "8px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ChevronDown
                        size={22}
                        style={{
                          transform: mobileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.24s ease",
                        }}
                      />
                    </button>
                  </div>

                  {/* Mobile Expandable Category Submenu */}
                  {mobileDropdownOpen && (
                    <div
                      style={{
                        paddingLeft: "16px",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        maxHeight: "260px",
                        overflowY: "auto",
                        borderLeft: "2px solid rgba(184, 151, 90, 0.3)",
                        marginTop: "8px",
                      }}
                    >
                      <Link
                        href="/design-ideas"
                        onClick={() => setMobileOpen(false)}
                        style={{
                          fontSize: "14px",
                          color: "var(--gold-dark, #8C7148)",
                          fontWeight: 700,
                          textDecoration: "none",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        • View All 32 Categories &rarr;
                      </Link>
                      {DESIGN_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/design-ideas/${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            fontSize: "15px",
                            color: pathname === `/design-ideas/${cat.slug}` ? "var(--gold, #B8975A)" : "#333333",
                            textDecoration: "none",
                            lineHeight: 1.3,
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav__link${pathname === link.href ? " mobile-nav__link--active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
