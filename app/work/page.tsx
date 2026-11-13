import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { PortfolioGrid } from "@/components/project/PortfolioGrid";
import { getPublishedProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description: "A portfolio of projects created by AIMEX across website design, branding, photography, video and social.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <main>
      <div className="px-5 pt-32 pb-10 md:px-10 md:pt-40 lg:px-14">
        <p className="text-[11px] font-mono tracking-[0.28em] text-gold uppercase">01 // PORTFOLIO</p>
        <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-none tracking-tight md:text-8xl">Work</h1>
        <p className="mt-6 max-w-lg text-cream/75">A curated selection of projects created by AIMEX across design, photography, film and social.</p>
        <div className="mt-12">
          <PortfolioGrid projects={projects} />
        </div>
      </div>
      <ContactCta />
    </main>
  );
}
