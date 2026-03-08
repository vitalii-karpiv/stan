"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { useCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { placeOrderAction } from "@/app/(storefront)/checkout/actions";
import { initialCheckoutFormState } from "@/lib/validations/checkout";

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent px-8 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Обробка..." : "Оформити замовлення"}
    </button>
  );
}

function cartPayload(items: CartItem[]) {
  return JSON.stringify(
    items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      size: i.size,
      material: i.material,
      gemstone: i.gemstone,
    })),
  );
}

export function CheckoutForm() {
  const { items, totalPrice } = useCart();
  const [state, formAction] = useActionState(
    placeOrderAction,
    initialCheckoutFormState,
  );

  if (items.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Ваш кошик порожній. Додайте товари перед оформленням.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          До магазину
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8">
      {state.message && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}

      <input type="hidden" name="cartItems" value={cartPayload(items)} />

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Left column — form fields */}
        <div className="space-y-8">
          {/* Contact */}
          <fieldset className="space-y-4">
            <legend className="font-[family-name:var(--font-cormorant)] text-xl font-light">
              Контактні дані
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium">
                  Ім&apos;я та прізвище{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  defaultValue={state.values.name}
                  className={inputClass}
                />
                {state.fieldErrors.name && (
                  <p className="text-sm text-red-600">
                    {state.fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={state.values.phone}
                  className={inputClass}
                />
                {state.fieldErrors.phone && (
                  <p className="text-sm text-red-600">
                    {state.fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.values.email}
                className={inputClass}
              />
              {state.fieldErrors.email && (
                <p className="text-sm text-red-600">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>
          </fieldset>

          {/* Shipping */}
          <fieldset className="space-y-4">
            <legend className="font-[family-name:var(--font-cormorant)] text-xl font-light">
              Доставка Новою Поштою
            </legend>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="shippingCity"
                  className="block text-sm font-medium"
                >
                  Місто <span className="text-red-500">*</span>
                </label>
                <input
                  id="shippingCity"
                  name="shippingCity"
                  type="text"
                  autoComplete="address-level2"
                  defaultValue={state.values.shippingCity}
                  className={inputClass}
                />
                {state.fieldErrors.shippingCity && (
                  <p className="text-sm text-red-600">
                    {state.fieldErrors.shippingCity}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="shippingPostOffice"
                  className="block text-sm font-medium"
                >
                  Відділення Нової Пошти{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="shippingPostOffice"
                  name="shippingPostOffice"
                  type="text"
                  placeholder="№"
                  defaultValue={state.values.shippingPostOffice}
                  className={inputClass}
                />
                {state.fieldErrors.shippingPostOffice && (
                  <p className="text-sm text-red-600">
                    {state.fieldErrors.shippingPostOffice}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          {/* Payment placeholder */}
          <fieldset className="space-y-4">
            <legend className="font-[family-name:var(--font-cormorant)] text-xl font-light">
              Спосіб оплати
            </legend>

            <label className="flex cursor-pointer items-center gap-3 rounded border border-foreground bg-background px-4 py-3">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                defaultChecked
                className="h-4 w-4 accent-foreground"
              />
              <span className="text-sm">Оплата при отриманні</span>
            </label>

            <label className="flex cursor-not-allowed items-center gap-3 rounded border border-border bg-muted/50 px-4 py-3 opacity-60">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                disabled
                className="h-4 w-4"
              />
              <span className="text-sm">Онлайн оплата (скоро)</span>
            </label>
          </fieldset>

          {/* Submit — visible on mobile below form, hidden on lg (shown in sidebar) */}
          <div className="lg:hidden">
            <SubmitButton />
          </div>
        </div>

        {/* Right column — order summary */}
        <div className="order-first lg:order-last">
          <div className="rounded border border-border p-5">
            <h2 className="font-[family-name:var(--font-cormorant)] text-xl font-light">
              Ваше замовлення
            </h2>

            <div className="mt-4 divide-y divide-border">
              {items.map((item, idx) => (
                <SummaryRow key={idx} item={item} />
              ))}
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Разом</span>
              <span className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Submit — visible on lg in sidebar, hidden on mobile */}
            <div className="mt-4 hidden lg:block">
              <SubmitButton />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function SummaryRow({ item }: { item: CartItem }) {
  const attrs = [item.material, item.size, item.gemstone]
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productTitle}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
          {item.quantity}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="truncate text-sm font-medium">
          {item.productTitle}
        </span>
        {attrs && (
          <span className="text-xs text-muted-foreground">{attrs}</span>
        )}
      </div>

      <span className="flex-shrink-0 font-[family-name:var(--font-cormorant)] text-base font-light">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}
