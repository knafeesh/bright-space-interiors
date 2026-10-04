"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navClass = [
    "navbar",
    isHome && !scrolled ? "navbar--transparent" : "navbar--solid",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <nav className={navClass} aria-label="Main navigation">
        <Link href="/" className="navbar__logo" aria-label="The Bright Space Interiors Home">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="26" height="26" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 36C20 36 20 22 20 4C20 4 29 11 31 22C32.4 29.8 26.5 35.5 20 36Z" fill="#C5A880" fillOpacity="0.85" />
              <path d="M20 36C20 36 20 22 20 4C20 4 11 11 9 22C7.6 29.8 13.5 35.5 20 36Z" fill="#B8975A" />
              <path d="M20 12C20 12 25 18 25 24" stroke="#FFF8EE" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M20 18C20 18 15 22 15 27" stroke="#FFF8EE" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "16px", letterSpacing: "0.12em", fontWeight: 600, color: "var(--charcoal)", textTransform: "uppercase", lineHeight: 1.1 }}>
                The Bright Space
              </span>
              <span style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--gold-dark)", fontWeight: 500, marginTop: "2px" }}>
                Interiors
              </span>
            </div>
          </div>
        </Link>

        <ul className="navbar__nav" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`navbar__link${pathname === link.href ? " navbar__link--active" : ""}`}
                style={{ textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "12px", fontWeight: 500 }}
              >
                {link.label}
              </Link>
            </li>
          ))}
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
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Navigation */}
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
        >
          <X size={28} />
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-nav__link"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="mobile-nav__bottom">
          <a
            href="https://wa.me/919999999999?text=Hello%2C%20I%27m%20interested%20in%20your%20interior%20design%20services.%20I%27d%20like%20to%20discuss%20my%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            onClick={() => setMobileOpen(false)}
          >
            WhatsApp Us
          </a>
          <a href="tel:+919999999999" className="btn btn--outline-white">
            Call Now
          </a>
        </div>
      </div>
    </>
  );
}
