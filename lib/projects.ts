import { cache } from "react";
import mongoose from "mongoose";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { getSession } from "@/lib/session";
import { sampleAsProjects, sampleProjects } from "@/lib/sample-projects";
import { readLocalProjects, writeLocalProjects } from "@/lib/local-projects";
import { ProjectModel } from "@/models/Project";
import type { Category, GalleryImage, Project } from "@/lib/types";

type ProjectDoc = {
  _id: { toString(): string };
  title: string;
  slug: string;
  category: Category;
  year: string;
  client: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  heroImage?: string;
  gallery?: { url?: string; alt?: string }[];
  videoUrl?: string;
  services?: string[];
  featured?: boolean;
  published?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

function serialize(doc: ProjectDoc): Project {
  const gallery: GalleryImage[] = (doc.gallery ?? [])
    .filter((image) => image.url)
    .map((image) => ({ url: image.url || "", alt: image.alt || "" }));

  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    year: doc.year,
    client: doc.client,
    description: doc.description,
    shortDescription: doc.shortDescription,
    thumbnail: doc.thumbnail || "",
    heroImage: doc.heroImage || "",
    gallery,
    videoUrl: doc.videoUrl || "",
    services: doc.services ?? [],
    featured: Boolean(doc.featured),
    published: Boolean(doc.published),
    order: doc.order ?? 0,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

export const getPublishedProjects = cache(async (): Promise<Project[]> => {
  try {
    if (!isDatabaseConfigured()) {
      const local = await readLocalProjects();
      return local.filter((project) => project.published);
    }
    await connectDB();
    const count = await ProjectModel.countDocuments();
    if (count === 0) {
      const local = await readLocalProjects();
      return local.filter((project) => project.published);
    }
    const docs = (await ProjectModel.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .lean()) as unknown as ProjectDoc[];
    return docs.map(serialize);
  } catch {
    const local = await readLocalProjects();
    return local.filter((project) => project.published);
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const published = await getPublishedProjects();
  const match = published.find((project) => project.slug === slug);
  if (match) return match;

  const session = await getSession();
  if (!session) return null;

  try {
    if (isDatabaseConfigured()) {
      await connectDB();
      const doc = (await ProjectModel.findOne({ slug }).lean()) as unknown as ProjectDoc | null;
      if (doc) return serialize(doc);
    }
  } catch {
    // ignore
  }

  const allLocal = await readLocalProjects();
  return allLocal.find((project) => project.slug === slug) ?? null;
});

export async function getAllProjects(): Promise<Project[]> {
  try {
    await connectDB();
    const docs = (await ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean()) as unknown as ProjectDoc[];
    return docs.map(serialize);
  } catch {
    return readLocalProjects();
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    if (mongoose.isValidObjectId(id)) {
      await connectDB();
      const doc = (await ProjectModel.findById(id).lean()) as unknown as ProjectDoc | null;
      if (doc) return serialize(doc);
    }
  } catch {
    // ignore
  }
  const allLocal = await readLocalProjects();
  return allLocal.find((p) => p.id === id) ?? null;
}

export async function databaseProjectCount() {
  if (!isDatabaseConfigured()) {
    const local = await readLocalProjects();
    return { status: "local" as const, count: local.length };
  }
  try {
    await connectDB();
    const count = await ProjectModel.countDocuments();
    return { status: count === 0 ? ("empty" as const) : ("ok" as const), count };
  } catch {
    const local = await readLocalProjects();
    return { status: "local" as const, count: local.length };
  }
}

export async function insertSampleProjects() {
  try {
    await connectDB();
    let inserted = 0;
    for (const sample of sampleProjects) {
      const exists = await ProjectModel.exists({ slug: sample.slug });
      if (exists) continue;
      await ProjectModel.create(sample);
      inserted += 1;
    }
    return inserted;
  } catch {
    const defaults = sampleAsProjects();
    await writeLocalProjects(defaults);
    return defaults.length;
  }
}
