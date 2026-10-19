import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getTeamMembers,
  saveTeamMember,
  deleteTeamMember,
  saveFullSiteStore,
  getFullSiteStore,
  TeamMemberItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const team = await getTeamMembers();
    return NextResponse.json({ success: true, team }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load team." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, member, team } = body;

    // Bulk reorder
    if (action === "bulk" && Array.isArray(team)) {
      const store = await getFullSiteStore();
      store.team = team;
      const res = await saveFullSiteStore(store);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, team: await getTeamMembers() });
    }

    if (member) {
      if (!member.name || !member.role) {
        return NextResponse.json({ success: false, error: "Name and role are required." }, { status: 400 });
      }
      const res = await saveTeamMember(member as TeamMemberItem);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, team: await getTeamMembers() });
    }

    return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving team member." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required." }, { status: 400 });
    }

    const res = await deleteTeamMember(parseInt(id, 10));
    if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
    return NextResponse.json({ success: true, team: await getTeamMembers() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting team member." },
      { status: 500 }
    );
  }
}
