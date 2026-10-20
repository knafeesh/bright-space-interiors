const BASE_URL = "https://www.brightspaceinterior.in";

async function verifyLiveSite() {
  console.log("================================================================================");
  console.log("🔍 TESTING LIVE WEBSITE & FIRESTORE CLOUD INTEGRATION");
  console.log("URL:", BASE_URL);
  console.log("================================================================================");

  const results = [];
  const logPass = (desc) => {
    console.log(`  ✅ [PASS] ${desc}`);
    results.push({ desc, pass: true });
  };
  const logFail = (desc, err) => {
    console.error(`  ❌ [FAIL] ${desc}`, err || "");
    results.push({ desc, pass: false, err });
  };

  // 1. Check storage mode from content route
  console.log("\n1️⃣ Checking Storage Status & Firestore Configuration...");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/content`, { cache: "no-store" });
    const data = await res.json();
    if (data.isFirebaseConfigured && data.storageMode === "firestore") {
      logPass("Firestore Cloud Database is actively configured and connected!");
    } else {
      logFail(`Storage mode is: ${data.storageMode}, isFirebaseConfigured: ${data.isFirebaseConfigured}`);
    }
    if (data.store && Array.isArray(data.store.projects)) {
      logPass(`Full store loaded from Firestore (${data.store.projects.length} projects, ${data.store.detailedServices?.length || 0} services)`);
    } else {
      logFail("Store payload missing projects array");
    }
  } catch (err) {
    logFail("Failed to fetch /api/admin/content", err.message);
  }

  // 2. Admin Authentication & Session
  console.log("\n2️⃣ Checking Admin Authentication & Session Security...");
  let sessionCookie = "";
  try {
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || "Azam",
        password: process.env.ADMIN_PASSWORD || "Azam@2005",
      }),
    });
    const setCookie = loginRes.headers.get("set-cookie");
    if (loginRes.ok && setCookie) {
      sessionCookie = setCookie.split(";")[0];
      logPass("Admin login succeeded, secure session cookie generated");
    } else {
      logFail(`Admin login returned status ${loginRes.status}`);
    }
  } catch (err) {
    logFail("Admin login request failed", err.message);
  }

  // 3. Authenticated Admin API Endpoints
  console.log("\n3️⃣ Testing Admin Management Endpoints...");
  const endpoints = [
    { name: "Projects", path: "/api/admin/projects" },
    { name: "Services", path: "/api/admin/services" },
    { name: "Settings", path: "/api/admin/settings" },
    { name: "Testimonials", path: "/api/admin/testimonials" },
    { name: "Enquiries/Leads", path: "/api/admin/enquiries" },
    { name: "Media Assets", path: "/api/admin/media" },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BASE_URL}${ep.path}`, {
        headers: { Cookie: sessionCookie },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        logPass(`Admin endpoint ${ep.name} returned 200 OK (${Object.keys(data).join(", ")})`);
      } else {
        logFail(`Admin endpoint ${ep.name} returned HTTP ${res.status}`);
      }
    } catch (err) {
      logFail(`Admin endpoint ${ep.name} fetch failed`, err.message);
    }
  }

  // 4. Public Pages & Dynamic Rendering
  console.log("\n4️⃣ Verifying Public Frontend Pages...");
  const publicPages = [
    { name: "Homepage", path: "/" },
    { name: "Portfolio Grid", path: "/portfolio" },
    { name: "Project Detail", path: "/portfolio/rawls-salon-luxury" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Sitemap XML", path: "/sitemap.xml" },
  ];

  for (const page of publicPages) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`, { cache: "no-store" });
      if (res.ok) {
        const text = await res.text();
        const hasContent = text.length > 500;
        if (hasContent) {
          logPass(`Public page ${page.name} (${page.path}) loaded with ${text.length} bytes`);
        } else {
          logFail(`Public page ${page.name} returned unusually short content (${text.length} bytes)`);
        }
      } else {
        logFail(`Public page ${page.name} returned HTTP ${res.status}`);
      }
    } catch (err) {
      logFail(`Public page ${page.name} failed`, err.message);
    }
  }

  console.log("\n================================================================================");
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`🏁 LIVE SITE HEALTH REPORT: ${passed}/${total} PASSED, ${failed} FAILED`);
  console.log("================================================================================");
}

verifyLiveSite();
