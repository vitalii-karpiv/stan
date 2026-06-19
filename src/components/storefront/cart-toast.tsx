"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";

import type { CartItem } from "@/lib/cart";

export type CartNotice = { item: Omit<CartItem, "quantity">; id: number };

/** How long the toast stays before auto-dismissing. */
const VISIBLE_MS = 3500;

export function CartToast({
  notice,
  onDismiss,
}: Readonly<{
  notice: CartNotice | null;
  onDismiss: () => void;
}>) {
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(onDismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  const { item } = notice;
  const title = item.customLineTitle?.trim() || item.productTitle;
  const thumb =
    item.builderSnapshotUrl?.trim() || item.imageUrl?.trim() || null;
  const unoptimized = Boolean(thumb?.toLowerCase().endsWith(".svg"));

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4 sm:inset-x-auto sm:right-6 sm:justify-end"
      role="status"
      aria-live="polite"
    >
      <div
        key={notice.id}
        className="cart-toast-enter pointer-events-auto relative flex w-full max-w-sm items-start gap-3 rounded border border-border bg-background p-3 pr-9 shadow-lg"
      >
        <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-muted">
          {thumb && (
            <Image
              src={thumb}
              alt={title}
              fill
              sizes="48px"
              className="object-cover"
              unoptimized={unoptimized}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-display text-sm font-normal md:text-base">
            <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            Товар додано до кошика
          </p>
          <p className="mt-0.5 truncate text-sm text-muted-foreground md:text-base">
            {title}
          </p>
          <Link
            href="/checkout"
            onClick={onDismiss}
            className="mt-1.5 inline-block font-display text-xs font-extrabold tracking-wide text-accent transition-opacity hover:opacity-80"
          >
            Переглянути кошик
          </Link>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Закрити"
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
