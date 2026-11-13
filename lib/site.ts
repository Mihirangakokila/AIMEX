export const site = {
  name: "AIMEX",
  tagline: "Create. Connect. Grow.",
  category: "Creative & Digital Agency",
  description:
    "A portfolio-first creative & digital agency. We specialize in website design & development, brand identity, photography, videography, and social media content for ambitious brands.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@aimex.studio",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
};

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "TikTok", href: "https://www.tiktok.com" },
  { label: "X / Twitter", href: "https://x.com" },
] as const;
