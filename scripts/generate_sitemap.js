const fs = require("fs");
const path = require("path");

// Load data sources
const { DESIGN_CATEGORIES } = require("../src/lib/design-ideas-data.ts");
const { PROJECTS, SERVICES } = require("../src/lib/data.ts");

const BASE_URL = "https://www.brightspaceinterior.in";

const staticPages = [
  { loc: `${BASE_URL}/`, lastmod: "2026-10-10", changefreq: "weekly", priority: "1.0" },
  { loc: `${BASE_URL}/services`, lastmod: "2026-10-07", changefreq: "weekly", priority: "0.9" },
  { loc: `${BASE_URL}/portfolio`, lastmod: "2026-10-07", changefreq: "weekly", priority: "0.9" },
  { loc: `${BASE_URL}/about`, lastmod: "2026-10-07", changefreq: "monthly", priority: "0.8" },
  { loc: `${BASE_URL}/process`, lastmod: "2026-10-07", changefreq: "monthly", priority: "0.8" },
  { loc: `${BASE_URL}/contact`, lastmod: "2026-10-07", changefreq: "monthly", priority: "0.8" },
  { loc: `${BASE_URL}/design-ideas`, lastmod: "2026-10-10", changefreq: "weekly", priority: "0.9" },
];

const servicePages = SERVICES.map((s) => ({
  loc: `${BASE_URL}/services/${s.slug}`,
  lastmod: "2026-10-07",
  changefreq: "monthly",
  priority: "0.8",
}));

const projectPages = PROJECTS.map((p) => ({
  loc: `${BASE_URL}/portfolio/${p.slug}`,
  lastmod: "2026-10-07",
  changefreq: "monthly",
  priority: "0.7",
}));

const designIdeaPages = DESIGN_CATEGORIES.map((c) => ({
  loc: `${BASE_URL}/design-ideas/${c.slug}`,
  lastmod: "2026-10-10",
  changefreq: "weekly",
  priority: "0.7",
}));

const legalPages = [
  { loc: `${BASE_URL}/privacy-policy`, lastmod: "2026-10-07", changefreq: "yearly", priority: "0.3" },
  { loc: `${BASE_URL}/terms-conditions`, lastmod: "2026-10-07", changefreq: "yearly", priority: "0.3" },
];

const allEntries = [
  ...staticPages,
  ...servicePages,
  ...projectPages,
  ...designIdeaPages,
  ...legalPages,
];

console.log(`Generating sitemap with ${allEntries.length} URLs...`);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, "../public/sitemap.xml"), xml, "utf8");
console.log("Successfully generated public/sitemap.xml!");
