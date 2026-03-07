"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

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
