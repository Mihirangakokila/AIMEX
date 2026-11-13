"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";

const initial: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="mt-10 max-w-md space-y-6">
      <input type="hidden" name="next" value={next || "/admin"} />
      <label className="block">
        <span className="text-[11px] tracking-[0.22em] text-gold">EMAIL</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-2 w-full border-b border-white/15 bg-transparent py-3 outline-none focus:border-gold"
        />
      </label>
      <label className="block">
        <span className="text-[11px] tracking-[0.22em] text-gold">PASSWORD</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full border-b border-white/15 bg-transparent py-3 outline-none focus:border-gold"
        />
      </label>
      {state.error && (
        <p className="text-sm text-gold" role="alert">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 cursor-pointer items-center bg-gold px-6 py-3 text-[11px] tracking-[0.22em] text-ink uppercase hover:bg-gold-soft disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Enter"}
      </button>
    </form>
  );
}
