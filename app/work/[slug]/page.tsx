import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectStory } from "@/components/project/ProjectStory";
import { getProjectBySlug, getPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — AIMEX`,
      description: project.shortDescription,
      type: "article",
      images: project.heroImage || project.thumbnail ? [{ url: project.heroImage || project.thumbnail, alt: project.title }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getPublishedProjects();
  const index = projects.findIndex((item) => item.slug === project.slug);
  const list = index >= 0 ? projects : [project, ...projects];
  const current = index >= 0 ? index : 0;
  const previous = list.length > 1 ? list[(current - 1 + list.length) % list.length] : undefined;
  const next = list.length > 1 ? list[(current + 1) % list.length] : undefined;

  return (
    <main>
      <ProjectStory project={project} index={current} previous={previous} next={next} />
    </main>
  );
}
