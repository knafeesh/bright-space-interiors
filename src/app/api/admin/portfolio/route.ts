import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getProjectsFromDb,
  updateProjectInDb,
  addProjectToDb,
  deleteProjectFromDb,
} from "@/lib/server/portfolio-db";
import { Project } from "@/lib/cms-types";
import { getDb, isFirebaseConfigured } from "@/lib/server/firebase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CORS_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Cookie, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET: Retrieve all portfolio projects
 */
export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const isConfigured = isFirebaseConfigured();
    let firestoreError: string | null = null;
    let docExists = false;
    let docProjectsCount = 0;
    if (isConfigured) {
      try {
        const snap = await getDb().collection("site").doc("cms").get();
        docExists = snap.exists;
        if (snap.exists) {
          const d = snap.data();
          docProjectsCount = Array.isArray(d?.projects) ? d.projects.length : 0;
        }
      } catch (err: unknown) {
        firestoreError = err instanceof Error ? err.message : String(err);
      }
    }

    const projects = await getProjectsFromDb();
    return NextResponse.json({
      projects,
      storageStatus: {
        isConfigured,
        firestoreReady: isConfigured && docExists,
      }
    }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("[api/admin/portfolio] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio projects." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * PUT: Edit an existing portfolio project with full field update
 */
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Your admin session has expired. Please sign in again." },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid project data provided." }, { status: 400, headers: CORS_HEADERS });
    }

    if (!body.id && !body.slug) {
      return NextResponse.json({ error: "Project ID or slug is required for update." }, { status: 400, headers: CORS_HEADERS });
    }

    const result = await updateProjectInDb(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update project." }, { status: 400, headers: CORS_HEADERS });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Project "${result.project?.title}" saved successfully.`,
        project: result.project,
        projects: result.projects,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("[api/admin/portfolio] PUT error:", error);
    const message = error instanceof Error ? error.message : "Failed to update project.";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * POST: Create a new portfolio project
 */
export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Your admin session has expired. Please sign in again." },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== "object" || !body.title) {
      return NextResponse.json({ error: "Project title is required." }, { status: 400, headers: CORS_HEADERS });
    }

    const result = await addProjectToDb(body as Project);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to add project." }, { status: 400, headers: CORS_HEADERS });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Project "${result.project?.title}" added successfully.`,
        project: result.project,
        projects: result.projects,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("[api/admin/portfolio] POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to add project.";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}

/**
 * DELETE: Remove a portfolio project by ID
 */
export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Your admin session has expired. Please sign in again." },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id)) {
      return NextResponse.json({ error: "Valid numeric Project ID is required." }, { status: 400, headers: CORS_HEADERS });
    }

    const result = await deleteProjectFromDb(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete project." }, { status: 400, headers: CORS_HEADERS });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project removed successfully.",
        projects: result.projects,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("[api/admin/portfolio] DELETE error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete project.";
    return NextResponse.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
