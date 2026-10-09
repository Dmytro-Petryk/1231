import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthForm } from "@/components/auth-form";
import { safeCallbackUrl } from "@/lib/auth-helpers";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const [{ callbackUrl }, session] = await Promise.all([searchParams, auth()]);
  const destination = safeCallbackUrl(callbackUrl);
  if (session?.user) redirect(destination);

  return (
    <div className="mx-auto max-w-md px-5 py-16 sm:py-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Make yourself at home</p>
      <h1 className="mb-8 text-4xl font-medium tracking-[-0.05em]">Create your account.</h1>
      <AuthForm mode="signup" callbackUrl={destination} databaseConfigured={Boolean(process.env.DATABASE_URL)} />
    </div>
  );
}
