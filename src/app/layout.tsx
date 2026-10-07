import type { Metadata } from "next";
import "./globals.css";
import ConditionalShell from "@/components/layout/ConditionalShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brightspaceinterior.in"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Bright Space Interiors | Luxury Interior Design & Turnkey Execution",
    template: "%s | Bright Space Interiors",
  },
  description:
    "Premium interior design studio offering residential, commercial, and turnkey interior services. From concept to final handover — spaces designed to feel like you.",
  keywords: [
    "interior design",
    "luxury interiors",
    "turnkey interior",
    "residential interior",
    "commercial interior",
    "interior designer",
  ],
  openGraph: {
    type: "website",
    siteName: "Bright Space Interiors",
    title: "Bright Space Interiors | Luxury Interior Design & Turnkey Execution",
    description:
      "Premium interior design studio offering residential, commercial, and turnkey interior services.",
  },
  twitter: {
    card: "summary_large_image",
  },
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
      </head>
      <body>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
