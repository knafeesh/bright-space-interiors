import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  saveFullSiteStore,
  getFullSiteStore,
  TestimonialItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json({ success: true, testimonials }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load testimonials." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, testimonial, testimonials } = body;

    // Bulk reorder or replace
    if (action === "bulk" && Array.isArray(testimonials)) {
      const store = await getFullSiteStore();
      store.testimonials = testimonials;
      const res = await saveFullSiteStore(store);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, testimonials: await getTestimonials() });
    }

    if (testimonial) {
      if (!testimonial.author || !testimonial.quote) {
        return NextResponse.json({ success: false, error: "Author and quote are required." }, { status: 400 });
      }
      const res = await saveTestimonial(testimonial as TestimonialItem);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, testimonials: await getTestimonials() });
    }

    return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving testimonial." },
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

    const res = await deleteTestimonial(parseInt(id, 10));
    if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
    return NextResponse.json({ success: true, testimonials: await getTestimonials() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting testimonial." },
      { status: 500 }
    );
  }
}
