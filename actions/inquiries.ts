"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { projectTypes } from "@/lib/content";
import { createInquiry, setInquiryStatus } from "@/lib/inquiries";
import { requireAdmin } from "@/lib/session";
import type { ActionState, InquiryStatus } from "@/lib/types";
import { inquiryStatuses } from "@/lib/types";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Add your name.").max(120),
  email: z.email("Enter a valid email."),
  company: z.string().trim().max(120),
  projectType: z.enum(projectTypes),
  budget: z.string().trim().max(80),
  message: z.string().trim().min(1, "Add a message.").max(5000),
});

export async function submitInquiry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (String(formData.get("company_website") || "").trim()) {
    return { ok: true, message: "Thank you. We'll be in touch." };
  }

  const parsed = inquirySchema.safeParse({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    company: String(formData.get("company") || ""),
    projectType: String(formData.get("projectType") || ""),
    budget: String(formData.get("budget") || ""),
    message: String(formData.get("message") || ""),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Check the form." };
  }

  try {
    await createInquiry(parsed.data);
  } catch {
    return {
      ok: false,
      error: "The inquiry could not be sent yet. Connect MongoDB, then try again.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { ok: true, message: "Thank you. We'll be in touch." };
}

export async function quickInquiry(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "").trim();
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  try {
    await createInquiry({
      name: "New Lead (Hero)",
      email,
      company: "",
      projectType: "WEBSITES",
      budget: "Flexible",
      message: "Lead submitted via hero quick project form.",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Could not submit inquiry.";
    return { ok: false, error: msg };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  return { ok: true, message: "Thank you! We've received your inquiry and will reach out shortly." };
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  await requireAdmin();
  if (!inquiryStatuses.includes(status)) return;
  await setInquiryStatus(id, status);
  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
}
