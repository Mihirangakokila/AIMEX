"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[80svh] flex-col justify-end px-5 pb-16 md:px-10">
      <p className="text-[11px] tracking-[0.28em] text-gold">ERROR</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.9]">Something went wrong.</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex w-fit cursor-pointer border border-cream/30 px-6 py-3 text-[11px] tracking-[0.22em] uppercase hover:border-gold hover:text-gold"
      >
        Try again
      </button>
    </main>
  );
}
