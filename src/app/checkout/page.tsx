import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createCheckoutSession } from "@/app/checkout/actions";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string; cancelled?: string }>;
}) {
  const [{ productId, cancelled }, session] = await Promise.all([searchParams, auth()]);
  const id = productId ?? "";
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(`/checkout?productId=${id}`)}`);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Secure checkout</p>
      <h1 className="mb-8 text-4xl font-medium tracking-[-0.05em]">Almost yours.</h1>
      {cancelled && <p role="status" className="mb-5 rounded-md bg-[#f0eee8] p-4 text-sm">Your checkout was cancelled. You can try again whenever you’re ready.</p>}
      <Card className="grid overflow-hidden sm:grid-cols-[180px_1fr]">
        <div className="relative aspect-square bg-[#eeece6] sm:aspect-auto">
          <Image src={product.imageUrl} alt={product.title} fill sizes="180px" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-medium">{product.title}</h2>
            <span className="shrink-0">{formatPrice(product.price)}</span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">Signed in as {session.user.email}</p>
          <form action={createCheckoutSession} className="mt-6">
            <input type="hidden" name="productId" value={product.id} />
            <Button className="w-full" type="submit">Continue to secure payment</Button>
          </form>
          <Link href={`/products/${product.id}`} className="mt-4 text-center text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Back to product</Link>
        </div>
      </Card>
      <p className="mt-5 text-center text-xs text-[var(--muted)]">Your payment is handled securely by Stripe.</p>
    </div>
  );
}
