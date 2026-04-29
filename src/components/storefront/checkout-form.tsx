"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useCallback, useState } from "react";
import { useFormStatus } from "react-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

import { cartItemKey, useCart, type CartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { placeOrderAction } from "@/app/(storefront)/checkout/actions";
import { initialCheckoutFormState } from "@/lib/validations/checkout";
import { NpCombobox, type NpOption } from "./np-combobox";

/** 16px on small screens avoids iOS Safari zoom-on-focus; min height improves tap targets */
const textInputClass =
  "w-full min-h-[44px] rounded border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-foreground md:min-h-0 md:py-2 md:text-sm";

const textareaClass =
  "w-full min-h-[7.5rem] rounded border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-foreground md:text-sm";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-12 w-full touch-manipulation bg-accent px-6 py-3.5 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:text-sm"
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
      pendant: i.pendant,
      builderPartIds: i.builderPartIds,
      builderSnapshotUrl: i.builderSnapshotUrl ?? null,
      customLineTitle: i.customLineTitle ?? null,
      collectionSlug: i.collectionSlug ?? null,
      categorySlug: i.categorySlug ?? null,
    })),
  );
}

async function fetchNpOptions(url: string): Promise<NpOption[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export function CheckoutForm() {
  const { items, totalPrice, updateQuantity, removeItem } = useCart();
  const [state, formAction] = useActionState(
    placeOrderAction,
    initialCheckoutFormState,
  );

  const [cityRef, setCityRef] = useState("");

  const searchCities = useCallback(
    (q: string) => fetchNpOptions(`/api/nova-poshta/cities?q=${encodeURIComponent(q)}`),
    [],
  );

  const searchWarehouses = useCallback(
    (q: string) =>
      fetchNpOptions(
        `/api/nova-poshta/warehouses?cityRef=${encodeURIComponent(cityRef)}&q=${encodeURIComponent(q)}`,
      ),
    [cityRef],
  );

  const [warehouseKey, setWarehouseKey] = useState(0);

  const handleCitySelect = useCallback((opt: NpOption | null) => {
    setCityRef(opt?.ref ?? "");
    setWarehouseKey((k) => k + 1);
  }, []);

  if (items.length === 0) {
    return (
      <div className="mt-6 text-center sm:mt-8">
        <p className="px-1 text-base text-muted-foreground sm:text-sm">
          Ваш кошик порожній. Додайте товари перед оформленням.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex min-h-12 touch-manipulation items-center justify-center bg-foreground px-8 py-3 text-base font-medium text-background transition-opacity hover:opacity-90 sm:text-sm"
        >
          До магазину
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 sm:mt-8">
      {state.message && (
        <div className="mb-4 break-words rounded border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200 sm:mb-6 sm:px-4">
          {state.message}
        </div>
      )}

      <input type="hidden" name="cartItems" value={cartPayload(items)} />

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_min(100%,380px)] lg:gap-10">
        {/* Left column — form fields */}
        <div className="min-w-0 space-y-6 sm:space-y-8">
          {/* Contact */}
          <fieldset className="space-y-4">
            <legend className="mb-1 block w-full pb-1 font-[family-name:var(--font-cormorant)] text-lg font-light sm:text-xl">
              Контактні дані
            </legend>

            <div className="grid gap-4 md:grid-cols-2">
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
                  className={textInputClass}
                />
                {state.fieldErrors.name && (
                  <p className="break-words text-sm text-red-600">
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
                  className={textInputClass}
                />
                {state.fieldErrors.phone && (
                  <p className="break-words text-sm text-red-600">
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
                  className={textInputClass}
                />
              {state.fieldErrors.email && (
                <p className="break-words text-sm text-red-600">
                  {state.fieldErrors.email}
                </p>
              )}
            </div>
          </fieldset>

          {/* Shipping */}
          <fieldset className="space-y-4">
            <legend className="mb-1 block w-full pb-1 font-[family-name:var(--font-cormorant)] text-lg font-light sm:text-xl">
              Доставка Новою Поштою
            </legend>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="shippingCity"
                  className="block text-sm font-medium"
                >
                  Місто <span className="text-red-500">*</span>
                </label>
                <NpCombobox
                  id="shippingCity"
                  name="shippingCity"
                  placeholder="Почніть вводити назву міста"
                  defaultValue={state.values.shippingCity}
                  onSearch={searchCities}
                  onSelect={handleCitySelect}
                />
                {state.fieldErrors.shippingCity && (
                  <p className="break-words text-sm text-red-600">
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
                <NpCombobox
                  key={warehouseKey}
                  id="shippingPostOffice"
                  name="shippingPostOffice"
                  placeholder="Почніть вводити номер"
                  disabled={!cityRef}
                  defaultValue={state.values.shippingPostOffice}
                  onSearch={searchWarehouses}
                />
                {state.fieldErrors.shippingPostOffice && (
                  <p className="break-words text-sm text-red-600">
                    {state.fieldErrors.shippingPostOffice}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 block w-full pb-1 font-[family-name:var(--font-cormorant)] text-lg font-light sm:text-xl">
              Коментар до замовлення
            </legend>
            <div className="space-y-1.5">
              <label htmlFor="note" className="block text-sm font-medium">
                Примітка
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                maxLength={500}
                defaultValue={state.values.note}
                className={textareaClass}
              />
              {state.fieldErrors.note && (
                <p className="break-words text-sm text-red-600">{state.fieldErrors.note}</p>
              )}
            </div>
          </fieldset>

          {/* Payment placeholder */}
          <fieldset className="space-y-4">
            <legend className="mb-1 block w-full pb-1 font-[family-name:var(--font-cormorant)] text-lg font-light sm:text-xl">
              Спосіб оплати
            </legend>

            <label className="flex min-h-12 cursor-pointer touch-manipulation items-center gap-3 rounded border border-foreground bg-background px-3 py-3 sm:min-h-0 sm:px-4">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                defaultChecked
                className="h-5 w-5 shrink-0 accent-foreground sm:h-4 sm:w-4"
              />
              <span className="text-base leading-snug sm:text-sm">
                Оплата при отриманні
              </span>
            </label>

            <label className="flex min-h-12 cursor-pointer touch-manipulation items-center gap-3 rounded border border-border bg-background px-3 py-3 sm:min-h-0 sm:px-4">
              <input
                type="radio"
                name="paymentMethod"
                value="monobank"
                className="h-5 w-5 shrink-0 accent-foreground sm:h-4 sm:w-4"
              />
              <span className="text-base leading-snug sm:text-sm">
                Онлайн оплата (карта, Apple Pay, Google Pay)
              </span>
            </label>
          </fieldset>

          {/* Submit — visible on mobile below form, hidden on lg (shown in sidebar) */}
          <div className="lg:hidden">
            <SubmitButton />
          </div>
        </div>

        {/* Right column — order summary */}
        <div className="min-w-0">
          <div className="rounded border border-border p-3 sm:p-5">
            <h2 className="font-[family-name:var(--font-cormorant)] text-lg font-light sm:text-xl">
              Ваше замовлення
            </h2>

            <div className="mt-4 divide-y divide-border">
              {items.map((item) => (
                <SummaryRow
                  key={cartItemKey(item)}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border pt-4">
              <span className="text-base text-muted-foreground sm:text-sm">
                Разом
              </span>
              <span className="font-[family-name:var(--font-cormorant)] text-xl font-light tabular-nums sm:text-2xl">
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

function SummaryRow({
  item,
  onUpdateQuantity,
  onRemove,
}: Readonly<{
  item: CartItem;
  onUpdateQuantity: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
}>) {
  const key = cartItemKey(item);
  const attrs = [item.material, item.size, item.gemstone]
    .filter(Boolean)
    .join(" / ");
  const pendantImage = item.pendant?.trim() || null;
  const isBuilder = Boolean(item.builderPartIds?.length);
  const thumbUrl =
    item.builderSnapshotUrl?.trim() || item.imageUrl?.trim() || null;
  const thumbUnoptimized = Boolean(
    thumbUrl?.toLowerCase().endsWith(".svg"),
  );

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-[4.5rem] w-[3.75rem] shrink-0 overflow-hidden rounded sm:h-16 sm:w-14">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={item.productTitle}
            fill
            sizes="60px"
            className="object-cover"
            unoptimized={thumbUnoptimized}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <span className="text-sm font-medium leading-snug break-words sm:line-clamp-2">
              {item.productTitle}
            </span>
            {isBuilder && item.customLineTitle && (
              <span className="mt-0.5 block text-xs leading-snug break-words text-muted-foreground">
                {item.customLineTitle}
              </span>
            )}
            {!isBuilder && attrs && (
              <span className="mt-0.5 block text-xs leading-snug break-words text-muted-foreground">
                {attrs}
              </span>
            )}
            {pendantImage && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Підвіска:</span>
                <div className="relative h-5 w-5 overflow-hidden rounded border border-border">
                  <Image
                    src={pendantImage}
                    alt="Підвіска"
                    fill
                    sizes="20px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          <span className="shrink-0 font-[family-name:var(--font-cormorant)] text-base font-light tabular-nums sm:text-right">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() => onUpdateQuantity(key, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-1.5"
            >
              <Minus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </button>
            <span className="min-w-[2rem] text-center text-sm sm:text-xs">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(key, item.quantity + 1)}
              className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-foreground sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-1.5"
            >
              <Plus className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(key)}
            className="flex min-h-11 min-w-11 touch-manipulation items-center justify-center text-muted-foreground transition-colors hover:text-destructive sm:min-h-0 sm:min-w-0 sm:p-1"
            aria-label="Видалити товар"
          >
            <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
