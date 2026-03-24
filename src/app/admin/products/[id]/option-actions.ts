"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { deleteFromS3, getS3KeyFromUrl, uploadToS3 } from "@/lib/s3";
import type { OptionType } from "@/generated/prisma";

const VALID_TYPES: OptionType[] = ["SIZE", "COLOR", "GEMSTONE", "PENDANT"];
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function addOptionAction(
  productId: string,
  formData: FormData,
) {
  await requireAdmin();
  const type = (formData.get("type") as string)?.trim() as OptionType;
  let value = (formData.get("value") as string)?.trim();
  const pendantImage =
    type === "PENDANT" && formData.get("pendantImage") instanceof File
      ? (formData.get("pendantImage") as File)
      : null;

  if (!type || !VALID_TYPES.includes(type)) {
    return { error: "Please select a valid option type." };
  }

  if (type === "PENDANT") {
    if (!pendantImage || pendantImage.size === 0) {
      return { error: "Pendant image is required." };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(pendantImage.type)) {
      return {
        error:
          "Unsupported image format. Only JPEG, PNG, WebP, and AVIF are allowed.",
      };
    }
    if (pendantImage.size > MAX_IMAGE_SIZE) {
      return { error: "Pendant image exceeds the 5 MB size limit." };
    }
  } else if (!value) {
    return { error: "Value is required." };
  }

  let uploadedPendantKey: string | null = null;
  if (type === "PENDANT" && pendantImage) {
    const ext = pendantImage.name.split(".").pop() ?? "jpg";
    const key = `products/${productId}/options/${crypto.randomUUID()}.${ext}`;
    value = await uploadToS3(pendantImage, key);
    uploadedPendantKey = key;
  }

  try {
    await db.productOption.create({
      data: { productId, type, value },
    });
  } catch (error: unknown) {
    if (uploadedPendantKey) {
      await deleteFromS3(uploadedPendantKey).catch(() => {});
    }
    if (isDuplicateOption(error)) {
      return { error: "This option already exists for the product." };
    }
    return { error: "Unable to add option. Please try again." };
  }

  revalidatePath(`/admin/products/${productId}`);
  return { error: null };
}

export async function deleteOptionAction(optionId: string) {
  await requireAdmin();
  const option = await db.productOption.findUnique({
    where: { id: optionId },
    select: { productId: true, type: true, value: true },
  });

  if (!option) return;

  if (option.type === "PENDANT") {
    const s3Key = getS3KeyFromUrl(option.value);
    if (s3Key) {
      await deleteFromS3(s3Key).catch(() => {});
    }
  }

  await db.productOption.delete({ where: { id: optionId } });
  revalidatePath(`/admin/products/${option.productId}`);
  return { error: null };
}

function isDuplicateOption(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { code?: string };
  return e.code === "P2002";
}
