import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { ADDRESS, PHONE_NUMBER, ALT_PHONE_NUMBER, EMAIL, INSTAGRAM_URL, YOUTUBE_URL } from "@/lib/data";

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

function YoutubeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
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

const serviceLinks = [
  { href: "/services/residential", label: "Residential Interior" },
  { href: "/services/commercial", label: "Commercial Interior" },
  { href: "/services/turnkey", label: "Turnkey Projects" },
  { href: "/services/design-execution", label: "Design & Execution" },
];

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="footer__grid">
        {/* Brand */}
        <div>
          <div className="footer__brand-name">Bright Space</div>
          <div className="footer__brand-tagline">Interiors</div>
          <p className="footer__brand-desc">
            A premium interior design studio crafting spaces that blend
            aesthetic excellence with functional precision — from concept
            to final handover.
          </p>
          <div className="footer__social">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Instagram"
            >
              <InstagramIcon size={15} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="Facebook"
            >
              <FacebookIcon size={15} />
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
              aria-label="YouTube"
            >
              <YoutubeIcon size={15} />
            </a>
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

        {/* Services */}
        <div>
          <div className="footer__col-title">Services</div>
          <ul className="footer__links">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="footer__col-title">Get in Touch</div>
          <div className="footer__contact-item">
            <MapPin size={15} className="footer__contact-icon" />
            <div className="footer__contact-text">
              {ADDRESS}
            </div>
          </div>
          <div className="footer__contact-item">
            <Phone size={15} className="footer__contact-icon" />
            <div className="footer__contact-text" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <a href={`tel:${PHONE_NUMBER.replace(/\s+/g, "")}`}>{PHONE_NUMBER}</a>
              <a href={`tel:${ALT_PHONE_NUMBER.replace(/\s+/g, "")}`} style={{ fontSize: "12px", opacity: 0.85 }}>{ALT_PHONE_NUMBER}</a>
            </div>
          </div>
          <div className="footer__contact-item">
            <Mail size={15} className="footer__contact-icon" />
            <div className="footer__contact-text">
              <a href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>
          </div>
          <div className="footer__contact-item">
            <span style={{ fontSize: "12px", color: "rgba(248,244,236,0.4)" }}>
              Mon – Sat: 9:00 AM – 7:00 PM
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
