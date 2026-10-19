import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getProjects,
  saveProject,
  deleteProject,
  isFirebaseConfigured,
  ProjectItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    const isConfigured = isFirebaseConfigured();
    const projects = await getProjects();
    return NextResponse.json(
      {
        projects,
        storageStatus: {
          isConfigured,
          firestoreReady: isConfigured,
          storageType: isConfigured ? "firestore" : "local_file_fallback",
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await saveProject(body as ProjectItem);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Save failed." }, { status: 500 });
    }
    const projects = await getProjects();
    return NextResponse.json({
      success: true,
      persisted: result.persisted,
      storage: result.storage,
      project: body,
      projects,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error saving project." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PUT(req);
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    if (!id && !slug) {
      return NextResponse.json({ error: "ID or slug required." }, { status: 400 });
    }

    const target = id ? parseInt(id, 10) : slug!;
    const result = await deleteProject(target);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Delete failed." }, { status: 500 });
    }

    const projects = await getProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error deleting project." },
      { status: 500 }
    );
  }
}
