"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function addBuilderColorAction(
  collectionId: string,
  formData: FormData,
) {
  await requireAdmin();
  const value = (formData.get("value") as string)?.trim();

  if (!value) {
    return { error: "Color value is required." };
  }

  if (value.length > 100) {
    return { error: "Color value is too long (max 100 characters)." };
  }

  try {
    await db.builderColor.create({
      data: { collectionId, value },
    });
  } catch (error: unknown) {
    if (isDuplicate(error)) {
      return { error: "This color already exists for the collection." };
    }
    return { error: "Unable to add color. Please try again." };
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/builder");
  return { error: null };
}

export async function deleteBuilderColorAction(colorId: string) {
  await requireAdmin();
  const color = await db.builderColor.findUnique({
    where: { id: colorId },
    select: { collectionId: true },
  });

  if (!color) return;

  await db.builderColor.delete({ where: { id: colorId } });
  revalidatePath(`/admin/collections/${color.collectionId}`);
  revalidatePath("/builder");
}

function isDuplicate(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { code?: string };
  return e.code === "P2002";
}
