import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { ClearCart } from "./clear-cart";

export const metadata = { title: "Замовлення оформлено" };

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) notFound();

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <ClearCart />

      <h1 className="font-display text-3xl font-normal">
        Дякуємо за замовлення!
      </h1>

      <p className="mt-3 text-muted-foreground">
        Ваше замовлення успішно оформлено. Ми зв&apos;яжемося з вами найближчим
        часом.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded border border-border p-5 text-left md:max-w-xl">
        <dl className="space-y-3 text-sm md:text-base">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Номер замовлення</dt>
            <dd className="font-mono">{order.id.slice(0, 8)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Кількість товарів</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-display text-muted-foreground">Сума</dt>
            <dd className="font-display font-normal">{formatPrice(order.totalInCents)}</dd>
          </div>
          <div className="flex justify-between gap-6">
            <dt className="shrink-0 text-muted-foreground">Доставка</dt>
            <dd className="text-right">
                м. {order.shippingCity}, відділення НП №{order.shippingPostOffice}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <Link
          href="/shop"
          className="inline-block bg-foreground px-8 py-3 font-display text-sm font-extrabold text-background transition-opacity hover:opacity-90 md:text-base"
        >
          Продовжити покупки
        </Link>
      </div>
    </div>
  );
}
