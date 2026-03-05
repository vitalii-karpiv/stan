"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
          Ваш кошик
        </h1>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Ваш кошик порожній. Почніть покупки, щоб додати товари.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            До магазину
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Ваш кошик
      </h1>

      <div className="mt-8 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <CartRow
            key={item.variantId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex items-baseline gap-3">
          <span className="text-sm text-muted-foreground">Разом:</span>
          <span className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
            {formatPrice(totalPrice)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Оформити замовлення
        </Link>
      </div>
    </div>
  );
}

function CartRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
}) {
  const attrs = [item.material, item.size, item.gemstone]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/shop/${item.productSlug}`}
        className="relative h-24 w-20 flex-shrink-0 overflow-hidden"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productTitle}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/shop/${item.productSlug}`}
            className="font-medium hover:underline"
          >
            {item.productTitle}
          </Link>
          {attrs && (
            <p className="mt-0.5 text-sm text-muted-foreground">{attrs}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-border">
            <button
              onClick={() =>
                onUpdateQuantity(item.variantId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[2rem] text-center text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                onUpdateQuantity(item.variantId, item.quantity + 1)
              }
              className="px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.variantId)}
            className="text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end justify-between">
        <span className="text-sm">
          {formatPrice(item.priceInCents * item.quantity)}
        </span>
        {item.quantity > 1 && (
          <span className="text-xs text-muted-foreground">
            {formatPrice(item.priceInCents)} / шт
          </span>
        )}
      </div>
    </div>
  );
}
