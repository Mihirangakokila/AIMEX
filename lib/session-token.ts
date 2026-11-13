import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "aimex_session";

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

export async function signSessionToken() {
  const key = secretKey();
  if (!key) throw new Error("AUTH_SECRET must be at least 16 characters.");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string) {
  const key = secretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    if (payload.role !== "admin") return null;
    return { role: "admin" as const };
  } catch {
    return null;
  }
}
