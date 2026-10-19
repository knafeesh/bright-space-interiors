import { NextResponse } from "next/server";
import {
  createSessionToken,
  verifyAdminCredentials,
  SESSION_COOKIE,
  sessionCookieOptions,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
  getClientIp,
} from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = checkLoginRateLimit(ip);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please wait ${limitCheck.retryAfterSeconds || 900} seconds before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      recordFailedLogin(ip);
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);

    if (isValid) {
      recordSuccessfulLogin(ip);
      const token = createSessionToken(username.trim());
      const res = NextResponse.json({
        success: true,
        token,
        user: {
          username: username.trim(),
          name: "Azam Khan",
          role: "Super Admin",
        },
      });
      res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
      return res;
    }

    const attempts = recordFailedLogin(ip);
    const remaining = Math.max(0, 5 - attempts);
    return NextResponse.json(
      {
        success: false,
        error: `Invalid credentials.${remaining > 0 ? ` ${remaining} attempt(s) remaining.` : " Account locked for 15 minutes."}`,
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
