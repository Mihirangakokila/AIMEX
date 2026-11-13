import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/brand/Logo";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");
  const params = await searchParams;

  return (
    <main className="flex min-h-screen flex-col justify-end px-5 pt-24 pb-16 md:px-16">
      <Logo tone="gold" />
      <p className="mt-10 text-[11px] tracking-[0.28em] text-gold">ADMIN</p>
      <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">Studio access.</h1>
      <LoginForm next={params.next} />
    </main>
  );
}
