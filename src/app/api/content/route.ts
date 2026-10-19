import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getFullSiteStore, saveFullSiteStore } from "@/lib/server/site-db";
import { CmsStore } from "@/lib/cms-types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CORS_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Cookie, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const siteStore = await getFullSiteStore();
    const cmsStore: CmsStore = {
      projects: (siteStore.projects || []).filter((p) => p.status === "published") as any,
      services: (siteStore.detailedServices || []).map((d) => ({
        slug: d.slug,
        title: d.title,
        description: d.description,
        image: d.image,
        tagline: d.subtitle,
        deliverables: d.subServices,
        faqs: d.faqs || [],
      })) as any,
      specialties: (siteStore.specialties || []) as any,
      media: (siteStore.media || []).map((m) => ({
        id: m.id,
        url: m.url,
        caption: m.name || m.altText,
        alt: m.altText,
        date: m.dateAdded,
        usage: [],
      })) as any,
      updatedAt: siteStore.updatedAt || Date.now(),
    };
    return NextResponse.json(cmsStore, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error reading CMS store:", error);
    return NextResponse.json(
      { projects: [], services: [], specialties: [], media: [], updatedAt: Date.now() },
      { headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Your admin session has expired. Please sign in again." },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400, headers: CORS_HEADERS });
    }

    const currentSiteStore = await getFullSiteStore();

    if (Array.isArray(body.projects)) {
      currentSiteStore.projects = body.projects;
    }
    if (Array.isArray(body.specialties)) {
      currentSiteStore.specialties = body.specialties;
    }

    await saveFullSiteStore(currentSiteStore);

    return NextResponse.json({ success: true, timestamp: Date.now() }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error saving CMS store:", error);
    const message = error instanceof Error ? error.message : "Failed to persist CMS store";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
