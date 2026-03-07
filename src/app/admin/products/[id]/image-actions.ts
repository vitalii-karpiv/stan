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

export async function addProductImagesAction(
  productId: string,
  formData: FormData,
) {
  await requireAdmin();

  const files = formData.getAll("files").filter(
    (f): f is File => f instanceof File && f.size > 0,
  );

  if (files.length === 0) {
    return { error: "At least one image file is required." };
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: `"${file.name}" is not a supported format. Only JPEG, PNG, WebP, and AVIF are allowed.` };
    }
    if (file.size > MAX_SIZE) {
      return { error: `"${file.name}" exceeds the 5 MB size limit.` };
    }
  }

  const lastImage = await db.productImage.findFirst({
    where: { productId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  let nextOrder = (lastImage?.sortOrder ?? -1) + 1;

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const key = `products/${productId}/${crypto.randomUUID()}.${ext}`;
    const url = await uploadToS3(file, key);

    await db.productImage.create({
      data: {
        productId,
        url,
        alt: null,
        sortOrder: nextOrder++,
      },
    });
  }

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
