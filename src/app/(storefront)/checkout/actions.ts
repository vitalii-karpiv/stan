"use server";

import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { BUILDER_ASSEMBLY_SLUG } from "@/lib/constants/builder";
import {
  notifyAdminsNewOrder,
  notifyCustomerOrderConfirmation,
} from "@/lib/mail";
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
  pendant: string | null;
  builderPartIds?: string[];
  builderSnapshotUrl?: string | null;
  customLineTitle?: string | null;
  collectionSlug?: string | null;
  categorySlug?: string | null;
};

type OrderItemCreateInput = {
  productId: string;
  quantity: number;
  price: number;
  size: string | null;
  material: string | null;
  gemstone: string | null;
  pendant: string | null;
  builderPartIds: string[];
  builderSnapshotUrl: string | null;
  customLineTitle: string | null;
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
    note: str("note"),
  };
}

function parseCartItems(raw: string): CartItemPayload[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((item: Record<string, unknown>) => {
      const builderPartIds = Array.isArray(item.builderPartIds)
        ? item.builderPartIds.map((id) => String(id))
        : undefined;
      return {
        productId: String(item.productId ?? ""),
        quantity: Math.max(1, Math.floor(Number(item.quantity ?? 1))),
        size: item.size ? String(item.size) : null,
        material: item.material ? String(item.material) : null,
        gemstone: item.gemstone ? String(item.gemstone) : null,
        pendant: item.pendant ? String(item.pendant) : null,
        builderPartIds,
        builderSnapshotUrl: item.builderSnapshotUrl
          ? String(item.builderSnapshotUrl)
          : null,
        customLineTitle: item.customLineTitle
          ? String(item.customLineTitle)
          : null,
        collectionSlug: item.collectionSlug
          ? String(item.collectionSlug)
          : null,
        categorySlug: item.categorySlug
          ? String(item.categorySlug)
          : null,
      };
    });
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
        note: flat.note?.[0],
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

  const anchorProduct = await db.product.findFirst({
    where: { slug: BUILDER_ASSEMBLY_SLUG },
    select: { id: true },
  });

  const standardProductIds = [
    ...new Set(
      cartItems
        .filter((i) => !i.builderPartIds?.length)
        .map((i) => i.productId),
    ),
  ];

  const products = await db.product.findMany({
    where: { id: { in: standardProductIds } },
    select: { id: true, price: true },
  });

  const priceMap = new Map(products.map((p) => [p.id, p.price]));

  const allBuilderPartIds = [
    ...new Set(
      cartItems.flatMap((i) =>
        i.builderPartIds?.length ? i.builderPartIds : [],
      ),
    ),
  ];

  const builderParts =
    allBuilderPartIds.length > 0
      ? await db.builderPart.findMany({
          where: { id: { in: allBuilderPartIds } },
          select: {
            id: true,
            title: true,
            price: true,
            collection: { select: { slug: true } },
            category: { select: { slug: true } },
          },
        })
      : [];

  const builderPartMap = new Map(builderParts.map((p) => [p.id, p]));

  const orderItems: OrderItemCreateInput[] = [];

  for (const item of cartItems) {
    const isBuilder = Boolean(item.builderPartIds?.length);

    if (isBuilder) {
      if (!anchorProduct) {
        return {
          message:
            "Конструктор тимчасово недоступний. Спробуйте пізніше або приберіть збірку з кошика.",
          fieldErrors: {},
          values,
        };
      }

      if (item.productId !== anchorProduct.id) {
        return {
          message: "Некоректні дані кошика. Оновіть сторінку та спробуйте знову.",
          fieldErrors: {},
          values,
        };
      }

      const coll = item.collectionSlug?.trim();
      const cat = item.categorySlug?.trim();
      if (!coll || !cat) {
        return {
          message: "Некоректні дані збірки конструктора. Додайте товар знову.",
          fieldErrors: {},
          values,
        };
      }

      const ids = item.builderPartIds!;
      const orderedParts = [];
      for (const id of ids) {
        const p = builderPartMap.get(id);
        if (!p) {
          return {
            message:
              "Деякі елементи збірки більше недоступні. Відкрийте конструктор і збережіть знову.",
            fieldErrors: {},
            values,
          };
        }
        if (p.collection.slug !== coll || p.category.slug !== cat) {
          return {
            message: "Збірка не відповідає колекції. Оновіть кошик.",
            fieldErrors: {},
            values,
          };
        }
        orderedParts.push(p);
      }

      const linePrice = orderedParts.reduce(
        (sum, p) => sum + (p.price ?? 0),
        0,
      );
      const customLineTitle = orderedParts.map((p) => p.title).join(" · ");

      orderItems.push({
        productId: anchorProduct.id,
        quantity: item.quantity,
        price: linePrice,
        size: null,
        material: null,
        gemstone: null,
        pendant: null,
        builderPartIds: ids,
        builderSnapshotUrl: item.builderSnapshotUrl ?? null,
        customLineTitle,
      });
    } else {
      if (!priceMap.has(item.productId)) {
        return {
          message: "Деякі товари у кошику більше недоступні. Оновіть кошик.",
          fieldErrors: {},
          values,
        };
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: priceMap.get(item.productId)!,
        size: item.size,
        material: item.material,
        gemstone: item.gemstone,
        pendant: item.pendant,
        builderPartIds: [],
        builderSnapshotUrl: null,
        customLineTitle: null,
      });
    }
  }

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
        note: parsed.data.note || null,
        items: { create: orderItems },
      },
    });

    orderId = order.id;

    notifyAdminsNewOrder({
      id: order.id,
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      totalInCents,
      itemCount: orderItems.length,
    }).catch(() => {});

    notifyCustomerOrderConfirmation({
      orderId: order.id,
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      totalInCents,
      itemCount: orderItems.reduce((sum, i) => sum + i.quantity, 0),
      shippingCity: parsed.data.shippingCity,
      shippingPostOffice: parsed.data.shippingPostOffice,
    }).catch(() => {});
  } catch {
    return {
      message: "Не вдалося створити замовлення. Спробуйте ще раз.",
      fieldErrors: {},
      values,
    };
  }

  redirect(`/checkout/success?order=${orderId}`);
}
