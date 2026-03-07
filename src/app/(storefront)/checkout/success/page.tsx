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

      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Дякуємо за замовлення!
      </h1>

      <p className="mt-3 text-muted-foreground">
        Ваше замовлення успішно оформлено. Ми зв&apos;яжемося з вами найближчим
        часом.
      </p>

      <div className="mx-auto mt-8 max-w-sm rounded border border-border p-5 text-left">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Номер замовлення</dt>
            <dd className="font-mono text-xs">{order.id.slice(0, 8)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Кількість товарів</dt>
            <dd>{itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Сума</dt>
            <dd className="font-medium">{formatPrice(order.totalInCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Доставка</dt>
            <dd>
                м. {order.shippingCity}, відділення НП №{order.shippingPostOffice}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Продовжити покупки
        </Link>
        <Link
          href="/account/orders"
          className="rounded border border-border px-8 py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Мої замовлення
        </Link>
      </div>
    </div>
  );
}
