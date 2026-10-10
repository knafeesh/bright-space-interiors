import { NextResponse } from "next/server";
import { getAllCategoriesFromDb } from "@/lib/server/design-ideas-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Surrogate-Control": "no-store",
};

export async function GET() {
  try {
    const categories = await getAllCategoriesFromDb();
    return NextResponse.json(
      { categories },
      {
        headers: NO_CACHE_HEADERS,
      }
    );
  } catch (error) {
    console.error("[api/design-ideas] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load Design Ideas." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
