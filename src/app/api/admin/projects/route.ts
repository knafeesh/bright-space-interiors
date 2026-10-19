import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getProjects,
  saveProject,
  deleteProject,
  ProjectItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, projects }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body || !body.title) {
      return NextResponse.json({ success: false, error: "Project title is required." }, { status: 400 });
    }

    const result = await saveProject(body as ProjectItem);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Save to Firestore failed." }, { status: 500 });
    }

    const projects = await getProjects();
    return NextResponse.json({
      success: true,
      persisted: result.persisted,
      storage: result.storage,
      projects,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving project." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ success: false, error: "Project ID or slug required." }, { status: 400 });
    }

    const targetId = id ? parseInt(id, 10) : slug!;
    const result = await deleteProject(targetId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Delete failed." }, { status: 500 });
    }

    const projects = await getProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting project." },
      { status: 500 }
    );
  }
}
