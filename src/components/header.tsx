import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-[var(--line)] bg-[var(--background)]">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-[-0.04em]">
          common goods<span className="text-[var(--accent)]">.</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
          <Link href="/" className="hidden px-2 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] sm:inline">
            Shop
          </Link>
          {session ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin/dashboard" className="px-2 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                  Dashboard
                </Link>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="secondary" size="small">Sign out</Button>
              </form>
            </>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="small">Sign in</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
