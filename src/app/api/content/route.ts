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

// Local-dev fallback (only used when Firebase env vars are not set).
const STORE_PATH = path.join(process.cwd(), "src", "data", "cms-store.json");

async function readStore() {
  if (isFirebaseConfigured()) {
    const snap = await getDb().collection(CMS_COLLECTION).doc(CMS_DOC).get();
    const data = snap.exists ? snap.data() : null;
    if (data && Array.isArray(data.projects)) {
      // Strip internal bookkeeping field before sending to clients
      const { updatedAt: _ignored, ...store } = data;
      return store;
    }
    return getDefaultCmsStore();
  }

  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return getDefaultCmsStore();
  }
}

async function writeStore(store: Record<string, unknown>) {
  if (isFirebaseConfigured()) {
    await getDb()
      .collection(CMS_COLLECTION)
      .doc(CMS_DOC)
      .set({ ...store, updatedAt: Date.now() });
    return;
  }

  if (process.env.VERCEL) {
    // Vercel's filesystem is read-only — refuse instead of silently losing data.
    throw new Error("Persistent storage is not configured (missing FIREBASE_* env vars).");
  }
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
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
