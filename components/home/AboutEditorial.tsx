import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { pillars } from "@/lib/content";
import { pad } from "@/lib/utils";

export function AboutEditorial({ titleAs = "h2" }: { titleAs?: "h1" | "h2" }) {
  const Title = titleAs;
  return (
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="order-2 flex flex-col justify-center lg:order-1 lg:col-span-6">
          <p className="text-[11px] font-mono tracking-[0.28em] text-gold uppercase">02 // ABOUT AIMEX</p>
          <Title className="mt-4 font-display text-[clamp(2.8rem,6vw,5.2rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]">
            We turn ideas
            <br />
            into visual experiences.
          </Title>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-cream/75">
            AIMEX is a portfolio-first creative & digital agency combining website design & development, brand identity, photography, videography, and social media marketing to help ambitious brands stand out and grow.
          </p>
          <ul className="mt-12 border-t border-white/10">
            {pillars.map((pillar, index) => (
              <li key={pillar.title} className="grid gap-2 border-b border-white/10 py-5 md:grid-cols-[4rem_1fr]">
                <span className="text-[11px] font-mono tracking-[0.22em] text-gold">{pad(index + 1)}</span>
                <div>
                  <h3 className="font-display text-xl uppercase tracking-tight text-cream font-semibold">{pillar.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-cream/65">{pillar.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-sm border border-white/10 lg:order-2 lg:col-span-6 lg:aspect-auto lg:min-h-[820px] liquid-gleam">
          <ProjectVisual title="AIMEX" category="PHOTOGRAPHY" seed={4} />
        </div>
      </div>
    </section>
  );
}
