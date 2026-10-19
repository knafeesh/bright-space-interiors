import {
  getFullSiteStore,
  saveFullSiteStore,
  getSiteSettings,
  saveSiteSettings,
  getNavServices,
  getPublishedNavServices,
  saveNavService,
  getPhilosophySlides,
  savePhilosophySlides,
  getProjects,
  getPublishedProjects,
  getProjectBySlug,
  saveProject,
  deleteProject,
  getMediaAssets,
  saveMediaAsset,
  deleteMediaAsset,
  findImageUsage,
  getEnquiries,
  saveEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  isFirebaseConfigured,
} from "../src/lib/server/site-db";
import sitemap from "../src/app/sitemap";
import {
  hashPassword,
  verifyPassword,
  checkLoginRateLimit,
  recordLoginFailure,
  resetLoginRateLimit,
} from "../src/lib/server/admin-auth";
import fs from "fs";
import path from "path";

async function runEndToEndTests() {
  console.log("================================================================================");
  console.log("🚀 STARTING COMPREHENSIVE END-TO-END VERIFICATION OF BRIGHT SPACE INTERIORS CMS");
  console.log("================================================================================");

  const passedTests: string[] = [];
  const failedTests: string[] = [];

  const assert = (condition: boolean, desc: string) => {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passedTests.push(desc);
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
      failedTests.push(desc);
    }
  };

  // ─── 0. Storage Provider Status ─────────────────────────────────────────────
  console.log("\n📦 CHECKING STORAGE PROVIDER STATUS:");
  const isFb = isFirebaseConfigured();
  console.log(`  Firebase Configured: ${isFb ? "YES (Firestore & Cloud Storage Connected)" : "NO (Clean Local Persistent Store Active)"}`);
  const store = await getFullSiteStore();
  assert(Boolean(store && store.settings && Array.isArray(store.projects)), "Full Site Store loaded successfully");

  // ─── 1. Change a Service Title and Image ────────────────────────────────────
  console.log("\n1️⃣ TEST: CHANGE A SERVICE TITLE AND IMAGE (Single Source of Truth)");
  const servicesBefore = await getNavServices();
  const testService = servicesBefore[0];
  const originalTitle = testService.title;
  const originalImage = testService.image;

  const updatedTitle = `${originalTitle} (Luxury Handcrafted)`;
  const updatedImage = "/images/e2e-test-service-luxury.webp";

  console.log(`  Updating Service "${testService.slug}":`);
  console.log(`    Title: "${originalTitle}" -> "${updatedTitle}"`);
  console.log(`    Image: "${originalImage}" -> "${updatedImage}"`);

  await saveNavService({
    slug: testService.slug,
    title: updatedTitle,
    image: updatedImage,
  });

  const servicesAfter = await getPublishedNavServices();
  const foundUpdated = servicesAfter.find((s) => s.slug === testService.slug);

  assert(Boolean(foundUpdated && foundUpdated.title === updatedTitle), "Service title updated immediately in published services without redeploy");
  assert(Boolean(foundUpdated && foundUpdated.image === updatedImage), "Service image updated immediately in published services without redeploy");

  // Revert back to original
  await saveNavService({
    slug: testService.slug,
    title: originalTitle,
    image: originalImage,
  });
  console.log(`  Reverted service "${testService.slug}" back to original.`);

  // ─── 2. Reorder Philosophy Carousel ─────────────────────────────────────────
  console.log("\n2️⃣ TEST: REORDER DESIGN PHILOSOPHY IMAGE CAROUSEL");
  const slidesBefore = await getPhilosophySlides();
  console.log(`  Current Carousel Slides: ${slidesBefore.length}`);
  if (slidesBefore.length >= 2) {
    const reversedSlides = [
      { ...slidesBefore[1], order: 1 },
      { ...slidesBefore[0], order: 2 },
      ...slidesBefore.slice(2).map((s, idx) => ({ ...s, order: idx + 3 })),
    ];
    await savePhilosophySlides(reversedSlides);
    const slidesAfter = await getPhilosophySlides();
    assert(slidesAfter[0].id === slidesBefore[1].id, "Carousel slides order updated and persisted");

    // Restore original order
    await savePhilosophySlides(slidesBefore);
    console.log("  Reverted carousel order back to original.");
  }

  // ─── 3. Upload Image, Usage Scanning & Deletion Guard ────────────────────────
  console.log("\n3️⃣ TEST: IMAGE UPLOAD, USAGE SCANNING & DELETION BLOCK");
  const testImageUrl = "/images/e2e-protected-marble.webp";
  await saveMediaAsset({
    id: "e2e-marble-asset",
    name: "e2e-protected-marble.webp",
    url: testImageUrl,
    folder: "portfolio",
    size: "142 KB",
    dimensions: "2048x1365",
    type: "image/webp",
    altText: "Protected luxury Italian marble wall",
    dateAdded: "Oct 19, 2026",
  });

  // Verify it exists in media library
  const mediaList = await getMediaAssets();
  assert(mediaList.some((m) => m.url === testImageUrl), "Media asset registered in media library");

  // Check usage before assigning - should be 0
  const initialUsage = await findImageUsage(testImageUrl);
  assert(initialUsage.length === 0, "New image has 0 usages before assignment");

  // Now assign image to an existing project hero
  const allProjects = await getProjects();
  const firstProject = allProjects[0];
  const savedOriginalImage = firstProject.image;

  await saveProject({
    id: firstProject.id,
    title: firstProject.title,
    image: testImageUrl,
  });

  // Check usage after assignment
  const usageAfterAssign = await findImageUsage(testImageUrl);
  assert(usageAfterAssign.length > 0, `Usage scanner detected image in: "${usageAfterAssign.join(", ")}"`);

  // Attempt to delete protected image - MUST BE BLOCKED
  const deleteResultBlocked = await deleteMediaAsset(testImageUrl);
  assert(!deleteResultBlocked.success, "Deletion blocked for image currently used on the website");
  assert(Boolean(deleteResultBlocked.usedIn && deleteResultBlocked.usedIn.length > 0), "Deletion response shows exact usage locations");

  // Unassign from project and restore
  await saveProject({
    id: firstProject.id,
    title: firstProject.title,
    image: savedOriginalImage,
  });

  // Now delete - MUST SUCCEED
  const deleteResultSuccess = await deleteMediaAsset(testImageUrl);
  assert(deleteResultSuccess.success, "Unused image successfully deleted from storage/media library");

  // ─── 4. Delete a Project, 404 Verification & Sitemap Sync ───────────────────
  console.log("\n4️⃣ TEST: DELETE A PROJECT, PUBLIC 404 & SITEMAP EXCLUSION");
  const testProjectSlug = "e2e-test-deletion-penthouse";
  const testProjectTitle = "DLF Phase 5 Sky Penthouse (E2E Test)";

  // Add temporary published project
  const saveProjRes = await saveProject({
    title: testProjectTitle,
    slug: testProjectSlug,
    category: "Residential",
    categories: ["Residential"],
    location: "DLF Phase 5, Gurugram",
    area: "6,500 sq ft",
    year: "2026",
    duration: "12 weeks",
    featured: true,
    status: "published",
    image: "/images/hero-luxury.jpg",
    gallery: ["/images/hero-luxury.jpg"],
    description: "Temporary project for deletion test.",
  });

  const createdId = saveProjRes.project?.id || Date.now();
  console.log(`  Created temporary test project ID: ${createdId}, Slug: "${testProjectSlug}"`);

  // Verify it exists in published list
  const publishedBefore = await getPublishedProjects();
  assert(publishedBefore.some((p) => p.slug === testProjectSlug), "Test project appears in published projects list");

  // Verify it appears in dynamic sitemap
  const sitemapBefore = await sitemap();
  const inSitemapBefore = sitemapBefore.some((entry) => entry.url.includes(testProjectSlug));
  assert(inSitemapBefore, "Test project appears in dynamic sitemap.xml");

  // Delete the project
  console.log(`  Deleting project "${testProjectSlug}"...`);
  const delRes = await deleteProject(createdId);
  assert(delRes.success, "Project successfully deleted from database");

  // Verify getProjectBySlug returns null (triggers Next.js notFound() -> 404)
  const projectBySlugAfter = await getProjectBySlug(testProjectSlug);
  assert(projectBySlugAfter === null, "Deleted project returns null (triggers native 404 on /portfolio/[slug])");

  // Verify it is REMOVED from published projects
  const publishedAfter = await getPublishedProjects();
  assert(!publishedAfter.some((p) => p.slug === testProjectSlug), "Deleted project removed from public published projects list");

  // Verify it is REMOVED from dynamic sitemap
  const sitemapAfter = await sitemap();
  const inSitemapAfter = sitemapAfter.some((entry) => entry.url.includes(testProjectSlug));
  assert(!inSitemapAfter, "Deleted project is strictly removed from sitemap.xml");

  // ─── 5. Site Settings Single Source of Truth ────────────────────────────────
  console.log("\n5️⃣ TEST: SITE SETTINGS (Phones, Email, WhatsApp, Socials, Structured Data)");
  const settingsBefore = await getSiteSettings();
  const testPhone = "+91 99999 88888";

  console.log(`  Updating primary phone number: "${settingsBefore.phoneNumber}" -> "${testPhone}"`);
  await saveSiteSettings({
    ...settingsBefore,
    phoneNumber: testPhone,
  });

  const settingsAfter = await getSiteSettings();
  assert(settingsAfter.phoneNumber === testPhone, "Updated phone number persisted in Site Settings");

  // Revert back
  await saveSiteSettings({
    ...settingsBefore,
    phoneNumber: settingsBefore.phoneNumber,
  });
  console.log(`  Reverted phone number back to: ${settingsBefore.phoneNumber}`);

  // ─── 6. Enquiries Lifecycle ─────────────────────────────────────────────────
  console.log("\n6️⃣ TEST: CUSTOMER ENQUIRIES & STATUS WORKFLOW");
  const testEnquiry = {
    name: "Vikramaditya Singhania",
    phone: "+91 98100 12345",
    email: "vikram@example.com",
    projectType: "Residential — Villa/Bungalow",
    location: "Golf Links, New Delhi",
    budget: "Above ₹1 Crore",
    message: "Turnkey luxury villa architectural interior design enquiry.",
    status: "New" as const,
  };

  const enquiryRes = await saveEnquiry(testEnquiry);
  assert(enquiryRes.success, "Contact form enquiry saved to database");

  const enquiriesList = await getEnquiries();
  const savedLead = enquiriesList.find((e) => e.name === testEnquiry.name);
  assert(Boolean(savedLead && savedLead.phone === testEnquiry.phone), "Enquiry correctly retrieved from database");

  if (savedLead) {
    // Update status to Contacted
    await updateEnquiryStatus(savedLead.id, "Contacted", "Called client, booked site visit for Saturday.");
    const updatedList = await getEnquiries();
    const updatedLead = updatedList.find((e) => e.id === savedLead.id);
    assert(updatedLead?.status === "Contacted", "Enquiry status updated to 'Contacted'");

    // Clean up
    await deleteEnquiry(savedLead.id);
    console.log("  Cleaned up test enquiry.");
  }

  // ─── 7. Backup & Restore ────────────────────────────────────────────────────
  console.log("\n7️⃣ TEST: BACKUP EXPORT & STORE STRUCTURE");
  const fullBackup = await getFullSiteStore();
  const requiredKeys = [
    "settings",
    "navServices",
    "detailedServices",
    "specialties",
    "projects",
    "categories",
    "testimonials",
    "team",
    "philosophyCarousel",
    "pageSeo",
    "media",
  ];
  const allKeysPresent = requiredKeys.every((k) => k in fullBackup);
  assert(allKeysPresent, "Full Site Store JSON contains all 11 required website entities");

  // ─── 8. Security & Admin Authentication ─────────────────────────────────────
  console.log("\n8️⃣ TEST: SECURITY, RATE LIMITING & ROBOTS.TXT DISALLOW");
  const hashed = hashPassword("TestAdminPassword#2026");
  const valid = verifyPassword("TestAdminPassword#2026", hashed);
  const invalid = verifyPassword("WrongPassword", hashed);
  assert(valid && !invalid, "PBKDF2 password hashing and constant-time verification passed");

  // Rate Limiting
  const testIp = "192.168.1.99";
  resetLoginRateLimit(testIp);
  for (let i = 0; i < 5; i++) {
    recordLoginFailure(testIp);
  }
  const rateLimitCheck = checkLoginRateLimit(testIp);
  assert(!rateLimitCheck.allowed, "Login rate limiter blocks requests after exceeding 5 failed attempts");
  resetLoginRateLimit(testIp);

  // Check robots.txt Disallow
  const robotsTxtPath = path.join(process.cwd(), "public", "robots.txt");
  const robotsContent = fs.readFileSync(robotsTxtPath, "utf-8");
  assert(robotsContent.includes("Disallow: /admin"), "robots.txt strictly disallows /admin");
  assert(robotsContent.includes("Disallow: /api"), "robots.txt strictly disallows /api");

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log("\n================================================================================");
  console.log(`🏁 TEST EXECUTION COMPLETE: ${passedTests.length} PASSED, ${failedTests.length} FAILED`);
  console.log("================================================================================");

  if (failedTests.length > 0) {
    process.exit(1);
  }
}

runEndToEndTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
