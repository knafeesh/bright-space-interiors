import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getAllCategoriesFromDb,
  addDesignCardToDb,
  updateDesignCardInDb,
  deleteDesignCardFromDb,
} from "@/lib/server/design-ideas-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
};

/**
 * GET: Retrieve all 32 categories with their design cards
 */
export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const categories = await getAllCategoriesFromDb();
    return NextResponse.json({ categories }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error("[api/admin/design-ideas] GET error:", error);
    return NextResponse.json(
      { error: "Failed to load Design Ideas categories." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

/**
 * POST: Add a new design card to a category
 */
export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const body = await req.json();
    const { categorySlug, title, image } = body;

    if (!categorySlug || typeof categorySlug !== "string") {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Design title is required." }, { status: 400 });
    }
    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json({ error: "Design image is required." }, { status: 400 });
    }

    const result = await addDesignCardToDb(categorySlug, {
      title: title.trim(),
      image: image.trim(),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to add design." }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Design "${title.trim()}" added successfully.`,
        design: result.design,
        categories: result.categories,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("[api/admin/design-ideas] POST error:", error);
    return NextResponse.json(
      { error: "Failed to save new design. Please try again." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

/**
 * PUT: Edit / replace an existing design card
 */
export async function PUT(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const body = await req.json();
    const { id, title, image, categorySlug, oldCategorySlug } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Design ID is required." }, { status: 400 });
    }
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Design title is required." }, { status: 400 });
    }
    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json({ error: "Design image is required." }, { status: 400 });
    }
    if (!categorySlug || typeof categorySlug !== "string") {
      return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }

    const result = await updateDesignCardInDb(id, {
      title: title.trim(),
      image: image.trim(),
      categorySlug,
      oldCategorySlug,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to update design." }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: `Design "${title.trim()}" updated successfully.`,
        design: result.design,
        categories: result.categories,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("[api/admin/design-ideas] PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update design. Please try again." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

/**
 * DELETE: Delete a design card
 */
export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session required." },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const categorySlug = url.searchParams.get("categorySlug") || undefined;

    if (!id) {
      return NextResponse.json({ error: "Design ID is required." }, { status: 400 });
    }

    const result = await deleteDesignCardFromDb(id, categorySlug);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete design." }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Design deleted successfully.",
        id,
        categories: result.categories,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("[api/admin/design-ideas] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete design. Please try again." },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
