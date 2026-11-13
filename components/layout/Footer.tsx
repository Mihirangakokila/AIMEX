import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { navLinks, site, socials } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-16 md:px-10 lg:px-14 bg-charcoal/40 backdrop-blur-md">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-cream/65 leading-relaxed">{site.category}</p>
          <p className="mt-3 font-display text-base text-cream/90">{site.tagline}</p>
        </div>
        <div>
          <p className="text-[11px] font-mono tracking-[0.22em] text-gold uppercase">NAVIGATION</p>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream/75 transition-colors hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-mono tracking-[0.22em] text-gold uppercase">SOCIAL</p>
          <ul className="mt-4 space-y-2.5">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noreferrer" className="text-sm text-cream/75 transition-colors hover:text-gold">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-mono tracking-[0.22em] text-gold uppercase">CONTACT</p>
          <ul className="mt-4 space-y-2.5 font-mono text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="text-cream/75 transition-colors hover:text-gold">
                {site.email}
              </a>
            </li>
            {site.phone ? (
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-cream/75 transition-colors hover:text-gold">
                  {site.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[11px] tracking-[0.18em] text-cream/40 uppercase">
        <p>© 2026 <span className="text-gold font-medium">AIMEX</span> — CREATIVE IDEAS. DIGITAL IMPACT.</p>
        <p>PORTFOLIO-FIRST CREATIVE & DIGITAL AGENCY</p>
      </div>
    </footer>
  );
}
