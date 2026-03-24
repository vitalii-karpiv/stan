import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/db";

export async function Footer() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <Link href="/" aria-label="Stan">
              <Image src="/stan_logo.svg" alt="Stan" width={100} height={33} />
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Сучасні мінімалістичні прикраси, створені з турботою.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium">Магазин</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/shop" className="hover:text-foreground">
                    Усі прикраси
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className="hover:text-foreground"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium">Контакти</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <a href="tel:+380684242786" className="hover:text-foreground">
                    +38 (068) 424-27-86
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:stan.bijou@gmail.com"
                    className="hover:text-foreground"
                  >
                    stan.bijou@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/stan.jewels"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@stan.jewelry"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium">Додаткова інформація</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>
                  <Link href="/delivery-payment" className="hover:text-foreground">
                    Доставка і оплата
                  </Link>
                </li>
                <li>
                  <Link href="/exchange-returns" className="hover:text-foreground">
                    Обмін та повернення
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-foreground">
                    Політика конфіденційності
                  </Link>
                </li>
                <li>
                  <Link href="/offer-agreement" className="hover:text-foreground">
                    Договір оферти
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Stan. Усі права захищені.
        </div>
      </div>
    </footer>
  );
}
