import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order confirmation" };
export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const [{ session_id: sessionId }, session] = await Promise.all([searchParams, auth()]);
  if (!session?.user) redirect("/login");
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) redirect("/");

  const checkout = await getStripe().checkout.sessions.retrieve(sessionId);
  if (checkout.metadata?.userId !== session.user.id || checkout.payment_status !== "paid") redirect("/");

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: checkout.id },
    include: { product: true },
  });

  return (
    <div className="mx-auto max-w-xl px-5 py-16 sm:py-24">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eee8] text-xl text-[var(--accent)]" aria-hidden="true">✓</div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Payment confirmed</p>
      <h1 className="text-4xl font-medium tracking-[-0.05em]">Thank you for choosing well.</h1>
      <p className="mt-4 leading-7 text-[var(--muted)]">Your payment was successful. A receipt will be sent to {checkout.customer_details?.email ?? session.user.email}.</p>
      <Card className="mt-8 p-5">
        {order ? (
          <>
            <div className="flex justify-between gap-4 text-sm">
              <span>{order.product.title}</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <p className="mt-4 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">Order reference: {order.id}</p>
          </>
        ) : (
          <p className="text-sm text-[var(--muted)]">Your order is being recorded. Refresh this page shortly if the order reference does not appear.</p>
        )}
      </Card>
      <Link href="/" className="mt-7 inline-block"><Button variant="secondary">Continue shopping</Button></Link>
    </div>
  );
}
