import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <Image src="/stan_logo.svg" alt="Stan" width={80} height={26} priority />
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/shop" className="text-muted-foreground transition-colors hover:text-foreground">
            Магазин
          </Link>
          <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
            Контакти
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-foreground">
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
