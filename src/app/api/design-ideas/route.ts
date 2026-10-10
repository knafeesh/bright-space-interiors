import { NextResponse } from "next/server";
import { getAllCategoriesFromDb } from "@/lib/server/design-ideas-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await getAllCategoriesFromDb();
    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("[api/design-ideas] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load Design Ideas." },
      { status: 500 }
    );
  }
}
