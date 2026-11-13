"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogoLink } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { navLinks, socials } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled || open ? "border-b border-white/10 bg-ink/85 backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 md:h-20 md:px-10 lg:px-14">
          <LogoLink />

          <nav
            className="hidden lg:flex items-center gap-7 rounded-full border border-white/15 bg-white/[0.07] px-6 py-2 backdrop-blur-md shadow-sm"
            aria-label="Primary"
          >
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <NavLink key={link.href} href={link.href} active={active}>
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <ThemeToggle />
            <Magnetic>
              <Link
                href="/contact"
                className="pill-button header-cta text-xs tracking-wider uppercase px-5 py-2.5"
              >
                Start a project <span aria-hidden="true">↗</span>
              </Link>
            </Magnetic>
          </div>
          <button
            type="button"
            className="cursor-pointer text-[11px] tracking-[0.24em] text-cream lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pt-28 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-1 flex-col justify-center gap-4" aria-label="Mobile">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl font-medium uppercase tracking-tight hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mb-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-mono text-[11px] tracking-[0.2em] text-cream/50 uppercase">Appearance</span>
              <ThemeToggle />
            </div>
            <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-6">
              <ButtonLink href="/contact">Start a project</ButtonLink>
              <ul className="space-y-1 text-right text-[11px] tracking-[0.18em] text-cream/60">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer" className="hover:text-gold">
                      {social.label.toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative text-[13px] font-medium tracking-wide transition-colors",
        active ? "text-gold font-semibold" : "text-white/70 hover:text-white",
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-gold transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
