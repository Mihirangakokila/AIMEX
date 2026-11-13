"use client";

import { useActionState } from "react";
import { importSampleProjects } from "@/actions/projects";

export function ImportSamplesButton() {
  const [state, action, pending] = useActionState(importSampleProjects, { error: "" });
  return (
    <form action={action} className="mt-6">
      {state.error && <p className="mb-3 text-sm text-gold">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="cursor-pointer border border-gold px-5 py-3 text-[11px] tracking-[0.2em] text-gold uppercase hover:bg-gold hover:text-ink disabled:opacity-70"
      >
        {pending ? "Importing..." : "Import sample projects"}
      </button>
    </form>
  );
}
