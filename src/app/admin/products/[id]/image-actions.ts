"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function addProductImageAction(
  productId: string,
  formData: FormData,
) {
  const url = formData.get("url");
  if (typeof url !== "string" || !url.trim()) {
    return { error: "Image URL is required." };
  }

  const alt = formData.get("alt");
  const altText = typeof alt === "string" && alt.trim() ? alt.trim() : null;

  const lastImage = await db.productImage.findFirst({
    where: { productId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await db.productImage.create({
    data: {
      productId,
      url: url.trim(),
      alt: altText,
      sortOrder: (lastImage?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  return { error: null };
}

export async function deleteProductImageAction(imageId: string) {
  const image = await db.productImage.findUnique({
    where: { id: imageId },
    select: { productId: true },
  });

  if (!image) return;

  await db.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${image.productId}`);
}
