"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { uploadToS3, deleteFromS3, getS3KeyFromUrl } from "@/lib/s3";
import { MAX_ADMIN_IMAGE_UPLOAD_BYTES } from "@/lib/upload-limits";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/avif",
];

export async function uploadBuilderPartImageAction(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "An image file is required." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      error: "Only JPEG, PNG, WebP, SVG, and AVIF images are allowed.",
    };
  }

  if (file.size > MAX_ADMIN_IMAGE_UPLOAD_BYTES) {
    return { error: "Image must be smaller than 100 MB." };
  }

  const ext =
    file.type === "image/svg+xml"
      ? "svg"
      : (file.name.split(".").pop() ?? "jpg");
  const key = `builder-parts/${crypto.randomUUID()}.${ext}`;
  const url = await uploadToS3(file, key);

  return { url };
}

export async function deleteBuilderPartImageAction(
  imageUrl: string,
): Promise<void> {
  await requireAdmin();

  const s3Key = getS3KeyFromUrl(imageUrl);
  if (s3Key) {
    await deleteFromS3(s3Key);
  }
}

async function executeDeleteBuilderPart(
  id: string,
): Promise<{ error: string | null }> {
  const part = await db.builderPart.findUnique({
    where: { id },
    select: {
      previewImageUrl: true,
      selectorImageUrl: true,
    },
  });

  if (!part) {
    return { error: "Part not found." };
  }

  try {
    await db.builderPart.delete({ where: { id } });
  } catch {
    return { error: "Unable to delete this part. Please try again." };
  }

  const k1 = getS3KeyFromUrl(part.previewImageUrl);
  const k2 = getS3KeyFromUrl(part.selectorImageUrl);
  if (k1) await deleteFromS3(k1).catch(() => {});
  if (k2) await deleteFromS3(k2).catch(() => {});

  return { error: null };
}

export async function deleteBuilderPartAction(id: string) {
  await requireAdmin();
  const result = await executeDeleteBuilderPart(id);
  if (!result.error) {
    revalidatePath("/admin/builder-parts");
  }
  return result;
}

export async function deleteBuilderPartAndRedirectAction(id: string) {
  await requireAdmin();
  const result = await executeDeleteBuilderPart(id);
  if (result.error) {
    return result;
  }
  revalidatePath("/admin/builder-parts");
  redirect("/admin/builder-parts");
}
