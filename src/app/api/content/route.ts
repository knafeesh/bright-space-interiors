import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDefaultCmsStore } from "@/lib/cms-types";
import { getDb, isFirebaseConfigured } from "@/lib/server/firebase-admin";
import { isAdminRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
};

// Firestore location of the whole CMS store (projects, services, specialties, media).
const CMS_COLLECTION = "site";
const CMS_DOC = "cms";

// Local & temporary storage paths
const STORE_PATH = path.join(process.cwd(), "src", "data", "cms-store.json");
const TMP_STORE_PATH = path.join("/tmp", "bright_space_cms_store.json");

// In-memory cache for fast response and serverless continuity
let memoryStore: Record<string, unknown> | null = null;

async function readStore() {
  if (isFirebaseConfigured()) {
    try {
      const snap = await getDb().collection(CMS_COLLECTION).doc(CMS_DOC).get();
      const data = snap.exists ? snap.data() : null;
      if (data && Array.isArray(data.projects)) {
        // Strip internal bookkeeping field before sending to clients
        const { updatedAt: _ignored, ...store } = data;
        return store;
      }
    } catch (err) {
      console.warn("Firestore read failed, falling back to local cache:", err);
    }
  }

  if (memoryStore && Array.isArray(memoryStore.projects)) {
    return memoryStore;
  }

  // Try reading from /tmp on serverless hosts
  try {
    const raw = await fs.readFile(TMP_STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.projects)) {
      memoryStore = parsed;
      return parsed;
    }
  } catch {}

  // Try reading from local project data file
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.projects)) {
      memoryStore = parsed;
      return parsed;
    }
  } catch {}

  return getDefaultCmsStore();
}

async function writeStore(store: Record<string, unknown>) {
  memoryStore = store;

  if (isFirebaseConfigured()) {
    try {
      await getDb()
        .collection(CMS_COLLECTION)
        .doc(CMS_DOC)
        .set({ ...store, updatedAt: Date.now() });
      return;
    } catch (err) {
      console.error("Firestore write failed, falling back to cache:", err);
    }
  }

  // Always attempt to write to /tmp (supported on Vercel serverless)
  try {
    await fs.mkdir(path.dirname(TMP_STORE_PATH), { recursive: true });
    await fs.writeFile(TMP_STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write to /tmp store:", err);
  }

  // Also attempt to write to local data directory if writable
  try {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Normal on Vercel read-only filesystem
  }
}

export async function GET() {
  try {
    return NextResponse.json(await readStore(), { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Error reading CMS store:", error);
    return NextResponse.json(getDefaultCmsStore(), { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Your admin session has expired. Please sign in again." },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const body = await req.json();
    if (
      !body ||
      typeof body !== "object" ||
      !Array.isArray(body.projects) ||
      !Array.isArray(body.services) ||
      !Array.isArray(body.specialties) ||
      !Array.isArray(body.media)
    ) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    await writeStore({
      projects: body.projects,
      services: body.services,
      specialties: body.specialties,
      media: body.media,
    });

    return NextResponse.json({ success: true, timestamp: Date.now() }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("Error saving CMS store:", error);
    const message = error instanceof Error ? error.message : "Failed to persist CMS store";
    return NextResponse.json({ error: message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
