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
              Сучасні мінімалістичні прикраси, створені з турботою.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Магазин</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/shop" className="hover:text-foreground">
                  Усі прикраси
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="hover:text-foreground">
                  Намиста
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="hover:text-foreground">
                  Браслети
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Допомога</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Зв&#39;язатися з нами
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Stan. Усі права захищені.
        </div>
      </div>
    </footer>
  );
}
