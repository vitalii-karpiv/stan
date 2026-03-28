"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { notifyCustomerOrderShipping } from "@/lib/mail";
import type { OrderStatus } from "@/generated/prisma";

import type { ShipmentNotifyState } from "./shipment-notify-state";

const MAX_TRACKING_LENGTH = 64;

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

export async function sendShipmentNotification(
  orderId: string,
  _prev: ShipmentNotifyState,
  formData: FormData,
): Promise<ShipmentNotifyState> {
  const raw = formData.get("trackingNumber");
  const trackingNumber =
    typeof raw === "string"
      ? raw.trim().slice(0, MAX_TRACKING_LENGTH)
      : "";

  if (!trackingNumber) {
    return {
      message: "Введіть номер ТТН.",
      variant: "error",
    };
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { email: true } } },
  });

  if (!order) {
    return { message: "Замовлення не знайдено.", variant: "error" };
  }

  const email = order.user.email;
  if (!email) {
    return { message: "У клієнта немає email.", variant: "error" };
  }

  await db.order.update({
    where: { id: orderId },
    data: { trackingNumber },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  try {
    await notifyCustomerOrderShipping({
      customerEmail: email,
      customerName: order.shippingName,
      orderId: order.id,
      trackingNumber,
    });
  } catch {
    return {
      message:
        "ТТН збережено, але не вдалося надіслати листа. Перевірте SMTP і спробуйте ще раз.",
      variant: "error",
    };
  }

  return {
    message: "Лист клієнту надіслано.",
    variant: "success",
  };
}
