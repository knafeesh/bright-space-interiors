import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDefaultCmsStore } from "@/lib/cms-types";

const STORE_PATH = path.join(process.cwd(), "src", "data", "cms-store.json");

export async function GET() {
  try {
    try {
      const data = await fs.readFile(STORE_PATH, "utf-8");
      return NextResponse.json(JSON.parse(data));
    } catch {
      // If file doesn't exist yet, initialize with default store
      const initial = getDefaultCmsStore();
      await fs.writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return NextResponse.json(initial);
    }
  } catch (error) {
    console.error("Error reading CMS store:", error);
    return NextResponse.json(getDefaultCmsStore());
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Ensure target directory exists
    const dir = path.dirname(STORE_PATH);
    await fs.mkdir(dir, { recursive: true });

    // Write updated state to disk
    await fs.writeFile(STORE_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (error) {
    console.error("Error saving CMS store:", error);
    return NextResponse.json({ error: "Failed to persist CMS store" }, { status: 500 });
  }
}
