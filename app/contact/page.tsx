import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with AIMEX. Tell us about your goals and we'll be in touch.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="px-5 pt-32 pb-24 md:px-10 md:pt-40 lg:px-14">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-[11px] font-mono tracking-[0.28em] text-gold uppercase">07 // CONTACT</p>
          <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl">
            Let&apos;s talk.
          </h1>
          <p className="mt-6 max-w-sm text-lg text-cream/75">
            Have a project in mind? Let&apos;s bring it to life. Tell us about your vision and objectives.
          </p>
          <div className="mt-10 space-y-3 text-cream/80">
            <p>
              <span className="mr-3 text-[11px] tracking-[0.18em] text-gold">EMAIL</span>
              <a href={`mailto:${site.email}`} className="hover:text-gold">
                {site.email}
              </a>
            </p>
            {site.phone ? (
              <p>
                <span className="mr-3 text-[11px] tracking-[0.18em] text-gold">PHONE</span>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-gold">
                  {site.phone}
                </a>
              </p>
            ) : null}
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
