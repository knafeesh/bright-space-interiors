import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getMediaAssets,
  saveMediaAsset,
  deleteMediaAsset,
  findImageUsage,
  MediaAssetItem,
  getFullSiteStore,
  saveFullSiteStore,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const media = await getMediaAssets();
    return NextResponse.json({ success: true, media }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load media." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, asset, assets } = body;

    // Check usage of an image before attempting delete
    if (action === "check-usage" && body.url) {
      const usage = await findImageUsage(body.url);
      return NextResponse.json({
        success: true,
        inUse: usage.length > 0,
        usage,
      });
    }

    // Deduplicate media assets
    if (action === "deduplicate") {
      const store = await getFullSiteStore();
      const seen = new Set<string>();
      const deduped: MediaAssetItem[] = [];

      for (const m of store.media || []) {
        if (!seen.has(m.url)) {
          seen.add(m.url);
          deduped.push(m);
        }
      }

      store.media = deduped;
      await saveFullSiteStore(store);
      return NextResponse.json({ success: true, media: deduped });
    }

    // Save individual asset (e.g. updating alt text or title)
    if (asset) {
      const res = await saveMediaAsset(asset as MediaAssetItem);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, media: await getMediaAssets() });
    }

    return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving media." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const url = searchParams.get("url");

    if (!id && !url) {
      return NextResponse.json({ success: false, error: "Media ID or URL required." }, { status: 400 });
    }

    const target = id || url!;
    const res = await deleteMediaAsset(target);

    if (!res.success) {
      return NextResponse.json(
        {
          success: false,
          error: res.error || "Cannot delete image.",
          usedIn: res.usedIn || [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, media: await getMediaAssets() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting media." },
      { status: 500 }
    );
  }
}
