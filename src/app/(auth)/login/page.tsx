import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";
import { safeCallbackUrl } from "@/lib/auth-helpers";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const [{ callbackUrl }, session] = await Promise.all([searchParams, auth()]);
  const destination = safeCallbackUrl(callbackUrl);
  if (session?.user) redirect(destination);

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Welcome back</p>
      <h1 className="mb-8 text-4xl font-medium tracking-[-0.05em]">Sign in to your account.</h1>
      <AuthForm mode="login" callbackUrl={destination} databaseConfigured={Boolean(process.env.DATABASE_URL)} />
    </div>
  );
}
