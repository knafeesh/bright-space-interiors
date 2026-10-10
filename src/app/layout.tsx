import type { Metadata } from "next";
import "./globals.css";
import ConditionalShell from "@/components/layout/ConditionalShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brightspaceinterior.in"),
  alternates: {
    canonical: "https://www.brightspaceinterior.in/",
  },
  title: {
    default: "Bright Space Interiors | Luxury Interior Design & Turnkey Execution",
    template: "%s | Bright Space Interiors",
  },
  description:
    "Luxury Interior Designers in Delhi NCR, Gurugram, Faridabad, Haryana & Punjab — Bright Space Interiors brings premium home interiors tailored to your style.",
  keywords: [
    "Bright Space Interiors",
    "interior design",
    "luxury interiors",
    "turnkey interior",
    "residential interior",
    "commercial interior",
    "interior designer Gurugram",
    "interior designer Delhi NCR",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.brightspaceinterior.in/",
    siteName: "Bright Space Interiors",
    title: "Bright Space Interiors | Luxury Interior Design & Turnkey Execution",
    description:
      "Premium interior design studio offering residential, commercial, and turnkey interior services. From concept to final handover.",
    images: [
      {
        url: "https://www.brightspaceinterior.in/logo.png",
        width: 982,
        height: 982,
        alt: "Bright Space Interiors Official Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bright Space Interiors | Luxury Interior Design & Turnkey Execution",
    description:
      "Premium interior design studio offering residential, commercial, and turnkey interior services.",
    images: ["https://www.brightspaceinterior.in/logo.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.brightspaceinterior.in/#website",
      "name": "Bright Space Interiors",
      "alternateName": "Bright Space",
      "url": "https://www.brightspaceinterior.in/",
      "inLanguage": "en-US",
      "publisher": {
        "@id": "https://www.brightspaceinterior.in/#organization",
      },
    },
    {
      "@type": ["Organization", "HomeAndConstructionBusiness"],
      "@id": "https://www.brightspaceinterior.in/#organization",
      "name": "Bright Space Interiors",
      "legalName": "Bright Space Interiors",
      "alternateName": ["Bright Space", "The Bright Space Interiors"],
      "url": "https://www.brightspaceinterior.in/",
      "logo": "https://www.brightspaceinterior.in/logo.png",
      "image": "https://www.brightspaceinterior.in/logo.png",
      "description":
        "Luxury Interior Designers in Delhi NCR, Gurugram, Faridabad, Haryana & Punjab — Bright Space Interiors brings premium home interiors tailored to your style.",
      "telephone": "+91 98111 60129",
      "email": "contact@brightspaceinterior.in",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ground Floor, Behind Radha Krishna Mandir, DLF Phase 3",
        "addressLocality": "Gurugram",
        "addressRegion": "Haryana",
        "postalCode": "122002",
        "addressCountry": "IN",
      },
      "sameAs": [
        "https://www.instagram.com/thebrightspaceinteriors",
        "https://www.youtube.com/@TheBrightSpaceInteriors",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Favicon links for browser tab and search engines */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
