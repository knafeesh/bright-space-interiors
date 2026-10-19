import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getNavServices,
  saveNavServices,
  getDetailedServices,
  saveDetailedService,
  deleteService,
  getSpecialties,
  saveSpecialties,
  saveSpecialty,
  deleteSpecialty,
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
    const specialties = await getSpecialties();
    return NextResponse.json(
      {
        success: true,
        navServices,
        detailedServices,
        specialties,
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

    // Single specialty add / update
    if (type === "specialty" && data) {
      const result = await saveSpecialty(data);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Save failed." }, { status: 500 });
      }
      return NextResponse.json({ success: true, specialties: await getSpecialties() });
    }

    // Full store specialties update (bulk reorder)
    if (type === "specialties" && Array.isArray(items)) {
      const result = await saveSpecialties(items);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Save failed." }, { status: 500 });
      }
      return NextResponse.json({ success: true, specialties: await getSpecialties() });
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
    const specialtyId =
      searchParams.get("specialtyId") ||
      (searchParams.get("type") === "specialty" ? searchParams.get("id") || searchParams.get("name") : null);

    if (specialtyId) {
      const result = await deleteSpecialty(specialtyId);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error || "Delete failed." }, { status: 500 });
      }
      return NextResponse.json({ success: true, specialties: await getSpecialties() });
    }

    if (!slug) {
      return NextResponse.json({ success: false, error: "Service slug or specialtyId is required." }, { status: 400 });
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
