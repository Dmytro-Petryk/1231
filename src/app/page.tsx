import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const databaseConfigured = Boolean(process.env.DATABASE_URL);
  const products = databaseConfigured
    ? await prisma.product.findMany({ orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
      <section className="mb-12 max-w-3xl sm:mb-16">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">A little more considered</p>
        <h1 className="text-5xl font-medium leading-[1.04] tracking-[-0.06em] sm:text-7xl">
          Thoughtful things,<br className="hidden sm:block" /> made to last.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)]">
          Useful objects for everyday life. Carefully chosen, made with intention, and here to stay.
        </p>
      </section>

      <section aria-labelledby="collection-heading">
        <div className="mb-5 flex items-baseline justify-between border-b border-[var(--line)] pb-4">
          <h2 id="collection-heading" className="text-sm font-medium">The collection</h2>
          <span className="text-sm text-[var(--muted)]">{products.length} {products.length === 1 ? "piece" : "pieces"}</span>
        </div>
        {!databaseConfigured ? (
          <div className="rounded-lg border border-dashed border-[var(--line)] px-6 py-12 text-center">
            <p className="text-lg font-medium">Store preview</p>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
              The storefront is ready to view. To load products, enable sign-in, and accept orders, configure
              <code className="mx-1 rounded bg-[#f1f0eb] px-1.5 py-0.5">DATABASE_URL</code>
              in <code className="rounded bg-[#f1f0eb] px-1.5 py-0.5">.env.local</code>, then run <code className="rounded bg-[#f1f0eb] px-1.5 py-0.5">npm run db:push</code>.
            </p>
          </div>
        ) : products.length ? (
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--line)] px-6 py-20 text-center">
            <p className="text-lg font-medium">Something good is on its way.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Check back soon for the first pieces in our collection.</p>
          </div>
        )}
      </section>
      <footer className="mt-24 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
        Thoughtfully selected. Happily used. © {new Date().getFullYear()} Common Goods
      </footer>
    </div>
  );
}
