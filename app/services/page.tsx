import type { Metadata } from "next";
import { ContactCta } from "@/components/home/ContactCta";
import { ServicesExplorer } from "@/components/home/ServicesExplorer";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website design & development, branding & graphic design, photography, videography, and social media content by AIMEX.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="pt-16">
      <ServicesExplorer titleAs="h1" />
      <ContactCta />
    </main>
  );
}
