"use client";

import { deleteProject } from "@/actions/projects";

export function DeleteProjectButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProject}
      onSubmit={(event) => {
        if (!window.confirm("Delete this project?")) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="cursor-pointer text-sm text-cream/60 hover:text-gold">
        Delete
      </button>
    </form>
  );
}
