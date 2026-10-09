import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkout = event.data.object;
    const userId = checkout.metadata?.userId;
    const productId = checkout.metadata?.productId;

    if (checkout.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }
    if (!userId || !productId || checkout.amount_total === null) {
      console.error("Completed Stripe checkout is missing order metadata:", checkout.id);
      return NextResponse.json({ error: "Checkout metadata is incomplete." }, { status: 400 });
    }

    try {
      await prisma.order.upsert({
        where: { stripeSessionId: checkout.id },
        update: {},
        create: {
          stripeSessionId: checkout.id,
          userId,
          productId,
          totalAmount: checkout.amount_total,
          status: "PAID",
        },
      });
    } catch (error) {
      console.error("Could not persist completed Stripe checkout:", error);
      return NextResponse.json({ error: "Could not save order." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
