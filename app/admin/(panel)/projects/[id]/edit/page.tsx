import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit project",
};

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <p className="text-[11px] tracking-[0.22em] text-gold">PORTFOLIO</p>
      <h1 className="mt-3 mb-10 font-display text-5xl uppercase">Edit {project.title}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
