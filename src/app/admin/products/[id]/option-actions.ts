"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import type { OptionType } from "@/generated/prisma";

const VALID_TYPES: OptionType[] = ["SIZE", "MATERIAL", "GEMSTONE"];

export async function addOptionAction(
  productId: string,
  formData: FormData,
) {
  await requireAdmin();
  const type = (formData.get("type") as string)?.trim() as OptionType;
  const value = (formData.get("value") as string)?.trim();

  if (!type || !VALID_TYPES.includes(type)) {
    return { error: "Please select a valid option type." };
  }

  if (!value) {
    return { error: "Value is required." };
  }

  try {
    await db.productOption.create({
      data: { productId, type, value },
    });
  } catch (error: unknown) {
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
    select: { productId: true },
  });

  if (!option) return;

  await db.productOption.delete({ where: { id: optionId } });
  revalidatePath(`/admin/products/${option.productId}`);
  return { error: null };
}

function isDuplicateOption(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { code?: string };
  return e.code === "P2002";
}
