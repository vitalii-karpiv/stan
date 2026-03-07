"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma/client";

const validStatuses: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = formData.get("status") as string;

  if (!validStatuses.includes(status as OrderStatus)) {
    throw new Error("Invalid order status");
  }

  await db.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
