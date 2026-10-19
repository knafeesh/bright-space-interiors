import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getCategories,
  saveCategory,
  deleteCategory,
  getFullSiteStore,
  saveFullSiteStore,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const categories = await getCategories();
    return NextResponse.json({ categories }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load categories." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { categorySlug, title, image } = body;

    if (!categorySlug || !title || !image) {
      return NextResponse.json({ error: "Category, title, and image required." }, { status: 400 });
    }

    const store = await getFullSiteStore();
    const list = [...(store.categories || [])];
    const catIdx = list.findIndex((c) => c.slug === categorySlug);
    if (catIdx === -1) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    const newDesign = {
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      image: image.trim(),
    };

    list[catIdx] = {
      ...list[catIdx],
      designs: [...(list[catIdx].designs || []), newDesign],
    };

    store.categories = list;
    await saveFullSiteStore(store);

    return NextResponse.json({
      success: true,
      message: `Design "${title}" added successfully.`,
      design: newDesign,
      categories: list,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save design." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, title, image, categorySlug, oldCategorySlug } = body;

    const store = await getFullSiteStore();
    const list = [...(store.categories || [])];

    // Remove from old category if category changed
    if (oldCategorySlug && oldCategorySlug !== categorySlug) {
      const oldIdx = list.findIndex((c) => c.slug === oldCategorySlug);
      if (oldIdx !== -1) {
        list[oldIdx] = {
          ...list[oldIdx],
          designs: (list[oldIdx].designs || []).filter((d: any) => d.id !== id),
        };
      }
    }

    const targetIdx = list.findIndex((c) => c.slug === categorySlug);
    if (targetIdx !== -1) {
      const designs = [...(list[targetIdx].designs || [])];
      const dIdx = designs.findIndex((d: any) => d.id === id);
      if (dIdx !== -1) {
        designs[dIdx] = { ...designs[dIdx], title: title.trim(), image: image.trim() };
      } else {
        designs.push({ id, title: title.trim(), image: image.trim() });
      }
      list[targetIdx] = { ...list[targetIdx], designs };
    }

    store.categories = list;
    await saveFullSiteStore(store);

    return NextResponse.json({
      success: true,
      message: `Design updated.`,
      categories: list,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update design." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const categorySlug = searchParams.get("categorySlug");

    const store = await getFullSiteStore();
    const list = [...(store.categories || [])];

    if (categorySlug) {
      const catIdx = list.findIndex((c) => c.slug === categorySlug);
      if (catIdx !== -1) {
        list[catIdx] = {
          ...list[catIdx],
          designs: (list[catIdx].designs || []).filter((d: any) => d.id !== id),
        };
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        list[i] = {
          ...list[i],
          designs: (list[i].designs || []).filter((d: any) => d.id !== id),
        };
      }
    }

    store.categories = list;
    await saveFullSiteStore(store);

    return NextResponse.json({
      success: true,
      message: "Design deleted.",
      categories: list,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete design." }, { status: 500 });
  }
}
