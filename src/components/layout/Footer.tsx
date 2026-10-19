import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getSiteSettings, getPublishedNavServices } from "@/lib/server/site-db";

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Our Process" },
  { href: "/contact", label: "Contact" },
];

export default async function Footer() {
  const settings = await getSiteSettings();
  const services = await getPublishedNavServices();

  const phone = (settings as any).phone || settings.phoneNumber || "+91 79823 64617";
  const altPhone = (settings as any).altPhone || settings.altPhoneNumber || "+91 99993 05862";
  const email = settings.email || "info@brightspaceinterior.in";
  const address = settings.address || "DLF Phase 5, Golf Course Road, Gurugram, Delhi NCR";
  const workingHours = settings.workingHours || "Mon – Sat: 10:00 AM – 7:00 PM";
  const instagram = ((settings as any).instagram || settings.instagramUrl || "").trim();
  const facebook = ((settings as any).facebook || settings.facebookUrl || "").trim();

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__grid">
        {/* Brand */}
        <div>
          <Link
            href="/"
            aria-label="Bright Space Interiors Home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              marginBottom: "16px",
            }}
          >
            <img
              src="/logo.png"
              alt="Bright Space Interiors Official Logo"
              width={48}
              height={48}
              style={{
                width: "48px",
                height: "48px",
                objectFit: "contain",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <div>
              <div className="footer__brand-name">Bright Space</div>
              <div className="footer__brand-tagline">Interiors</div>
            </div>
          </Link>
          <p className="footer__brand-desc">
            A premium interior design studio crafting spaces that blend
            aesthetic excellence with functional precision — from concept
            to final handover.
          </p>
          <div className="footer__social">
            {/* Hide social icon if link is empty */}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Instagram"
              >
                <InstagramIcon size={15} />
              </a>
            )}
            {facebook && (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Facebook"
              >
                <FacebookIcon size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="footer__col-title">Quick Links</div>
          <ul className="footer__links">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services from Firestore */}
        <div>
          <div className="footer__col-title">Services</div>
          <ul className="footer__links">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={s.href || (s as any).link || `/services/${s.slug}`} className="footer__link">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info from Single Source of Truth */}
        <div>
          <div className="footer__col-title">Get in Touch</div>
          <div className="footer__contact-item">
            <MapPin size={15} className="footer__contact-icon" />
            <div className="footer__contact-text">{address}</div>
          </div>
          <div className="footer__contact-item">
            <Phone size={15} className="footer__contact-icon" />
            <div className="footer__contact-text" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a>
              {altPhone && (
                <a href={`tel:${altPhone.replace(/[^0-9+]/g, "")}`} style={{ fontSize: "12px", opacity: 0.85 }}>
                  {altPhone}
                </a>
              )}
            </div>
          </div>
          <div className="footer__contact-item">
            <Mail size={15} className="footer__contact-icon" />
            <div className="footer__contact-text">
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          </div>
          <div className="footer__contact-item">
            <span style={{ fontSize: "12px", color: "rgba(248,244,236,0.5)" }}>
              {workingHours}
            </span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>
          © {new Date().getFullYear()} Bright Space Interiors. All rights reserved.
        </span>
        <div className="footer__bottom-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-conditions">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
