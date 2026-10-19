import crypto from "crypto";
import { NextResponse } from "next/server";

/**
 * Signed-cookie admin session and authentication utilities.
 * Protects all /admin and /api/admin routes.
 *
 * Env:
 *   ADMIN_SESSION_SECRET  – secret string used to sign admin session cookies
 *   ADMIN_USERNAME        – username override (defaults to "Azam")
 *   ADMIN_PASSWORD        – password override
 *   ADMIN_PASSWORD_HASH   – optional pre-hashed password (pbkdf2:salt:hex)
 */

export const SESSION_COOKIE = "bs_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// In-memory rate limiting map for login attempts: max 5 failed attempts per 15 mins per IP
interface RateLimitEntry {
  attempts: number;
  blockedUntil: number;
}
const rateLimits = new Map<string, RateLimitEntry>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry) return { allowed: true };

  if (entry.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Reset if expired
  if (entry.blockedUntil > 0 && entry.blockedUntil <= now) {
    rateLimits.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): number {
  const now = Date.now();
  const entry = rateLimits.get(ip) || { attempts: 0, blockedUntil: 0 };
  entry.attempts += 1;
  if (entry.attempts >= 5) {
    entry.blockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
  }
  rateLimits.set(ip, entry);
  return entry.attempts;
}

export function recordSuccessfulLogin(ip: string) {
  rateLimits.delete(ip);
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  return secret || "bright-space-interiors-super-secure-session-key-2026-fallback";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createSessionToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  try {
    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export function isAdminRequest(req: Request): boolean {
  const token = readCookie(req, SESSION_COOKIE);
  if (token && verifySessionToken(token)) return true;

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearer = authHeader.slice(7).trim();
    if (verifySessionToken(bearer)) return true;
  }

  return false;
}

export function requireAdmin(req: Request): NextResponse | null {
  if (!isAdminRequest(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Admin session required." },
      { status: 401 }
    );
  }
  return null;
}

export function getSessionCookieOptions(req?: Request) {
  const host = req?.headers.get("host") || "";
  const isProd = process.env.NODE_ENV === "production";
  const isBrightSpaceDomain = host.includes("brightspaceinterior.in");

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    domain: isProd && isBrightSpaceDomain ? ".brightspaceinterior.in" : undefined,
    maxAge: SESSION_TTL_SECONDS,
  };
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  domain: process.env.NODE_ENV === "production" ? ".brightspaceinterior.in" : undefined,
  maxAge: SESSION_TTL_SECONDS,
};

/**
 * PBKDF2 Password Hashing & Verification
 */
const SALT_FIXED = "bs_salt_auth_2026";

export function hashPassword(pwd: string, salt: string = SALT_FIXED): string {
  return crypto.pbkdf2Sync(pwd, salt, 20000, 32, "sha256").toString("hex");
}

export function verifyPassword(password: string, expectedHash: string, salt: string = SALT_FIXED): boolean {
  const inputHash = hashPassword(password, salt);
  const a = Buffer.from(inputHash);
  const b = Buffer.from(expectedHash);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export const recordLoginFailure = recordFailedLogin;
export const resetLoginRateLimit = recordSuccessfulLogin;

export function verifyAdminCredentials(inputUser: string, inputPass: string): boolean {
  const expectedUser = (process.env.ADMIN_USERNAME || "Azam").trim().toLowerCase();
  if (inputUser.trim().toLowerCase() !== expectedUser) {
    return false;
  }

  // Pre-hashed env var takes priority
  const hashFromEnv = process.env.ADMIN_PASSWORD_HASH;
  if (hashFromEnv) {
    const inputHash = hashPassword(inputPass);
    const a = Buffer.from(inputHash);
    const b = Buffer.from(hashFromEnv);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  const expectedPass = process.env.ADMIN_PASSWORD || "Azam@2005";
  const hashExpected = hashPassword(expectedPass);
  const hashInput = hashPassword(inputPass);

  const a = Buffer.from(hashInput);
  const b = Buffer.from(hashExpected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
