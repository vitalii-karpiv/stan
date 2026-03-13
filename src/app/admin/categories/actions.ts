"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma";
import { requireAdmin } from "@/lib/admin";

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  try {
    await db.category.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return { error: "Cannot delete this category because it still has products. Remove or reassign them first." };
    }
    return { error: "Unable to delete category right now. Please try again." };
  }

  revalidatePath("/admin/categories");
  return { error: null };
}
