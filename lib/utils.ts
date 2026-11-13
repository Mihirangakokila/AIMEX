import type { Category, Project } from "@/lib/types";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

const categoryLabels: Record<Category, string> = {
  WEB: "Web Design & Dev",
  BRANDING: "Branding & Identity",
  PHOTOGRAPHY: "Photography",
  VIDEO: "Videography & Film",
  SOCIAL: "Social & Content",
};

export function categoryLabel(category: Category) {
  return categoryLabels[category];
}

export function projectSubtitle(project: Pick<Project, "services" | "category">) {
  if (project.services.length) return project.services.slice(0, 2).join(" / ");
  return categoryLabel(project.category);
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function cleanUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("..")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return "";
  }
  return "";
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
