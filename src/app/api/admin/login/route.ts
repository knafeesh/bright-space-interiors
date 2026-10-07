import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCredentials,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const valid = getAdminCredentials();

    if (
      typeof username === "string" &&
      username.trim().toLowerCase() === valid.username.toLowerCase() &&
      password === valid.password
    ) {
      const res = NextResponse.json({
        success: true,
        user: {
          username: "Azam",
          name: "Azam Khan",
          role: "Super Admin",
        },
      });
      res.cookies.set(SESSION_COOKIE, createSessionToken(valid.username), sessionCookieOptions);
      return res;
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
