"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function createCheckoutSession(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const user = await requireUser();
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    redirect("/");
  }
  const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
  const checkout = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    metadata: { userId: user.id, productId: product.id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: product.price,
          product_data: {
            name: product.title,
            description: product.description.slice(0, 500),
            images: [product.imageUrl],
          },
        },
      },
    ],
    success_url: `${baseUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout?productId=${encodeURIComponent(product.id)}&cancelled=1`,
  });

  if (!checkout.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(checkout.url);
}
