"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, signupAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthState = { error?: string } | undefined;

export function AuthForm({
  mode,
  callbackUrl,
  databaseConfigured,
}: {
  mode: "login" | "signup";
  callbackUrl: string;
  databaseConfigured: boolean;
}) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, undefined);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {!databaseConfigured && (
        <p role="status" className="rounded-md bg-[#f1f0eb] p-4 text-sm leading-6 text-[var(--muted)]">
          Account access needs a PostgreSQL database. Set <code>DATABASE_URL</code> in <code>.env.local</code> and run <code>npm run db:push</code>.
        </p>
      )}
      <fieldset disabled={!databaseConfigured} className="space-y-5 disabled:opacity-50">
        {isSignup && (
          <label className="block space-y-2 text-sm font-medium">
            Name
            <Input name="name" autoComplete="name" maxLength={80} required />
          </label>
        )}
        <label className="block space-y-2 text-sm font-medium">
          Email
          <Input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="block space-y-2 text-sm font-medium">
          Password
          <Input name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} minLength={isSignup ? 8 : undefined} maxLength={72} required />
          {isSignup && <span className="block text-xs font-normal text-[var(--muted)]">Use at least 8 characters.</span>}
        </label>
        {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
        </Button>
      </fieldset>
      <p className="text-center text-sm text-[var(--muted)]">
        {isSignup ? "Already have an account?" : "New around here?"}{" "}
        <Link className="font-medium text-[var(--foreground)] underline underline-offset-4" href={`${isSignup ? "/login" : "/signup"}?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
