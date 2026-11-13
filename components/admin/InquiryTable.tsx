"use client";

import { useTransition } from "react";
import { updateInquiryStatus } from "@/actions/inquiries";
import { inquiryStatuses, type Inquiry, type InquiryStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [pending, startTransition] = useTransition();

  if (inquiries.length === 0) {
    return <p className="text-cream/70">No inquiries yet.</p>;
  }

  return (
    <ul className="divide-y divide-white/10 border-t border-white/10">
      {inquiries.map((inquiry) => (
        <li key={inquiry.id} className="grid gap-4 py-6 lg:grid-cols-[1.2fr_0.8fr_0.7fr]">
          <div>
            <p className="font-display text-2xl uppercase">{inquiry.name}</p>
            <a href={`mailto:${inquiry.email}`} className="text-sm text-gold">
              {inquiry.email}
            </a>
            <p className="mt-2 text-sm text-cream/60">
              {[inquiry.company, inquiry.projectType, inquiry.budget].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed text-cream/80">{inquiry.message}</p>
          </div>
          <p className="text-sm text-cream/50">{formatDate(inquiry.createdAt)}</p>
          <label className="block text-sm">
            <span className="text-[11px] tracking-[0.18em] text-gold">STATUS</span>
            <select
              defaultValue={inquiry.status}
              disabled={pending}
              className="mt-2 w-full cursor-pointer border-b border-white/15 bg-transparent py-2 outline-none focus:border-gold"
              onChange={(event) => {
                const status = event.target.value as InquiryStatus;
                startTransition(() => {
                  void updateInquiryStatus(inquiry.id, status);
                });
              }}
            >
              {inquiryStatuses.map((status) => (
                <option key={status} value={status} className="bg-ink">
                  {status}
                </option>
              ))}
            </select>
          </label>
        </li>
      ))}
    </ul>
  );
}
