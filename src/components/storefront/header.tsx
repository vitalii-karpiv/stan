"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";

import { CartBadge } from "@/components/storefront/cart-badge";

const mobileLinks = [
  { href: "/shop", label: "Каталог" },
  { href: "/builder", label: "Конструктор" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" onClick={() => setMenuOpen(false)}>
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

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              <span className="sr-only">
                {menuOpen ? "Закрити меню" : "Відкрити меню"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>

            <div className="hidden md:block">
              <CartBadge />
            </div>
          </div>
        </div>

        {menuOpen && (
          <nav
            id={menuId}
            className="border-t border-border py-4 md:hidden"
            aria-label="Мобільна навігація"
          >
            <div className="flex flex-col gap-3 text-sm">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <CartBadge
          size="sm"
          className="rounded-full border border-border bg-background/80 p-2 shadow-sm backdrop-blur-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        />
      </div>
    </header>
  );
}
