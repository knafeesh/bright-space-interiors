import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getFullSiteStore, saveFullSiteStore } from "@/lib/server/site-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const store = await getFullSiteStore();
    return NextResponse.json({ success: true, store }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("GET /api/admin/content error:", error);
    return NextResponse.json({ success: false, error: "Failed to read site data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid store payload." }, { status: 400 });
    }

    const currentStore = await getFullSiteStore();
    const updatedStore = { ...currentStore, ...body };
    const result = await saveFullSiteStore(updatedStore);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Failed to persist to Firestore." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      persisted: result.persisted,
      storage: result.storage,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("POST /api/admin/content error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to save store." },
      { status: 500 }
    );
  }
}
