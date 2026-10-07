import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { getBucket, isFirebaseConfigured } from "@/lib/server/firebase-admin";
import { isAdminRequest } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel request body limit is ~4.5 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function safeBaseName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image"
  );
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { error: "Your admin session has expired. Please sign in again." },
      { status: 401 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Only JPG, PNG, WebP, GIF or AVIF images are allowed" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 4 MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${safeBaseName(file.name)}.${ext}`;

    if (isFirebaseConfigured()) {
      const bucket = getBucket();
      const objectPath = `uploads/${fileName}`;
      const token = crypto.randomUUID();

      await bucket.file(objectPath).save(buffer, {
        resumable: false,
        contentType: file.type,
        metadata: {
          cacheControl: "public, max-age=31536000, immutable",
          // Firebase download token → permanent public URL without opening Storage rules
          metadata: { firebaseStorageDownloadTokens: token },
        },
      });

      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
        objectPath
      )}?alt=media&token=${token}`;

      return NextResponse.json({ url, name: fileName, size: file.size, type: file.type });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Image storage is not configured (missing FIREBASE_* env vars)." },
        { status: 503 }
      );
    }

    // Local-dev fallback: save into /public/uploads
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, fileName), buffer);
    return NextResponse.json({ url: `/uploads/${fileName}`, name: fileName, size: file.size, type: file.type });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
