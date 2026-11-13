import { ButtonLink } from "@/components/ui/ButtonLink";
import { Magnetic } from "@/components/ui/Magnetic";

export function ContactCta() {
  return (
    <section className="border-t border-white/10 px-5 py-28 md:px-10 md:py-40 lg:px-14">
      <p className="text-[11px] font-mono tracking-[0.28em] text-gold uppercase">06 // START A PROJECT</p>
      <h2 className="mt-5 max-w-5xl font-display text-[clamp(3.2rem,8vw,7.2rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em]">
        Let&apos;s create
        <br />
        something
        <br />
        <span className="text-gold">memorable.</span>
      </h2>
      <p className="mt-8 max-w-md text-lg text-cream/75">
        Have a project in mind? Let&apos;s bring it to life. Tell us a little about your goals and we&apos;ll schedule a discovery call.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Magnetic>
          <ButtonLink href="/contact">Start a project</ButtonLink>
        </Magnetic>
        <Magnetic>
          <ButtonLink href="/work" variant="line">
            View our work
          </ButtonLink>
        </Magnetic>
      </div>
    </section>
  );
}
