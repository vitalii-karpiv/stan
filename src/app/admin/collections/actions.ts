"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function deleteCollectionAction(id: string) {
  try {
    await db.collection.delete({ where: { id } });
  } catch {
    return { error: "Unable to delete collection right now. Please try again." };
  }

  revalidatePath("/admin/collections");
  return { error: null };
}
