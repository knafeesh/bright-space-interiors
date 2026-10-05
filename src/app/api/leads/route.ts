import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "src/data/leads.json");

function readLeads() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      const dir = path.dirname(FILE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(FILE_PATH, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading leads file:", err);
    return [];
  }
}

function writeLeads(leads: any[]) {
  try {
    const dir = path.dirname(FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing leads file:", err);
  }
}

export async function GET() {
  const leads = readLeads();
  return NextResponse.json(leads);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const leads = readLeads();
    const newLead = {
      id: body.id || Date.now(),
      name: body.name || "Anonymous",
      phone: body.phone || "",
      email: body.email || "",
      project: body.project || "General Inquiry",
      location: body.location || "Delhi NCR",
      budget: body.budget || "₹10–25 Lakhs",
      source: body.source || "Form",
      status: body.status || "New",
      assigned: body.assigned || "Mohd Mushir",
      date: body.date || new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      tags: body.tags || ["Website Lead"],
      notes: body.notes || "",
    };

    const updated = [newLead, ...leads];
    writeLeads(updated);
    return NextResponse.json(newLead, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, note } = body;
    const leads = readLeads();
    const updated = leads.map((l: any) => {
      if (l.id === id) {
        let updatedLead = { ...l };
        if (status) updatedLead.status = status;
        if (note) {
          const timestamp = new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
          updatedLead.notes = l.notes ? `${l.notes}\n[${timestamp}]: ${note}` : `[${timestamp}]: ${note}`;
        }
        return updatedLead;
      }
      return l;
    });
    writeLeads(updated);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const leads = readLeads();
    const updated = leads.filter((l: any) => l.id !== id);
    writeLeads(updated);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
