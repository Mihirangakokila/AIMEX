"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/session";
import { safeEqual } from "@/lib/security";

export type LoginState = { error?: string };

const credentials = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter the password."),
});

function safeNext(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/admin";
  if (!value.startsWith("/admin") || value.startsWith("//") || value.startsWith("/admin/login")) {
    return "/admin";
  }
  return value;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 16 || !adminEmail || !adminPassword) {
    return {
      error: "Admin login is not configured. Set AUTH_SECRET, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.",
    };
  }

  const parsed = credentials.safeParse({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Check the form." };
  }

  const emailMatches = safeEqual(parsed.data.email, adminEmail);
  const passwordMatches = safeEqual(parsed.data.password, adminPassword);
  if (!emailMatches || !passwordMatches) {
    return { error: "Those details are not correct." };
  }

  await createSession();
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
