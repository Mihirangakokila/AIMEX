import type { Metadata } from "next";
import Link from "next/link";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { ImportSamplesButton } from "@/components/admin/ImportSamplesButton";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.22em] text-gold">PORTFOLIO</p>
          <h1 className="mt-3 font-display text-5xl uppercase">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="bg-gold px-5 py-3 text-[11px] tracking-[0.2em] text-ink uppercase">
          Add project
        </Link>
      </div>

      {projects.length === 0 && (
        <div className="mt-8 max-w-xl text-sm text-cream/70">
          No projects yet.
          <ImportSamplesButton />
        </div>
      )}

      <ul className="mt-10 divide-y divide-white/10 border-t border-white/10">
        {projects.map((project) => (
          <li key={project.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="font-display text-2xl uppercase">{project.title}</p>
              <p className="mt-1 text-sm text-cream/55">
                {project.category} · {project.year} · {project.published ? "Published" : "Draft"}
                {project.featured ? " · Featured" : ""} · Order {project.order}
              </p>
            </div>
            <div className="flex items-center gap-5">
              <Link href={`/work/${project.slug}`} className="text-sm text-cream/70 hover:text-gold">
                View
              </Link>
              <Link href={`/admin/projects/${project.id}/edit`} className="text-sm text-cream/70 hover:text-gold">
                Edit
              </Link>
              <DeleteProjectButton id={project.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
