"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

type CartBadgeProps = {
  className?: string;
  size?: "default" | "sm";
};

export function CartBadge({ className, size = "default" }: CartBadgeProps) {
  const { totalItems } = useCart();

  const ariaLabel =
    totalItems > 0 ? `Кошик, ${totalItems} товарів` : "Кошик";

  return (
    <Link
      href="/checkout"
      aria-label={ariaLabel}
      className={cn("relative inline-flex text-foreground", className)}
    >
      <ShoppingBag className={"h-5 w-5"} aria-hidden />
      {totalItems > 0 && (
        <span className={"absolute flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground -right-2 -top-2"}>
          {totalItems > 99 ? "99" : totalItems}
        </span>
      )}
    </Link>
  );
}
