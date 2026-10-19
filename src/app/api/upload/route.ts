import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getBucket, isFirebaseConfigured } from "@/lib/server/firebase-admin";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { addMediaAsset } from "@/lib/server/site-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // Allow up to 10 MB input which we then compress/resize
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
]);

function safeBaseName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "image"
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

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, GIF, AVIF or SVG images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image is too large. Max upload size is 10 MB." },
        { status: 413 }
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    let finalBuffer: Buffer = inputBuffer;
    let finalType = file.type;
    let finalExt = "webp";
    let width: number | undefined;
    let height: number | undefined;

    // Convert raster images to WebP and resize (max width 2048)
    if (file.type !== "image/svg+xml") {
      try {
        const pipeline = sharp(inputBuffer).rotate(); // auto-orient based on EXIF
        const meta = await pipeline.metadata();

        const processed = await pipeline
          .resize({
            width: 2048,
            height: 2048,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 85, effort: 4 })
          .toBuffer({ resolveWithObject: true });

        finalBuffer = processed.data;
        finalType = "image/webp";
        finalExt = "webp";
        width = processed.info.width;
        height = processed.info.height;
      } catch (err) {
        console.warn("Sharp conversion skipped, using original buffer:", err);
        finalExt = file.type.split("/")[1] || "png";
      }
    } else {
      finalExt = "svg";
      finalType = "image/svg+xml";
    }

    const fileName = `${Date.now()}-${safeBaseName(file.name)}.${finalExt}`;
    let finalUrl = "";

    // 1. Firebase Storage (Production / Persistent Cloud)
    if (isFirebaseConfigured()) {
      try {
        const bucket = getBucket();
        const objectPath = `uploads/${fileName}`;
        const token = crypto.randomUUID();

        await bucket.file(objectPath).save(finalBuffer, {
          resumable: false,
          contentType: finalType,
          metadata: {
            cacheControl: "public, max-age=31536000, immutable",
            metadata: { firebaseStorageDownloadTokens: token },
          },
        });

        finalUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
          objectPath
        )}?alt=media&token=${token}`;
      } catch (fbErr) {
        console.error("Firebase Storage upload error, falling back to local:", fbErr);
      }
    }

    // 2. Local fallback if Firebase not configured or failed
    if (!finalUrl) {
      if (process.env.VERCEL) {
        const base64 = finalBuffer.toString("base64");
        finalUrl = `data:${finalType};base64,${base64}`;
      } else {
        const dir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, fileName), finalBuffer);
        finalUrl = `/uploads/${fileName}`;
      }
    }

    // Register asset in site-db gallery/media list
    try {
      await addMediaAsset({
        id: fileName,
        url: finalUrl,
        name: file.name,
        folder: "uploads",
        size: `${Math.round(finalBuffer.length / 1024)} KB`,
        dimensions: width && height ? `${width}x${height}` : "2048x1365",
        type: finalType,
        altText: safeBaseName(file.name).replace(/-/g, " "),
        alt: safeBaseName(file.name).replace(/-/g, " "),
        dateAdded: new Date().toLocaleDateString("en-IN"),
      });
    } catch (dbErr) {
      console.warn("Could not register media asset in db:", dbErr);
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      name: fileName,
      size: finalBuffer.length,
      type: finalType,
      width,
      height,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
