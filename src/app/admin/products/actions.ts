"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export async function deleteProductAction(id: string) {
  try {
    await db.product.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003") {
      return { error: "Cannot delete this product because it has associated orders." };
    }
    return { error: "Unable to delete product right now. Please try again." };
  }

  revalidatePath("/admin/products");
  return { error: null };
}
