import type { Metadata } from "next";
import { AboutEditorial } from "@/components/home/AboutEditorial";
import { ContactCta } from "@/components/home/ContactCta";

export const metadata: Metadata = {
  title: "About",
  description:
    "AIMEX is a creative and digital agency combining design, technology, photography, videography, and social media marketing.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="pt-16">
      <AboutEditorial titleAs="h1" />
      <ContactCta />
    </main>
  );
}
