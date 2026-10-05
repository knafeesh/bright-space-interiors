import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDefaultCmsStore } from "@/lib/cms-types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
};

const STORE_PATH = path.join(process.cwd(), "src", "data", "cms-store.json");

export async function GET() {
  try {
    try {
      const data = await fs.readFile(STORE_PATH, "utf-8");
      return NextResponse.json(JSON.parse(data), { headers: NO_CACHE_HEADERS });
    } catch {
      // If file doesn't exist yet, initialize with default store
      const initial = getDefaultCmsStore();
      const dir = path.dirname(STORE_PATH);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return NextResponse.json(initial, { headers: NO_CACHE_HEADERS });
    }
  } catch (error) {
    console.error("Error reading CMS store:", error);
    return NextResponse.json(getDefaultCmsStore(), { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    // Ensure target directory exists
    const dir = path.dirname(STORE_PATH);
    await fs.mkdir(dir, { recursive: true });

    // Write updated state to disk
    await fs.writeFile(STORE_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true, timestamp: Date.now() }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Error saving CMS store:", error);
    return NextResponse.json({ error: "Failed to persist CMS store" }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
