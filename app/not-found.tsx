import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col justify-end px-5 pt-32 pb-16 md:px-10">
      <p className="text-[11px] tracking-[0.28em] text-gold">404</p>
      <h1 className="mt-4 max-w-4xl font-display text-5xl font-medium uppercase leading-[0.9] md:text-7xl">
        This page is not in the archive.
      </h1>
      <div className="mt-10">
        <ButtonLink href="/work" variant="line">
          View the work
        </ButtonLink>
      </div>
    </main>
  );
}
