import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import {
  getSiteSettings,
  saveSiteSettings,
  SiteSettings,
} from "@/lib/server/site-db";

export const dynamic = "force-dynamic";

function validateSettings(s: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const phone = s.phoneNumber || s.phone || "";
  if (!phone || phone.replace(/[^0-9]/g, "").length < 10) {
    errors.push("Primary phone number must contain at least 10 digits.");
  }

  if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s.email).trim())) {
    errors.push("Please provide a valid primary email address.");
  }

  if (!s.address || String(s.address).trim().length < 5) {
    errors.push("Address is required (at least 5 characters).");
  }

  const whatsapp = s.whatsappNumber || s.whatsapp || "";
  if (whatsapp && whatsapp.replace(/[^0-9]/g, "").length < 10) {
    errors.push("WhatsApp number must contain at least 10 digits.");
  }

  const instagram = s.instagramUrl || s.instagram || "";
  if (instagram && !instagram.startsWith("http") && !instagram.startsWith("/")) {
    errors.push("Instagram link must be a valid URL (starting with https://).");
  }

  const facebook = s.facebookUrl || s.facebook || "";
  if (facebook && !facebook.startsWith("http") && !facebook.startsWith("/")) {
    errors.push("Facebook link must be a valid URL (starting with https://).");
  }

  return { valid: errors.length === 0, errors };
}

export async function GET(req: Request) {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to load settings." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized admin session." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = validateSettings(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.join(" "),
          validationErrors: validation.errors,
        },
        { status: 400 }
      );
    }

    const res = await saveSiteSettings(body as SiteSettings);
    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error || "Save to Firestore failed." },
        { status: 500 }
      );
    }

    const settings = await getSiteSettings();
    return NextResponse.json({
      success: true,
      persisted: res.persisted,
      storage: res.storage,
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error saving settings." },
      { status: 500 }
    );
  }
}
