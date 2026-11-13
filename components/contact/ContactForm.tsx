"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/actions/inquiries";
import { projectTypes } from "@/lib/content";
import type { ActionState } from "@/lib/types";

const initial: ActionState = { ok: false };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial);

  if (state.ok) {
    return (
      <div className="border-t border-white/10 pt-8" role="status">
        <p className="text-[11px] tracking-[0.22em] text-gold">INQUIRY SENT</p>
        <p className="mt-4 font-display text-4xl uppercase leading-none">Thank you. We&apos;ll be in touch.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-8">
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field label="Name" name="name" required autoComplete="name" />
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field label="Company" name="company" autoComplete="organization" />
      <label className="block">
        <span className="text-[11px] tracking-[0.22em] text-gold">PROJECT TYPE</span>
        <select
          name="projectType"
          required
          defaultValue=""
          className="mt-2 w-full cursor-pointer border-b border-white/15 bg-transparent py-3 text-cream outline-none focus:border-gold"
        >
          <option value="" disabled>
            Select a project type
          </option>
          {projectTypes.map((type) => (
            <option key={type} value={type} className="bg-ink">
              {type}
            </option>
          ))}
        </select>
      </label>
      <Field label="Budget" name="budget" placeholder="Approximate budget" />
      <label className="block">
        <span className="text-[11px] tracking-[0.22em] text-gold">MESSAGE</span>
        <textarea
          name="message"
          required
          rows={6}
          className="mt-2 w-full resize-y border-b border-white/15 bg-transparent py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      {state.error && (
        <p className="text-sm text-gold" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 cursor-pointer items-center bg-gold px-6 py-3 text-[11px] font-semibold tracking-[0.22em] text-ink uppercase transition-colors hover:bg-gold-soft disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Sending..." : "Send inquiry →"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.22em] text-gold">{label.toUpperCase()}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-white/15 bg-transparent py-3 text-cream outline-none placeholder:text-cream/30 focus:border-gold"
      />
    </label>
  );
}
