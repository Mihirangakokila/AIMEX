import type { Metadata } from "next";
import { DM_Sans, Manrope, Onest } from "next/font/google";
import { Shell } from "@/components/layout/Shell";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AIMEX — Creative & Digital Agency",
    template: "%s — AIMEX",
  },
  description: site.description,
  applicationName: "AIMEX",
  openGraph: {
    title: "AIMEX — Creative & Digital Agency",
    description: site.description,
    type: "website",
    siteName: "AIMEX",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMEX — Creative & Digital Agency",
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    slogan: site.tagline,
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${dmSans.variable} ${onest.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('aimex-theme') || 'system';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark', 'liquid', 'glass');
                  if (t === 'liquid' || t === 'glass') {
                    root.classList.add('liquid', 'glass');
                    root.setAttribute('data-theme', 'liquid');
                    root.style.colorScheme = 'dark';
                  } else {
                    var isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                    var resolved = isDark ? 'dark' : 'light';
                    root.classList.add(resolved);
                    root.setAttribute('data-theme', resolved);
                    root.style.colorScheme = resolved;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-ink font-body text-cream relative">
        <div className="ambient-glow" aria-hidden />
        <div className="liquid-canvas glass-orbs" aria-hidden>
          <div className="liquid-blob liquid-blob-1 glass-orb glass-orb-1" />
          <div className="liquid-blob liquid-blob-2 glass-orb glass-orb-2" />
          <div className="liquid-blob liquid-blob-3 glass-orb glass-orb-3" />
          <div className="liquid-blob liquid-blob-4" />
          <div className="liquid-caustic" />
        </div>
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>
        <div className="grain" aria-hidden />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
