"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-helpers";
import { uploadProductImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

type ProductFormState = { error?: string } | undefined;

const productSchema = z.object({
  title: z.string().trim().min(1, "Enter a product title.").max(120),
  description: z.string().trim().min(1, "Enter a product description.").max(5000),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price with up to two decimal places."),
});

function parseProduct(formData: FormData) {
  const parsed = productSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the product details." };

  const price = Math.round(Number(parsed.data.price) * 100);
  if (!Number.isSafeInteger(price) || price < 1) return { error: "Price must be at least $0.01." };

  return { data: { ...parsed.data, price } };
}

function productError(error: unknown) {
  console.error("Product management failed:", error);
  return error instanceof Error ? error.message : "Something went wrong while saving the product.";
}

export async function createProductAction(_previousState: ProductFormState, formData: FormData) {
  await requireAdmin();
  const parsed = parseProduct(formData);
  if ("error" in parsed) return { error: parsed.error };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose a product image to upload." };

  try {
    const imageUrl = await uploadProductImage(file);
    await prisma.product.create({ data: { ...parsed.data, imageUrl } });
  } catch (error) {
    return { error: productError(error) };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function updateProductAction(id: string, _previousState: ProductFormState, formData: FormData) {
  await requireAdmin();
  const parsed = parseProduct(formData);
  if ("error" in parsed) return { error: parsed.error };

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { error: "This product no longer exists." };

  const file = formData.get("image");
  if (file !== null && !(file instanceof File)) return { error: "Choose a valid image file." };

  try {
    const imageUrl = file instanceof File && file.size > 0 ? await uploadProductImage(file) : product.imageUrl;
    await prisma.product.update({
      where: { id },
      data: { ...parsed.data, imageUrl },
    });
  } catch (error) {
    return { error: productError(error) };
  }

  revalidatePath("/");
  revalidatePath(`/products/${id}`);
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/dashboard");

  try {
    await prisma.product.delete({ where: { id } });
  } catch (error) {
    console.error("Could not delete product:", error);
    redirect(`/admin/dashboard?error=${encodeURIComponent("This product could not be deleted. It may have completed orders.")}`);
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}
