import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/work`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/services`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/about`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
