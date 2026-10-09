import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { deleteProductAction } from "@/app/admin/actions";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, products] = await Promise.all([
    searchParams,
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  if (error && error.length > 300) redirect("/admin/dashboard");

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Store management</p>
      <h1 className="mb-10 text-4xl font-medium tracking-[-0.05em]">Dashboard</h1>
      {error && <p role="alert" className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      <div className="grid gap-10 lg:grid-cols-[minmax(280px,0.8fr)_1.2fr]">
        <section>
          <h2 className="mb-4 text-lg font-medium">Add a product</h2>
          <Card className="p-5 sm:p-6"><ProductForm /></Card>
        </section>
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-medium">Products</h2>
            <span className="text-sm text-[var(--muted)]">{products.length} total</span>
          </div>
          <Card className="overflow-hidden">
            {products.length ? (
              <div className="divide-y divide-[var(--line)]">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{product.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{formatPrice(product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}><Button variant="secondary" size="small">Edit</Button></Link>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <Button variant="danger" size="small" type="submit">Delete</Button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-8 text-center text-sm text-[var(--muted)]">Your products will appear here.</p>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}
