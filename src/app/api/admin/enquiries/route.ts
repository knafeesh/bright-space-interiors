import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getEnquiries,
  saveEnquiry,
  deleteEnquiry,
  updateEnquiryStatus,
  EnquiryItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    let enquiries = await getEnquiries();
    if (statusFilter && statusFilter !== "All") {
      enquiries = enquiries.filter(
        (e) => (e.status || "New").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return NextResponse.json(
      { success: true, enquiries },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load enquiries." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status are required." }, { status: 400 });
    }

    const validStatuses = ["New", "Contacted", "Won", "Lost"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const res = await updateEnquiryStatus(String(id), status, notes);
    if (!res.success) {
      return NextResponse.json({ success: false, error: "Failed to update status." }, { status: 500 });
    }

    return NextResponse.json({ success: true, enquiries: await getEnquiries() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error updating enquiry." },
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

    const res = await deleteEnquiry(id);
    if (!res.success) {
      return NextResponse.json({ success: false, error: "Failed to delete enquiry." }, { status: 500 });
    }

    return NextResponse.json({ success: true, enquiries: await getEnquiries() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting enquiry." },
      { status: 500 }
    );
  }
}
