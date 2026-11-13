import type { Metadata } from "next";
import { AboutEditorial } from "@/components/home/AboutEditorial";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { ServicesExplorer } from "@/components/home/ServicesExplorer";
import { Showcase } from "@/components/home/Showcase";
import { getPublishedProjects } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "AIMEX — Creative & Digital Agency" },
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const projects = await getPublishedProjects();
  const featured = projects.filter((project) => project.featured);
  const selected = (featured.length ? featured : projects).slice(0, 5);
  const heroProjects = selected.length ? selected : projects.slice(0, 3);

  return (
    <main>
      <Hero projects={heroProjects} />
      <FeaturedWork projects={projects} />
      <AboutEditorial />
      <ServicesExplorer />
      <Showcase projects={projects.slice(0, 8)} />
      <Process />
      <ContactCta />
    </main>
  );
}
