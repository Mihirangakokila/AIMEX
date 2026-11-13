import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "Add project",
};

export default function NewProjectPage() {
  return (
    <div>
      <p className="text-[11px] tracking-[0.22em] text-gold">PORTFOLIO</p>
      <h1 className="mt-3 mb-10 font-display text-5xl uppercase">Add project</h1>
      <ProjectForm />
    </div>
  );
}
