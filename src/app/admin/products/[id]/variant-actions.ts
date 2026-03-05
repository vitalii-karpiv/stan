"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addVariantAction(
  productId: string,
  formData: FormData,
) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
  };

  const priceStr = str("priceInCents");
  const priceInCents = parseInt(priceStr, 10);
  if (!priceStr || isNaN(priceInCents) || priceInCents < 0) {
    return { error: "Price is required and must be a positive number." };
  }

  const stockStr = str("stock");
  const stock = stockStr ? parseInt(stockStr, 10) : 0;
  if (isNaN(stock) || stock < 0) {
    return { error: "Stock must be a non-negative number." };
  }

  const size = str("size") || null;
  const material = str("material") || null;
  const gemstone = str("gemstone") || null;
  const sku = str("sku") || null;

  try {
    await db.productVariant.create({
      data: {
        productId,
        size,
        material,
        gemstone,
        priceInCents,
        stock,
        sku,
      },
    });
  } catch (error: unknown) {
    if (isSkuConflict(error)) {
      return { error: "A variant with this SKU already exists." };
    }
    return { error: "Unable to add variant. Please try again." };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { error: null };
}

export async function deleteVariantAction(variantId: string) {
  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
    select: { productId: true, _count: { select: { orderItems: true } } },
  });

  if (!variant) return;

  if (variant._count.orderItems > 0) {
    return { error: "Cannot delete a variant that has been ordered." };
  }

  await db.productVariant.delete({ where: { id: variantId } });
  revalidatePath(`/admin/products/${variant.productId}`);
  return { error: null };
}

function isSkuConflict(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { code?: string; meta?: { target?: unknown } };
  return (
    e.code === "P2002" &&
    Array.isArray(e.meta?.target) &&
    e.meta!.target.includes("sku")
  );
}
