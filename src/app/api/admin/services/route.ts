import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getNavServices,
  saveNavServices,
  getDetailedServices,
  saveDetailedService,
  deleteService,
  getFullSiteStore,
  saveFullSiteStore,
  NavServiceItem,
  ServiceDetailItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const navServices = await getNavServices();
    const detailedServices = await getDetailedServices();
    const store = await getFullSiteStore();
    return NextResponse.json(
      {
        success: true,
        navServices,
        detailedServices,
        specialties: store.specialties || [],
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load services." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, data, items } = body;

    // Bulk reorder or update of nav services (the 6 homepage services)
    if (type === "navServices" && Array.isArray(items)) {
      const result = await saveNavServices(items as NavServiceItem[]);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Save failed." }, { status: 500 });
      }
      return NextResponse.json({ success: true, navServices: await getNavServices() });
    }

    // Single nav service update or add
    if (type === "navService" && data) {
      const current = await getNavServices();
      const list = [...current];
      const idx = list.findIndex((s) => s.slug === data.slug || s.id === data.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
      } else {
        list.push({
          id: data.id || `srv-${Date.now()}`,
          slug: data.slug || `service-${Date.now()}`,
          title: data.title || "New Service",
          description: data.description || "",
          image: data.image || "/images/hero-luxury.jpg",
          caption: data.caption || "",
          href: data.href || data.link || "/services",
          link: data.link || data.href || "/services",
          whatsappMsg: data.whatsappMsg || "",
          order: data.order || list.length + 1,
          published: data.published !== false,
        });
      }
      const result = await saveNavServices(list);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Save failed." }, { status: 500 });
      }
      return NextResponse.json({ success: true, navServices: await getNavServices() });
    }

    // Detailed service update (/services/[slug])
    if (type === "detailedService" && data) {
      const result = await saveDetailedService(data as ServiceDetailItem);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Save failed." }, { status: 500 });
      }
      return NextResponse.json({ success: true, detailedServices: await getDetailedServices() });
    }

    // Full store specialties update
    if (type === "specialties" && Array.isArray(items)) {
      const store = await getFullSiteStore();
      store.specialties = items;
      const result = await saveFullSiteStore(store);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Save failed." }, { status: 500 });
      }
      return NextResponse.json({ success: true, specialties: store.specialties });
    }

    return NextResponse.json({ success: false, error: "Invalid service type or payload." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving service." },
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
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ success: false, error: "Service slug is required." }, { status: 400 });
    }

    const result = await deleteService(slug);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || "Delete failed." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      navServices: await getNavServices(),
      detailedServices: await getDetailedServices(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting service." },
      { status: 500 }
    );
  }
}
