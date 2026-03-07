"use server";

import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  checkoutSchema,
  type CheckoutFormState,
} from "@/lib/validations/checkout";

type CartItemPayload = {
  productId: string;
  quantity: number;
  size: string | null;
  material: string | null;
  gemstone: string | null;
};

function extractValues(formData: FormData) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    shippingCity: str("shippingCity"),
    shippingPostOffice: str("shippingPostOffice"),
  };
}

function parseCartItems(raw: string): CartItemPayload[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((item: Record<string, unknown>) => ({
      productId: String(item.productId ?? ""),
      quantity: Number(item.quantity ?? 1),
      size: item.size ? String(item.size) : null,
      material: item.material ? String(item.material) : null,
      gemstone: item.gemstone ? String(item.gemstone) : null,
    }));
  } catch {
    return null;
  }
}

export async function placeOrderAction(
  _prev: CheckoutFormState,
  formData: FormData,
): Promise<CheckoutFormState> {
  const values = extractValues(formData);
  const parsed = checkoutSchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      message: "Будь ласка, виправте виділені поля.",
      fieldErrors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
        shippingCity: flat.shippingCity?.[0],
        shippingPostOffice: flat.shippingPostOffice?.[0],
      },
      values,
    };
  }

  const cartRaw = formData.get("cartItems");
  const cartItems = parseCartItems(typeof cartRaw === "string" ? cartRaw : "");

  if (!cartItems || cartItems.length === 0) {
    return {
      message: "Ваш кошик порожній.",
      fieldErrors: {},
      values,
    };
  }

  const productIds = cartItems.map((i) => i.productId);
  const products = await db.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true },
  });

  const priceMap = new Map(products.map((p) => [p.id, p.price]));

  for (const item of cartItems) {
    if (!priceMap.has(item.productId)) {
      return {
        message: "Деякі товари у кошику більше недоступні. Оновіть кошик.",
        fieldErrors: {},
        values,
      };
    }
  }

  const orderItems = cartItems.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: priceMap.get(item.productId)!,
    size: item.size,
    material: item.material,
    gemstone: item.gemstone,
  }));

  const totalInCents = orderItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  let orderId: string;

  try {
    const user = await db.user.upsert({
      where: { email: parsed.data.email },
      update: {
        name: parsed.data.name,
        phone: parsed.data.phone || null,
      },
      create: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        role: "CUSTOMER",
      },
    });

    const order = await db.order.create({
      data: {
        userId: user.id,
        totalInCents,
        shippingName: parsed.data.name,
        shippingCity: parsed.data.shippingCity,
        shippingPostOffice: parsed.data.shippingPostOffice,
        items: { create: orderItems },
      },
    });

    orderId = order.id;
  } catch {
    return {
      message: "Не вдалося створити замовлення. Спробуйте ще раз.",
      fieldErrors: {},
      values,
    };
  }

  redirect(`/checkout/success?order=${orderId}`);
}
