"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/lib/cart";

export function CartBadge() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="relative text-foreground">
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
          {totalItems > 99 ? "99" : totalItems}
        </span>
      )}
    </Link>
  );
}
