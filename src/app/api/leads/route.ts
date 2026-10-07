import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDb, isFirebaseConfigured } from "@/lib/server/firebase-admin";
import { isAdminRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

const NO_CACHE = { "Cache-Control": "no-store" };
const LEADS_COLLECTION = "leads";

// ─── Local-dev fallback (file) ───────────────────────────────────────────────
const FILE_PATH = path.join(process.cwd(), "src/data/leads.json");

function readLeadsFile(): any[] {
  try {
    if (!fs.existsSync(FILE_PATH)) return [];
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8") || "[]");
  } catch (err) {
    console.error("Error reading leads file:", err);
    return [];
  }
}

function writeLeadsFile(leads: any[]) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
}

function storageUnavailable() {
  return Boolean(process.env.VERCEL) && !isFirebaseConfigured();
}

function nowLabel() {
  return new Date().toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_CACHE });
}

// ─── Handlers ────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  // Leads contain customer phone numbers & emails — admin only.
  if (!isAdminRequest(req)) return unauthorized();

  try {
    if (isFirebaseConfigured()) {
      const snap = await getDb().collection(LEADS_COLLECTION).orderBy("createdAt", "desc").get();
      const leads = snap.docs.map((d) => {
        const { createdAt: _c, ...lead } = d.data();
        return lead;
      });
      return NextResponse.json(leads, { headers: NO_CACHE });
    }
    return NextResponse.json(readLeadsFile(), { headers: NO_CACHE });
  } catch (err) {
    console.error("Error reading leads:", err);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500, headers: NO_CACHE });
  }
}

export async function POST(req: Request) {
  // Public: the website contact forms submit here.
  try {
    const body = await req.json();
    const newLead = {
      id: Number(body.id) || Date.now(),
      name: String(body.name || "Anonymous").slice(0, 200),
      phone: String(body.phone || "").slice(0, 40),
      email: String(body.email || "").slice(0, 200),
      project: String(body.project || "General Inquiry").slice(0, 200),
      location: String(body.location || "Delhi NCR").slice(0, 200),
      budget: String(body.budget || "₹10–25 Lakhs").slice(0, 100),
      source: String(body.source || "Form").slice(0, 100),
      status: isAdminRequest(req) && body.status ? String(body.status).slice(0, 50) : "New",
      assigned: String(body.assigned || "Mohd Mushir").slice(0, 100),
      date: body.date || nowLabel(),
      tags: Array.isArray(body.tags) ? body.tags.slice(0, 10).map(String) : ["Website Lead"],
      notes: String(body.notes || "").slice(0, 5000),
    };

    if (isFirebaseConfigured()) {
      await getDb()
        .collection(LEADS_COLLECTION)
        .doc(String(newLead.id))
        .set({ ...newLead, createdAt: Date.now() });
    } else if (storageUnavailable()) {
      throw new Error("Persistent storage is not configured.");
    } else {
      writeLeadsFile([newLead, ...readLeadsFile().filter((l) => l.id !== newLead.id)]);
    }

    return NextResponse.json(newLead, { status: 201 });
  } catch (err) {
    console.error("Failed to save lead:", err);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id, status, note } = await req.json();
    const leadId = Number(id);
    if (!leadId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const applyUpdate = (l: any) => {
      const updated = { ...l };
      if (status) updated.status = String(status);
      if (note) {
        const stamp = nowLabel();
        updated.notes = l.notes ? `${l.notes}\n[${stamp}]: ${note}` : `[${stamp}]: ${note}`;
      }
      return updated;
    };

    if (isFirebaseConfigured()) {
      const ref = getDb().collection(LEADS_COLLECTION).doc(String(leadId));
      const snap = await ref.get();
      if (!snap.exists) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      const next = applyUpdate(snap.data());
      await ref.set(next);
    } else if (storageUnavailable()) {
      throw new Error("Persistent storage is not configured.");
    } else {
      writeLeadsFile(readLeadsFile().map((l) => (l.id === leadId ? applyUpdate(l) : l)));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update lead:", err);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    if (isFirebaseConfigured()) {
      await getDb().collection(LEADS_COLLECTION).doc(String(id)).delete();
    } else if (storageUnavailable()) {
      throw new Error("Persistent storage is not configured.");
    } else {
      writeLeadsFile(readLeadsFile().filter((l) => l.id !== id));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete lead:", err);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
