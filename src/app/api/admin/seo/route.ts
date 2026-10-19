import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getPageSeoList,
  savePageSeo,
  getSiteSettings,
  saveFullSiteStore,
  getFullSiteStore,
  PageSeoItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

function checkPhoneInDescription(description: string, settings: any): string | null {
  if (!description) return null;
  // Match potential 10+ digit Indian numbers or formatted phone patterns
  const phonePattern = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g;
  const matches = description.match(phonePattern);
  if (!matches) return null;

  const normalize = (p: string) => (p || "").replace(/[^0-9]/g, "").slice(-10);
  const primaryNorm = normalize(settings?.phoneNumber || settings?.phone || "");
  const altNorm = normalize(settings?.altPhoneNumber || settings?.altPhone || "");

  for (const m of matches) {
    const norm = normalize(m);
    if (norm && norm !== primaryNorm && norm !== altNorm) {
      return `Warning: Description contains phone number "${m}" which is not listed in Site Settings.`;
    }
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const list = await getPageSeoList();
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, list, settings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load Page SEO." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, seoItem, list } = body;
    const settings = await getSiteSettings();

    // Bulk list replace
    if (action === "bulk" && Array.isArray(list)) {
      const store = await getFullSiteStore();
      store.pageSeo = list;
      const res = await saveFullSiteStore(store);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, list: await getPageSeoList() });
    }

    if (seoItem) {
      if (!seoItem.path || !seoItem.title) {
        return NextResponse.json({ success: false, error: "Path and title are required." }, { status: 400 });
      }

      // Canonical self-reference validation
      const cleanPath = seoItem.path.startsWith("/") ? seoItem.path : `/${seoItem.path}`;
      const expectedCanonical = `https://www.brightspaceinterior.in${cleanPath === "/" ? "" : cleanPath}`;
      const itemToSave: PageSeoItem = {
        ...seoItem,
        path: cleanPath,
        canonical: seoItem.canonical || expectedCanonical,
      };

      const warning = checkPhoneInDescription(itemToSave.description || "", settings);

      const res = await savePageSeo(itemToSave);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });

      return NextResponse.json({
        success: true,
        warning,
        item: itemToSave,
        list: await getPageSeoList(),
      });
    }

    return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving SEO." },
      { status: 500 }
    );
  }
}
