import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-[family-name:var(--font-cormorant)] text-lg font-semibold">
              STAN
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Modern minimalist jewelry, crafted with care.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Shop</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/shop" className="hover:text-foreground">
                  All Jewelry
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="hover:text-foreground">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="hover:text-foreground">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Help</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Stan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
