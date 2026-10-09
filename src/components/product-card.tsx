import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-md bg-[#eeece6]">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={18} aria-hidden="true" />
          <span className="sr-only">View {product.title}</span>
        </span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium">{product.title}</h2>
        <span className="shrink-0 text-sm text-[var(--muted)]">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}
