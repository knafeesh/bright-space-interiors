import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getFullSiteStore,
  saveFullSiteStore,
  FullSiteStore,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

function validateStoreSchema(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, errors: ["Import payload must be a JSON object containing store data."] };
  }

  if (data.settings && typeof data.settings !== "object") {
    errors.push("Invalid 'settings' object in backup.");
  }

  if (data.projects && !Array.isArray(data.projects)) {
    errors.push("Invalid 'projects' field; expected array.");
  }

  if (data.navServices && !Array.isArray(data.navServices)) {
    errors.push("Invalid 'navServices' field; expected array.");
  }

  if (data.categories && !Array.isArray(data.categories)) {
    errors.push("Invalid 'categories' field; expected array.");
  }

  if (data.testimonials && !Array.isArray(data.testimonials)) {
    errors.push("Invalid 'testimonials' field; expected array.");
  }

  if (data.team && !Array.isArray(data.team)) {
    errors.push("Invalid 'team' field; expected array.");
  }

  if (data.philosophyCarousel && !Array.isArray(data.philosophyCarousel)) {
    errors.push("Invalid 'philosophyCarousel' field; expected array.");
  }

  return { valid: errors.length === 0, errors };
}

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const store = await getFullSiteStore();
    const backupJson = JSON.stringify(
      {
        site: "Bright Space Interiors",
        exportDate: new Date().toISOString(),
        version: "2.0.0",
        store,
      },
      null,
      2
    );

    return new NextResponse(backupJson, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="bright-space-backup-${new Date().toISOString().split("T")[0]}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Export failed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const storeData = body.store || body;

    const validation = validateStoreSchema(storeData);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: `Import failed schema validation: ${validation.errors.join("; ")}`,
        },
        { status: 400 }
      );
    }

    const current = await getFullSiteStore();
    const mergedStore: FullSiteStore = {
      ...current,
      ...storeData,
    };

    const res = await saveFullSiteStore(mergedStore);
    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error || "Save to Firestore failed." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Backup successfully imported and persisted to Firestore.",
      persisted: res.persisted,
      storage: res.storage,
      counts: {
        projects: mergedStore.projects?.length || 0,
        navServices: mergedStore.navServices?.length || 0,
        categories: mergedStore.categories?.length || 0,
        testimonials: mergedStore.testimonials?.length || 0,
        team: mergedStore.team?.length || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error importing backup." },
      { status: 500 }
    );
  }
}
