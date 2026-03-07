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

export async function uploadCollectionImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
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
  const key = `collections/${crypto.randomUUID()}.${ext}`;
  const url = await uploadToS3(file, key);

  return { url };
}

export async function deleteCollectionImageAction(
  imageUrl: string,
): Promise<void> {
  await requireAdmin();

  const s3Key = getS3KeyFromUrl(imageUrl);
  if (s3Key) {
    await deleteFromS3(s3Key);
  }
}

export async function deleteCollectionAction(id: string) {
  await requireAdmin();
  try {
    await db.collection.delete({ where: { id } });
  } catch {
    return { error: "Unable to delete collection right now. Please try again." };
  }

  revalidatePath("/admin/collections");
  return { error: null };
}
