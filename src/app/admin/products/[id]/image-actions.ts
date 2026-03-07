"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { uploadToS3, deleteFromS3, getS3KeyFromUrl } from "@/lib/s3";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function addProductImageAction(
  productId: string,
  formData: FormData,
) {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "An image file is required." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Only JPEG, PNG, WebP, and AVIF images are allowed." };
  }

  if (file.size > MAX_SIZE) {
    return { error: "Image must be smaller than 5 MB." };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `products/${productId}/${crypto.randomUUID()}.${ext}`;
  const url = await uploadToS3(file, key);

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
      url,
      alt: altText,
      sortOrder: (lastImage?.sortOrder ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  return { error: null };
}

export async function deleteProductImageAction(imageId: string) {
  await requireAdmin();
  const image = await db.productImage.findUnique({
    where: { id: imageId },
    select: { productId: true, url: true },
  });

  if (!image) return;

  const s3Key = getS3KeyFromUrl(image.url);
  if (s3Key) {
    await deleteFromS3(s3Key);
  }

  await db.productImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/products/${image.productId}`);
}
