import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { db } from "@/lib/db";
import { SizeGuideTabs } from "@/components/storefront/size-guide-tabs";
import { ProductCard } from "@/components/storefront/product-card";
import { HomeFaq } from "@/components/storefront/home-faq";

export const revalidate = 60;

const sectionTitle =
  "font-bold uppercase tracking-tight text-brand text-[26px] leading-normal";

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-xl bg-accent px-8 py-2.5 text-xl font-bold text-accent-foreground transition-opacity hover:opacity-90";

export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    where: { featured: true, published: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
    },
  });

  return (
    <div className="bg-canvas text-brand">
      {/* Hero */}
      <section className="relative flex min-h-[min(88vh,860px)] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src="/images/hero-background.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-canvas/65"
            aria-hidden
          />
        </div>
        <h1 className="max-w-[22rem] font-bold uppercase leading-tight tracking-tight text-brand sm:max-w-none md:text-[40px] md:leading-none">
          ПРИКРАСИ – КОНСТРУКТОРИ
        </h1>
        <p className="mt-6 max-w-xl text-base uppercase leading-normal text-brand">
          Коли прикраса перестає бути просто аксесуаром і стає маленьким ритуалом
          щоденного самовираження
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/shop" className={primaryButtonClass}>
            Каталог
          </Link>
          <Link href="/builder" className={primaryButtonClass}>
            Конструктор
          </Link>
        </div>
      </section>

      {/* Конструктор */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <div className="flex flex-col items-center gap-7 text-center">
          <h2 className={`${sectionTitle} w-full`}>
            Створи прикрасу самостійно
          </h2>
          <div className="relative aspect-[2802/1732] w-full max-w-3xl shadow-[0_0_125.3px_rgba(68,13,13,0.05)]">
            <Image
              src="/images/home-builder-preview.png"
              alt="Інтерфейс конструктора прикрас Stan"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <Link href="/builder" className={primaryButtonClass}>
            Конструктор
          </Link>
        </div>
      </section>

      {/* Готові варіанти */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className={sectionTitle}>Обирай готові варіанти</h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-base font-normal text-brand underline-offset-4 hover:underline"
          >
            Перейти до каталогу
            <ChevronRight className="size-5 shrink-0" aria-hidden />
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                slug={product.slug}
                imageUrl={product.images[0]?.url ?? null}
                imageAlt={product.images[0]?.alt ?? null}
                secondImageUrl={product.images[1]?.url ?? null}
                secondImageAlt={product.images[1]?.alt ?? null}
                price={product.price}
                titleClassName="font-sans text-base font-normal text-brand"
                priceClassName="mt-2 font-sans text-xl font-normal uppercase text-brand"
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-base text-taupe">
            Рекомендовані товари з&#39;являться незабаром.
          </p>
        )}
      </section>

      {/* Про нас */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          <div className="relative aspect-[396/490] w-full max-w-md justify-self-center md:max-w-none">
            <Image
              src="/images/home-about-craft.png"
              alt="Створення прикрас Stan за робочим столом"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="min-w-0">
            <h2 className={sectionTitle}>Про нас</h2>
            <div className="mt-7 space-y-4 text-base leading-[1.247] text-brand">
              <p>STAN розпочався з дружби.</p>
              <p>
                Привіт, ми — Катя та Наталя, засновниці бренду STAN. Ми дуже
                різні — як внутрішньо, так і зовні — але вже майже 20 років
                приймаємо одна одну та вчимося поєднувати це «різне».
              </p>
              <p>
                Наша історія надихнула нас на питання: як одна й та сама прикраса
                може пасувати різним особистостям? Чи може прикраса давати
                відчуття свободи самовираження, дозволяти досліджувати себе і свої
                стани?
              </p>
              <p>
                І ми зрозуміли: просто прикрас недостатньо. Так з’явилась ідея
                прикрас-конструкторів. Прикрас, які ти створюєш сама. Не під
                тренди — під себе, свій настрій та відчуття.
              </p>
              <p>
                Ти не однакова щодня. Чому тоді прикраси мають бути такими?
                Тому STAN — це про свободу бути собою, бути різною, такою, як ти
                відчуваєш себе сьогодні.
              </p>
              <p>
                А наші прикраси будуть змінюватися разом із тобою, підтримуючи
                кожен твій СТАН.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Догляд */}
      <section
        id="jewelry-care"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 md:py-20"
      >
        <h2 className={`${sectionTitle} text-center`}>Догляд за прикрасами</h2>
        <div className="mt-12 grid gap-12 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-normal text-brand">НОСІННЯ</h3>
            <div className="space-y-4 text-base leading-[1.247] text-brand">
              <p>
                Уникайте контакту прикрас із косметичними засобами та побутовою
                хімією. Наносьте парфуми, креми, лак для волосся та інші засоби
                до того, як одягнути прикрасу. Знімайте їх перед прибиранням, а
                також перед відвідуванням сауни, заняттями спортом чи плаванням.
              </p>
              <p>
                Обов’язково знімайте прикраси перед сном — це про вашу безпеку
                та комфорт, а також допомагає уникнути пошкоджень і деформації.
              </p>
              <p>
                Запам&apos;ятай золоте правило: «Прикраса — остання річ, яку варто
                одягати, виходячи з дому, і перша, яку варто знімати після
                повернення».
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-normal text-brand">ЗБЕРІГАННЯ</h3>
            <p className="text-base leading-[1.247] text-brand">
              Зберігайте прикраси окремо одна від одної, а також подалі від
              гострих предметів, щоб уникнути подряпин і пошкоджень. Уникайте
              впливу прямих сонячних променів.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-normal text-brand">ДОГЛЯД</h3>
            <p className="text-base leading-[1.247] text-brand">
              З часом на прикрасах може накопичуватись пил і забруднення, що
              зменшує їх блиск. Не рекомендуємо мити або замочувати вироби, а
              також використовувати агресивні засоби для очищення. Для догляду
              достатньо регулярно протирати прикраси м&apos;якою сухою тканиною.
            </p>
          </div>
        </div>
        <p className="mx-auto mt-14 max-w-2xl text-center font-[family-name:var(--font-cormorant)] text-3xl italic leading-tight text-accent md:text-[36px]">
          піклуйся про себе і свої прикраси
        </p>
        <Image
          src="/jewelry_care.png"
          alt="Візуальні поради з догляду за прикрасами"
          width={786}
          height={851}
          className="mx-auto mt-12 w-full max-w-2xl"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2 className={`${sectionTitle} mb-10 text-center md:mb-14`}>FAQ</h2>
        <HomeFaq />
      </section>

      <section
        id="size-guide"
        className="mx-auto max-w-7xl scroll-mt-24 px-6 py-12 md:py-16"
      >
        <h2 className={`${sectionTitle} mb-8`}>Як дізнатися розмір</h2>
        <SizeGuideTabs />
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-20 pt-4 text-center">
        <h2 className="font-bold uppercase leading-snug text-brand text-[26px]">
          Виникли запитання?
          <br />
          Ми з радістю відповімо на них в Direct
        </h2>
        <a
          href="https://www.instagram.com/stan.jewels"
          target="_blank"
          rel="noreferrer"
          className={`${primaryButtonClass} mt-8`}
        >
          Написати нам
        </a>
      </section>
    </div>
  );
}
