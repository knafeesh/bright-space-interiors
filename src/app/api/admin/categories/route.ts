import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getCategories,
  saveCategory,
  deleteCategory,
  saveFullSiteStore,
  getFullSiteStore,
  CategoryItem,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const categories = await getCategories();
    return NextResponse.json({ success: true, categories }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load categories." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, category, categories, designCard, categorySlug } = body;

    // Bulk categories update (e.g. reorder or batch publish)
    if (action === "bulk" && Array.isArray(categories)) {
      const store = await getFullSiteStore();
      store.categories = categories;
      const res = await saveFullSiteStore(store);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, categories: await getCategories() });
    }

    // Add or update category
    if (category) {
      if (!category.slug || !category.name) {
        return NextResponse.json({ success: false, error: "Category slug and name required." }, { status: 400 });
      }
      const res = await saveCategory(category);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, categories: await getCategories() });
    }

    // Add or edit design card within category
    if (designCard && categorySlug) {
      const store = await getFullSiteStore();
      const list = [...(store.categories || [])];
      const catIdx = list.findIndex((c) => c.slug === categorySlug);
      if (catIdx === -1) {
        return NextResponse.json({ success: false, error: "Category not found." }, { status: 404 });
      }

      const cat = { ...list[catIdx] };
      const designs = [...(cat.designs || [])];

      if (designCard.id) {
        const cardIdx = designs.findIndex((d) => d.id === designCard.id);
        if (cardIdx !== -1) {
          designs[cardIdx] = { ...designs[cardIdx], ...designCard };
        } else {
          designs.push(designCard);
        }
      } else {
        designs.push({
          ...designCard,
          id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        });
      }

      cat.designs = designs;
      list[catIdx] = cat;
      store.categories = list;
      const res = await saveFullSiteStore(store);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, categories: await getCategories() });
    }

    return NextResponse.json({ success: false, error: "Invalid action or payload." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving category." },
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
    const cardId = searchParams.get("cardId");
    const categorySlug = searchParams.get("categorySlug");

    // Delete card inside category
    if (cardId && categorySlug) {
      const store = await getFullSiteStore();
      const list = [...(store.categories || [])];
      const catIdx = list.findIndex((c) => c.slug === categorySlug);
      if (catIdx !== -1) {
        list[catIdx] = {
          ...list[catIdx],
          designs: (list[catIdx].designs || []).filter((d: any) => d.id !== cardId),
        };
        store.categories = list;
        await saveFullSiteStore(store);
      }
      return NextResponse.json({ success: true, categories: await getCategories() });
    }

    // Delete entire category
    if (slug) {
      const res = await deleteCategory(slug);
      if (!res.success) return NextResponse.json({ success: false, error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, categories: await getCategories() });
    }

    return NextResponse.json({ success: false, error: "Missing slug or cardId." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error deleting." },
      { status: 500 }
    );
  }
}
