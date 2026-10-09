import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Edit product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
      <Link href="/admin/dashboard"><Button variant="ghost" size="small">← Back to dashboard</Button></Link>
      <h1 className="mb-7 mt-5 text-4xl font-medium tracking-[-0.05em]">Edit product</h1>
      <Card className="p-5 sm:p-7"><ProductForm product={product} /></Card>
    </div>
  );
}
