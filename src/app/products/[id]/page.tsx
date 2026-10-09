import Image from "next/image";
import { notFound } from "next/navigation";
import { BuyButton } from "@/components/buy-button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#eeece6]">
        <Image src={product.imageUrl} alt={product.title} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Common goods · Everyday essentials</p>
        <h1 className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl">{product.title}</h1>
        <p className="mt-5 text-xl">{formatPrice(product.price)}</p>
        <div className="my-8 border-t border-[var(--line)]" />
        <p className="whitespace-pre-line text-base leading-7 text-[var(--muted)]">{product.description}</p>
        <div className="mt-10 max-w-sm"><BuyButton productId={product.id} /></div>
        <p className="mt-4 text-xs text-[var(--muted)]">Secure checkout · Carefully packed and ready to enjoy</p>
      </div>
    </div>
  );
}
