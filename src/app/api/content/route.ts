import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getFullStoreFromDb, saveFullStoreToDb } from "@/lib/server/portfolio-db";
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
    const store = await getFullStoreFromDb();
    return NextResponse.json(store, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error reading CMS store:", error);
    const store = await getFullStoreFromDb().catch(() => ({
      projects: [],
      services: [],
      specialties: [],
      media: [],
    }));
    return NextResponse.json(store, { headers: CORS_HEADERS });
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

    const currentStore = await getFullStoreFromDb();

    // Merge incoming arrays while preserving existing data if a field was omitted
    const nextStore: CmsStore = {
      projects: Array.isArray(body.projects) ? body.projects : currentStore.projects,
      services: Array.isArray(body.services) ? body.services : currentStore.services,
      specialties: Array.isArray(body.specialties) ? body.specialties : currentStore.specialties,
      media: Array.isArray(body.media) ? body.media : currentStore.media,
    };

    await saveFullStoreToDb(nextStore);

    return NextResponse.json({ success: true, timestamp: Date.now() }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Error saving CMS store:", error);
    const message = error instanceof Error ? error.message : "Failed to persist CMS store";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
