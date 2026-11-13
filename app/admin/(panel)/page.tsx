import type { Metadata } from "next";
import Link from "next/link";
import { ImportSamplesButton } from "@/components/admin/ImportSamplesButton";
import { getInquiries } from "@/lib/inquiries";
import { databaseProjectCount, getAllProjects } from "@/lib/projects";
import type { Inquiry, Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const database = await databaseProjectCount();
  let projects: Project[] = [];
  let inquiries: Inquiry[] = [];

  try {
    projects = await getAllProjects();
  } catch {
    projects = [];
  }

  try {
    inquiries = await getInquiries();
  } catch {
    inquiries = [];
  }

  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Featured", value: projects.filter((project) => project.featured).length },
    { label: "Drafts", value: projects.filter((project) => !project.published).length },
    { label: "New inquiries", value: inquiries.filter((item) => item.status === "NEW").length },
  ];

  return (
    <div>
      <p className="text-[11px] tracking-[0.22em] text-gold">DASHBOARD</p>
      <h1 className="mt-3 font-display text-5xl uppercase">Studio</h1>

      {database.status === "local" && (
        <div className="mt-8 max-w-2xl border border-gold/40 bg-gold/5 px-5 py-5 text-sm leading-relaxed text-cream/80">
          <p className="font-semibold text-gold">Local Storage Active</p>
          <p className="mt-1">
            Projects are saved directly to local storage (<code className="text-gold">data/projects.json</code>).
            You can add, edit, feature, and delete work immediately without running a database. To sync with MongoDB,
            add your <code className="text-gold">MONGODB_URI</code> in <code className="text-gold">.env.local</code>.
          </p>
        </div>
      )}

      {database.status === "empty" && (
        <div className="mt-8 max-w-2xl border border-white/15 px-5 py-5 text-sm leading-relaxed text-cream/80">
          The database is empty, so the public site is still showing starter projects. Import them to edit or replace
          the work, or add a project of your own. Once a project exists in the database, the starter set steps aside.
          <ImportSamplesButton />
        </div>
      )}

      <dl className="mt-10 grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-ink px-4 py-6">
            <dt className="text-[11px] tracking-[0.18em] text-gold uppercase">{stat.label}</dt>
            <dd className="mt-3 font-display text-4xl">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl uppercase">Featured projects</h2>
        <Link href="/admin/projects" className="text-[11px] tracking-[0.18em] text-gold">
          MANAGE
        </Link>
      </div>
      {database.status !== "ok" ? (
        <p className="mt-6 text-sm text-cream/60">Featured projects appear here once the database has work in it.</p>
      ) : projects.filter((project) => project.featured).length === 0 ? (
        <p className="mt-6 text-sm text-cream/60">No featured projects yet. Mark a project as featured to show it on the homepage.</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10 border-t border-white/10">
          {projects
            .filter((project) => project.featured)
            .map((project) => (
              <li key={project.id} className="flex items-baseline justify-between gap-4 py-4">
                <Link href={`/admin/projects/${project.id}/edit`} className="font-display text-xl uppercase hover:text-gold">
                  {project.title}
                </Link>
                <span className="text-sm text-cream/50">{project.category}</span>
              </li>
            ))}
        </ul>
      )}

      <div className="mt-12 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl uppercase">Recent inquiries</h2>
        <Link href="/admin/inquiries" className="text-[11px] tracking-[0.18em] text-gold">
          VIEW ALL
        </Link>
      </div>
      {inquiries.length === 0 ? (
        <p className="mt-6 text-sm text-cream/60">No inquiries yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10 border-t border-white/10">
          {inquiries.slice(0, 5).map((inquiry) => (
            <li key={inquiry.id} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
              <div>
                <p className="font-display text-xl uppercase">{inquiry.name}</p>
                <p className="text-sm text-cream/55">{inquiry.projectType}</p>
              </div>
              <p className="text-sm text-cream/50">
                {inquiry.status} · {formatDate(inquiry.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
