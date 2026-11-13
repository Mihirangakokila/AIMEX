import type { Metadata } from "next";
import { InquiryTable } from "@/components/admin/InquiryTable";
import { getInquiries } from "@/lib/inquiries";
import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inquiries",
};

export default async function InquiriesPage() {
  let inquiries: Awaited<ReturnType<typeof getInquiries>> = [];
  let offline = !isDatabaseConfigured();

  if (!offline) {
    try {
      inquiries = await getInquiries();
    } catch {
      offline = true;
    }
  }

  return (
    <div>
      <p className="text-[11px] tracking-[0.22em] text-gold">CONTACT</p>
      <h1 className="mt-3 mb-10 font-display text-5xl uppercase">Inquiries</h1>
      {offline ? (
        <p className="max-w-xl text-sm text-cream/70">Connect MongoDB to store and review contact form submissions.</p>
      ) : (
        <InquiryTable inquiries={inquiries} />
      )}
    </div>
  );
}
