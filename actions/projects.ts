"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { z } from "zod";
import { serviceOptions } from "@/lib/content";
import { categories, type ActionState, type GalleryImage, type Project } from "@/lib/types";
import { cleanUrl, slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/session";
import { storeImage } from "@/lib/uploads";
import { ProjectModel } from "@/models/Project";
import { connectDB } from "@/lib/db";
import { insertSampleProjects } from "@/lib/projects";
import { readLocalProjects, writeLocalProjects } from "@/lib/local-projects";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Add a title.").max(120),
  slug: z.string().trim().min(1, "Add a URL slug.").max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens."),
  client: z.string().trim().min(1, "Add a client.").max(120),
  year: z.string().trim().min(2, "Add a year.").max(20),
  category: z.enum(categories),
  description: z.string().trim().min(1, "Add a description.").max(5000),
  shortDescription: z.string().trim().min(1, "Add a short description.").max(300),
  videoUrl: z.string().trim().max(500),
  order: z.number().int().min(0).max(999),
});

function refreshProjectPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/work/${previousSlug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

async function readImageField(formData: FormData, urlName: string, fileName: string) {
  const typed = String(formData.get(urlName) || "").trim();
  const file = formData.get(fileName);
  if (file instanceof File && file.size > 0) {
    return storeImage(file);
  }
  if (!typed) return "";
  const url = cleanUrl(typed);
  if (!url) throw new Error("Image links must be a full http(s) URL or a path on this site.");
  return url;
}

function readGallery(formData: FormData, title: string) {
  const existingRaw = String(formData.get("existingGallery") || "[]");
  let existing: GalleryImage[] = [];
  try {
    const parsed = JSON.parse(existingRaw) as unknown;
    if (Array.isArray(parsed)) {
      existing = parsed
        .map((item) => {
          const record = item as { url?: string; alt?: string };
          return {
            url: cleanUrl(String(record.url || "")),
            alt: String(record.alt || title).slice(0, 180),
          };
        })
        .filter((item) => item.url);
    }
  } catch {
    existing = [];
  }

  const lines = String(formData.get("galleryUrls") || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const extra: GalleryImage[] = [];
  for (const line of lines) {
    const url = cleanUrl(line);
    if (!url) throw new Error("Each gallery link must be a full http(s) URL or a path on this site.");
    extra.push({ url, alt: title });
  }

  return { existing, extra };
}

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "");
  const requestedSlug = String(formData.get("slug") || "") || slugify(title);

  const parsed = projectSchema.safeParse({
    title,
    slug: requestedSlug,
    client: String(formData.get("client") || ""),
    year: String(formData.get("year") || ""),
    category: String(formData.get("category") || ""),
    description: String(formData.get("description") || ""),
    shortDescription: String(formData.get("shortDescription") || ""),
    videoUrl: String(formData.get("videoUrl") || ""),
    order: Number(formData.get("order") || 0),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Check the form." };
  }

  const videoUrl = parsed.data.videoUrl ? cleanUrl(parsed.data.videoUrl) : "";
  if (parsed.data.videoUrl && !videoUrl) {
    return { ok: false, error: "Video URL must be a full http(s) link." };
  }

  const services = formData
    .getAll("services")
    .map(String)
    .filter((service) => (serviceOptions as readonly string[]).includes(service));

  try {
    let thumbnail = "";
    let heroImage = "";
    let gallery: GalleryImage[] = [];

    thumbnail = await readImageField(formData, "thumbnail", "thumbnailFile");
    heroImage = await readImageField(formData, "heroImage", "heroFile");
    const galleryInput = readGallery(formData, parsed.data.title);
    gallery = [...galleryInput.existing, ...galleryInput.extra];

    const files = formData.getAll("galleryFiles").filter((file): file is File => file instanceof File && file.size > 0);
    if (files.length > 8) {
      return { ok: false, error: "Upload up to 8 gallery images at a time." };
    }
    for (const file of files) {
      const url = await storeImage(file);
      gallery.push({ url, alt: parsed.data.title });
    }

    const payload = {
      ...parsed.data,
      videoUrl,
      services,
      thumbnail,
      heroImage,
      gallery,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    };

    let savedToDb = false;
    try {
      await connectDB();
      if (id) {
        if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID for DB");
        const clash = await ProjectModel.findOne({ slug: payload.slug, _id: { $ne: id } });
        if (clash) return { ok: false, error: "That URL slug is already in use." };
        const current = await ProjectModel.findById(id);
        if (!current) throw new Error("Not in DB");
        const previousSlug = current.slug as string;
        await ProjectModel.findByIdAndUpdate(id, payload);
        refreshProjectPaths(payload.slug, previousSlug);
        savedToDb = true;
      } else {
        const clash = await ProjectModel.findOne({ slug: payload.slug });
        if (clash) return { ok: false, error: "That URL slug is already in use." };
        await ProjectModel.create(payload);
        refreshProjectPaths(payload.slug);
        savedToDb = true;
      }
    } catch {
      savedToDb = false;
    }

    // If MongoDB is offline or unavailable, fallback to reliable local JSON storage
    if (!savedToDb) {
      const localProjects = await readLocalProjects();
      if (id) {
        const index = localProjects.findIndex((p) => p.id === id);
        if (index === -1) return { ok: false, error: "That project could not be found." };
        const clash = localProjects.find((p) => p.slug === payload.slug && p.id !== id);
        if (clash) return { ok: false, error: "That URL slug is already in use." };
        const previousSlug = localProjects[index].slug;
        localProjects[index] = {
          ...payload,
          id,
          updatedAt: new Date().toISOString(),
        };
        await writeLocalProjects(localProjects);
        refreshProjectPaths(payload.slug, previousSlug);
      } else {
        const clash = localProjects.find((p) => p.slug === payload.slug);
        if (clash) return { ok: false, error: "That URL slug is already in use." };
        const newProject: Project = {
          ...payload,
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localProjects.unshift(newProject);
        await writeLocalProjects(localProjects);
        refreshProjectPaths(payload.slug);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save the project.";
    return { ok: false, error: message };
  }

  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");

  try {
    if (mongoose.isValidObjectId(id)) {
      await connectDB();
      const project = await ProjectModel.findById(id);
      if (project) {
        await project.deleteOne();
        refreshProjectPaths(project.slug as string);
        redirect("/admin/projects");
      }
    }
  } catch {
    // fallback to local file
  }

  const local = await readLocalProjects();
  const match = local.find((p) => p.id === id);
  if (match) {
    const updated = local.filter((p) => p.id !== id);
    await writeLocalProjects(updated);
    refreshProjectPaths(match.slug);
  }
  redirect("/admin/projects");
}

export async function importSampleProjects(previous: { error: string }): Promise<{ error: string }> {
  void previous;
  await requireAdmin();
  try {
    await insertSampleProjects();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not import sample projects.";
    return { error: message };
  }
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  return { error: "" };
}
