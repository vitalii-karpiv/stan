"use client";

import Image from "next/image";
import Link from "next/link";

import { CartBadge } from "@/components/storefront/cart-badge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-canvas">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <Image
              src="/stan_logo.svg"
              alt="Stan"
              width={80}
              height={26}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link
              href="/shop"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Каталог
            </Link>
            <Link
              href="/builder"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Конструктор
            </Link>
          </nav>

          <CartBadge />
        </div>
      </div>
    </header>
  );
}
