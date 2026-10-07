import { NextResponse } from "next/server";
import { isAdminRequest, SESSION_COOKIE } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

/** GET → is the current browser logged in as admin? */
export async function GET(req: Request) {
  return NextResponse.json(
    { authenticated: isAdminRequest(req) },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** DELETE → log out (clear cookie). */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
