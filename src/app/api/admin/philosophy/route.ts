import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getPhilosophyCarousel,
  savePhilosophyCarousel,
  PhilosophySlide,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const slides = await getPhilosophyCarousel();
    return NextResponse.json({ success: true, slides }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load philosophy carousel." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slides, slide, action } = body;

    // Full replacement / reorder of slides
    if (Array.isArray(slides)) {
      const res = await savePhilosophyCarousel(slides);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, slides: await getPhilosophyCarousel() });
    }

    // Add or edit individual slide
    if (slide && slide.src) {
      const current = await getPhilosophyCarousel();
      const list = [...current];
      const idx = list.findIndex((s) => s.id === slide.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...slide };
      } else {
        list.push({
          id: slide.id || `slide-${Date.now()}`,
          src: slide.src,
          alt: slide.alt || "Bright Space Interior Design Philosophy",
          caption: slide.caption || "",
          order: slide.order || list.length + 1,
        });
      }
      const res = await savePhilosophyCarousel(list);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, slides: await getPhilosophyCarousel() });
    }

    return NextResponse.json({ success: false, error: "Invalid payload." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving philosophy carousel." },
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
      return NextResponse.json({ success: false, error: "Slide ID required." }, { status: 400 });
    }

    const current = await getPhilosophyCarousel();
    const filtered = current.filter((s) => s.id !== id);
    const res = await savePhilosophyCarousel(filtered);
    if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
    return NextResponse.json({ success: true, slides: await getPhilosophyCarousel() });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting slide." },
      { status: 500 }
    );
  }
}
