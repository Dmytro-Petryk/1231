"use client";

import { useActionState } from "react";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type ProductFormState = { error?: string } | undefined;

type ProductFormProps = {
  product?: {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
  };
};

export function ProductForm({ product }: ProductFormProps) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block space-y-2 text-sm font-medium">
        Title
        <Input name="title" defaultValue={product?.title} maxLength={120} required />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        Description
        <Textarea name="description" defaultValue={product?.description} maxLength={5000} required />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        Price (USD)
        <Input name="price" type="number" min="0.01" step="0.01" inputMode="decimal" defaultValue={product ? (product.price / 100).toFixed(2) : ""} required />
      </label>
      <label className="block space-y-2 text-sm font-medium">
        Product image {product && <span className="font-normal text-[var(--muted)]">(leave empty to keep current image)</span>}
        <Input name="image" type="file" accept="image/*" required={!product} />
        <span className="block text-xs font-normal text-[var(--muted)]">Image file up to 5 MB.</span>
      </label>
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : product ? "Save changes" : "Add product"}</Button>
    </form>
  );
}
