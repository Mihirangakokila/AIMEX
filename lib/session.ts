import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, signSessionToken, verifySessionToken } from "@/lib/session-token";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function createSession() {
  const token = await signSessionToken();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, cookieOptions);
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
