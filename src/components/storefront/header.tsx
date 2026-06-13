"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { CartBadge } from "@/components/storefront/cart-badge";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-foreground md:hidden"
            aria-label="Меню"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:translate-x-0 md:translate-y-0"
          >
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

      {open ? (
        <nav className="border-t border-border py-2 md:hidden">
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="block py-2 text-center text-sm text-foreground transition-colors hover:text-muted-foreground"
          >
            Каталог
          </Link>
          <Link
            href="/builder"
            onClick={() => setOpen(false)}
            className="block py-2 text-center text-sm text-foreground transition-colors hover:text-muted-foreground"
          >
            Конструктор
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
