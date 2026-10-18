const http = require("http");

const BASE_SERVER = "http://localhost:3001";
const SITE_HOST = "https://www.brightspaceinterior.in";

function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    const url = path.startsWith("http") ? path : `${BASE_SERVER}${path}`;
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode, text: data, headers: res.headers }));
      })
      .on("error", reject);
  });
}

function parseTags(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || html.match(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
  const ogUrlMatch = html.match(/<meta\s+property="og:url"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+property="og:url"/i);
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+property="og:title"/i);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);

  return {
    title: titleMatch ? titleMatch[1] : null,
    canonical: canonicalMatch ? canonicalMatch[1] : null,
    ogUrl: ogUrlMatch ? ogUrlMatch[1] : null,
    ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
    description: descMatch ? descMatch[1] : null,
  };
}

async function runTests() {
  console.log("=== 1. TESTING SITEMAP ===");
  const sitemapRes = await fetchUrl("/sitemap.xml");
  console.log(`Sitemap HTTP status: ${sitemapRes.status}`);
  if (sitemapRes.status !== 200) {
    throw new Error(`Sitemap failed with status ${sitemapRes.status}`);
  }

  const locMatches = [...sitemapRes.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`Total URLs in sitemap: ${locMatches.length}`);
  if (locMatches.length !== 57) {
    throw new Error(`Expected 57 URLs in sitemap, got ${locMatches.length}`);
  }

  console.log("\n=== 2. TESTING ALL 57 URLS FOR 200 OK & CANONICAL SELF-REFERENCE ===");
  let failedUrls = 0;
  for (const fullUrl of locMatches) {
    const urlObj = new URL(fullUrl);
    const path = urlObj.pathname;
    const res = await fetchUrl(path);

    if (res.status !== 200) {
      console.error(`FAIL: ${path} returned status ${res.status}`);
      failedUrls++;
      continue;
    }

    const tags = parseTags(res.text);

    // Expected canonical:
    // root -> https://www.brightspaceinterior.in/
    // others -> https://www.brightspaceinterior.in + path (no trailing slash)
    const expectedCanonical = path === "/" ? `${SITE_HOST}` : `${SITE_HOST}${path.replace(/\/+$/, "")}`;

    if (tags.canonical !== expectedCanonical && !(path === "/" && tags.canonical === `${SITE_HOST}/`)) {
      console.error(`FAIL canonical mismatch for ${path}: expected ${expectedCanonical}, got ${tags.canonical}`);
      failedUrls++;
    }
    if (tags.ogUrl !== expectedCanonical && !(path === "/" && tags.ogUrl === `${SITE_HOST}/`)) {
      console.error(`FAIL og:url mismatch for ${path}: expected ${expectedCanonical}, got ${tags.ogUrl}`);
      failedUrls++;
    }
  }

  if (failedUrls === 0) {
    console.log("SUCCESS: All 57 URLs returned 200 and have matching self-referencing canonical & og:url tags!");
  } else {
    throw new Error(`${failedUrls} URLs failed canonical/status check`);
  }

  console.log("\n=== 3. TESTING SPECIFIC PAGE METADATA ===");
  // Test /contact
  const contactRes = await fetchUrl("/contact");
  const contactTags = parseTags(contactRes.text);
  console.log("/contact tags:", contactTags);
  if (contactTags.title !== "Contact Us | Bright Space Interiors") {
    throw new Error(`Unexpected /contact title: ${contactTags.title}`);
  }
  if (!contactTags.description || Math.abs(contactTags.description.length - 150) > 20) {
    throw new Error(`Expected /contact description ~150 chars, got length ${contactTags.description?.length}`);
  }

  // Test /design-ideas
  const designIdeasRes = await fetchUrl("/design-ideas");
  const designIdeasTags = parseTags(designIdeasRes.text);
  console.log("/design-ideas tags:", designIdeasTags);
  if (designIdeasTags.title !== "Interior Design Ideas | Bright Space Interiors") {
    throw new Error(`Unexpected /design-ideas title: ${designIdeasTags.title}`);
  }
  if (!designIdeasTags.description || Math.abs(designIdeasTags.description.length - 150) > 20) {
    throw new Error(`Expected /design-ideas description ~150 chars, got length ${designIdeasTags.description?.length}`);
  }

  // Test /about
  const aboutRes = await fetchUrl("/about");
  const aboutTags = parseTags(aboutRes.text);
  console.log("/about tags:", aboutTags);
  if (aboutTags.title !== "About Us | Bright Space Interiors") {
    throw new Error(`Unexpected /about title: ${aboutTags.title}`);
  }

  // Test /portfolio
  const portfolioRes = await fetchUrl("/portfolio");
  const portfolioTags = parseTags(portfolioRes.text);
  console.log("/portfolio tags:", portfolioTags);
  if (portfolioTags.title !== "Portfolio | Bright Space Interiors") {
    throw new Error(`Unexpected /portfolio title: ${portfolioTags.title}`);
  }

  // Test a project page: /portfolio/rawls-salon-luxury
  const projectRes = await fetchUrl("/portfolio/rawls-salon-luxury");
  const projectTags = parseTags(projectRes.text);
  console.log("/portfolio/rawls-salon-luxury tags:", projectTags);
  if (projectTags.title !== "Rawls Salon Luxury | Bright Space Interiors") {
    throw new Error(`Unexpected project page title: ${projectTags.title}`);
  }
  if (projectTags.canonical !== `${SITE_HOST}/portfolio/rawls-salon-luxury`) {
    throw new Error(`Unexpected project canonical: ${projectTags.canonical}`);
  }

  // Test a category page: /design-ideas/crockery-unit-designs
  const categoryRes = await fetchUrl("/design-ideas/crockery-unit-designs");
  const categoryTags = parseTags(categoryRes.text);
  console.log("/design-ideas/crockery-unit-designs tags:", categoryTags);
  if (categoryTags.title !== "Crockery Unit Designs | Bright Space Interiors") {
    throw new Error(`Unexpected category title: ${categoryTags.title}`);
  }

  console.log("\n=== 4. TESTING 7 COMMERCIAL CATEGORY PAGES ===");
  const commercialSlugs = [
    "hospital-interiors",
    "school-interiors",
    "gym-interiors",
    "cafe-interiors",
    "salon-interiors",
    "office-interiors",
    "hotel-interiors",
  ];

  for (const slug of commercialSlugs) {
    const res = await fetchUrl(`/design-ideas/${slug}`);
    const html = res.text;

    // Check that it does NOT contain "homes" or "Your Home"
    if (html.includes("tailored for modern luxury homes")) {
      throw new Error(`Commercial page ${slug} still contains "tailored for modern luxury homes"!`);
    }
    if (html.includes("for Your Home?")) {
      throw new Error(`Commercial page ${slug} still contains "for Your Home?"!`);
    }

    // Check that it contains "designed for businesses across Delhi NCR"
    if (!html.includes("designed for businesses across Delhi NCR")) {
      throw new Error(`Commercial page ${slug} is missing "designed for businesses across Delhi NCR"!`);
    }

    // Check that it contains "Let's design it for your business."
    if (!html.includes("Let's design it for your business.")) {
      throw new Error(`Commercial page ${slug} is missing "Let's design it for your business."!`);
    }

    console.log(`Commercial page /design-ideas/${slug}: OK (business copy verified, no "homes" or "Your Home")`);
  }

  console.log("\n=== 5. TESTING RESIDENTIAL CATEGORY PAGE (e.g. wardrobe-designs) ===");
  const resCat = await fetchUrl("/design-ideas/wardrobe-designs");
  if (!resCat.text.includes("tailored for modern luxury homes across Delhi NCR")) {
    throw new Error("Residential page wardrobe-designs missing luxury homes text!");
  }
  if (!resCat.text.includes("for Your Home?")) {
    throw new Error("Residential page wardrobe-designs missing 'for Your Home?' text!");
  }
  console.log("Residential page /design-ideas/wardrobe-designs: OK (retains 'for your home' and 'modern luxury homes')");

  console.log("\n=== ALL SEO & CONTENT VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
