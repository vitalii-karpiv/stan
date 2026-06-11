import Image from "next/image";
import Link from "next/link";

import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import { ButtonLink } from "@/components/storefront/button";
import { FaqAccordion } from "@/components/storefront/faq-accordion";

export const revalidate = 60;

const headingClassName =
  "font-[family-name:var(--font-display)] font-[750] uppercase text-brand";

const faqItems = [
  {
    question: "Який матеріал фурнітури?",
    answer: (
      <>
        <p>
          Для срібного кольору фурнітури ми використовуємо нержавіючу сталь 304L
          та 316L.
        </p>
        <p>
          Для золотого кольору — нержавіючу сталь з pvd (вакуумним покриття)
          золотом 18K.
        </p>
      </>
    ),
  },
  {
    question: "Чи стирається / темніє покриття?",
    answer: (
      <>
        <p>
          Для золотої фурнітури ми використовуємо PVD-покриття — технологію, яка
          є значно стійкішою до зовнішніх впливів, ніж звичайне гальванічне. Якщо
          спростити: у стандартному варіанті золото просто наноситься на метал, а
          при PVD — «зʼєднується» з ним у вакуумі, що забезпечує кращу
          зносостійкість.
        </p>
        <p>
          Покриття не стирається, але з часом може втратити блиск через вплив
          зовнішніх факторів (вода, косметика, піт). Це природний процес для
          будь-якого покриття.
        </p>
        <p>Фурнітура з нержавіючої сталі не стирається і не темніє.</p>
      </>
    ),
  },
  {
    question: "Як довго прослужать прикраси?",
    answer: (
      <>
        <p>
          Золота фурнітура з PVD-покриттям зберігає свій вигляд від 3 до 5 років
          при щоденному носінні, а за більш дбайливого використання — і довше.
          Тривалість носіння також може залежати від індивідуального pH шкіри та
          умов використання.
        </p>
        <p>
          Фурнітура з нержавіючої сталі є довговічною і практично не має обмежень
          у терміні служби.
        </p>
      </>
    ),
  },
  {
    question: "Чи може бути алергія на метал?",
    answer: (
      <>
        <p>
          Нержавіюча сталь (особливо 304L та 316L, яку часто називають
          «хірургічною») вважається гіпоалергенною і зазвичай добре підходить для
          чутливої шкіри.
        </p>
        <p>
          Золота фурнітура має основу з тієї ж нержавіючої сталі та покрита шаром
          золота 18k. Завдяки високому вмісту чистого золота таке покриття
          зазвичай не викликає подразнень.
        </p>
        <p>
          Водночас реакція шкіри є дуже індивідуальною, тому в рідкісних випадках
          можлива чутливість до металів.
        </p>
      </>
    ),
  },
  {
    question: "Чи можна обрати довжину намиста?",
    answer: (
      <>
        <p>
          Так, ми виготовляємо кожну прикрасу індивідуально під ваші вподобання.
        </p>
        <p>
          Хоч наші намиста мають стандартну довжину, ми радимо обирати її під
          себе, адже одна й та сама довжина виглядає по-різному на кожній людині.
          Комусь більше подобається варіант під шию, а хтось обирає довші
          прикраси.
        </p>
        <p>
          Ви можете вказати бажану довжину в коментарі під час оформлення
          замовлення — ми врахуємо всі побажання.
        </p>
        <p>
          Зверніть увагу, що при збільшенні довжини більш ніж на 5 см від
          стандартної передбачена доплата.
        </p>
      </>
    ),
  },
  {
    question: "Який час виготовлення та доставки?",
    answer: (
      <>
        <p>
          Час виготовлення та відправки прикраси 1-3 дні з моменту оформлення
          замовлення. У святкові періоди він може бути трохи довшим — у такому
          випадку ми обовʼязково попереджаємо.
        </p>
        <p>
          Подальші терміни доставки залежать від обраної поштової служби.
          Наприклад, доставка Новою Поштою зазвичай не перевищує 3 днів, окрім
          святкових періодів.
        </p>
        <p>
          Щоб вам було зручніше планувати замовлення, залишаємо наш графік роботи:
        </p>
        <ul className="list-none">
          <li>ПН–ПТ: 10:00–19:00</li>
          <li>СБ: 11:00–16:00</li>
          <li>НД: вихідний</li>
        </ul>
      </>
    ),
  },
  {
    question: "Чи є доставка закордон?",
    answer: (
      <>
        <p>Так, ми доставляємо прикраси закордон.</p>
        <p>
          Можемо відправити замовлення зручною для вас службою: Нова Пошта,
          Укрпошта, Meest або іншою за домовленістю.
        </p>
        <p>
          Оформлення таких замовлень відбувається через дірект в Instagram
          (@stan.jewels).
        </p>
        <p>
          Звертаємо увагу, що в деяких країнах, зокрема в країнах ЄС, можуть діяти
          обмеження на ввезення прикрас із перлів, через що поштові служби іноді
          не приймають такі відправлення. Ми завжди намагаємось знайти рішення і
          готові запропонувати альтернативні варіанти доставки, щоб ваше
          замовлення успішно дійшло до вас.
        </p>
      </>
    ),
  },
  {
    question: "Чи є гарантія?",
    answer: (
      <>
        <p>Так, ми надаємо безкоштовну гарантію на 1 рік, вона покриває:</p>
        <ul className="list-disc pl-5">
          <li>заміну зламаного замка, чи інших елементів</li>
          <li>відновлення розʼєднаних елементів</li>
          <li>подовження/корекція прикраси</li>
          <li>виробничі дефекти</li>
        </ul>
        <p>Звертаємо увагу, що доставку в обидві сторони оплачує клієнт.</p>
        <p>
          Гарантія НЕ поширюється на випадки, які були наслідком дій клієнта:
        </p>
        <ul className="list-disc pl-5">
          <li>механічні пошкодження</li>
          <li>неправильне використання</li>
        </ul>
        <p>
          Покриття має природний знос, який залежить від умов носіння та
          індивідуальних особливостей, тому не підлягає гарантії. Водночас ми
          завжди готові допомогти з оновленням або заміною елементів.
        </p>
        <p>
          Ми також пропонуємо сервіс догляду та ремонту, щоб ваші прикраси
          залишались з вами якомога довше.
        </p>
        <p>За усіма деталями звертайтеся в дірект Інстаграм (@stan.jewels).</p>
      </>
    ),
  },
];

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
    <div className="bg-[#fffefd]">
      {/* Hero */}
      <section
        className="relative isolate flex min-h-[80vh] items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat px-6 py-20 text-center"
        style={{ backgroundImage: "url('/main-background.png')" }}
      >
        <div className="relative mx-auto max-w-3xl">
          <h1 className={`${headingClassName} text-3xl tracking-tight md:text-[40px]`}>
            Прикраси — конструктори
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-brand md:text-base">
            Коли прикраса перестає бути просто аксесуаром і стає маленьким
            ритуалом щоденного самовираження.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/shop">Каталог</ButtonLink>
            <ButtonLink href="/builder">Конструктор</ButtonLink>
          </div>
        </div>
      </section>

      {/* Builder promo */}
      <section className="mx-auto max-w-7xl px-6 py-12 text-center">
        <h2 className={`${headingClassName} text-2xl md:text-3xl`}>
          Створюй власну прикрасу
        </h2>
        <Image
          src="/home-builder-preview.png"
          alt="Конструктор прикрас Stan"
          width={1116}
          height={785}
          className="mt-8 h-auto w-full overflow-hidden rounded-xl border border-border"
          sizes="(max-width: 1280px) 100vw, 1216px"
          priority
        />
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/builder">Конструктор</ButtonLink>
        </div>
      </section>

      {/* Ready-made products */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className={`${headingClassName} text-2xl md:text-3xl`}>
            Обирай готову прикрасу
          </h2>
          <Link
            href="/shop"
            className="shrink-0 text-sm text-brand underline underline-offset-4"
          >
            Перейти до каталогу
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Рекомендовані товари зʼявляться незабаром.
          </p>
        )}
      </section>

      {/* About */}
      <section className="relative mx-auto max-w-7xl px-6 py-12">
        <Image
          src="/stars.png"
          alt=""
          aria-hidden
          width={120}
          height={120}
          className="pointer-events-none absolute right-6 top-8 hidden w-20 lg:block"
        />
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
            <Image
              src="/about_us.png"
              alt="Засновниці бренду STAN"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 608px"
            />
          </div>
          <div>
            <h2 className={`${headingClassName} text-2xl md:text-3xl`}>Про нас</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-brand/90">
              <p>STAN розпочався з дружби.</p>
              <p>
                Привіт, ми — Катя та Наталя, засновниці бренду STAN. Ми дуже різні
                — як внутрішньо, так і зовні — але вже майже 20 років приймаємо
                відмінності одна одної та поєднуємо це «різне».
              </p>
              <p>
                Наша історія надихнула нас на питання: як одна й та сама прикраса
                може пасувати різним особистостям? Чи може прикраса давати
                відчуття свободи самовираження, дозволяти досліджувати себе і свої
                стани?
              </p>
              <p>
                І ми зрозуміли: просто прикраси недостатньо. Так зʼявилась ідея
                прикрас-конструкторів. Прикрас, які ти створюєш самостійно. Не під
                тренди — під себе, свій настрій, та відчуття.
              </p>
              <p>
                Ти не однакова щодня. Чому тоді прикраси мають бути такими? Тому,
                STAN — це про свободу бути собою, бути різною, такою, як ти
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

      {/* Care */}
      <section id="jewelry-care" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-12">
        <h2 className={`${headingClassName} text-center text-2xl md:text-3xl`}>
          Догляд за прикрасами
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-medium uppercase tracking-[0.2em] text-brand">
              Носіння
            </h3>
            <p className="mt-4 leading-relaxed text-brand/80">
              Уникайте контакту прикрас із косметичними засобами та побутовою
              хімією. Наносьте парфуми, креми, лак для волосся та інші засоби до
              того, як одягнути прикрасу. Знімайте їх перед прибиранням, а також
              перед відвідуванням сауни, заняттями спортом чи плаванням.
              Обовʼязково знімайте прикраси перед сном — це про вашу безпеку та
              комфорт, а також допомагає уникнути пошкоджень і деформації.
              Запамʼятай золоте правило: «Прикраса — остання річ, яку варто
              одягати, виходячи з дому, і перша, яку варто знімати після
              повернення».
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/jewelry_care.png"
              alt="Поради з догляду за прикрасами"
              width={786}
              height={851}
              className="w-full max-w-sm rounded-xl"
              sizes="(max-width: 1024px) 100vw, 384px"
            />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium uppercase tracking-[0.2em] text-brand">
                Зберігання
              </h3>
              <p className="mt-4 leading-relaxed text-brand/80">
                Зберігайте прикраси окремо одна від одної, а також подалі від
                гострих предметів, щоб уникнути подряпин і пошкоджень. Уникайте
                впливу прямих сонячних променів.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium uppercase tracking-[0.2em] text-brand">
                Догляд
              </h3>
              <p className="mt-4 leading-relaxed text-brand/80">
                З часом на прикрасах може накопичуватись пил і забруднення, що
                зменшує їх блиск. Не рекомендуємо мити або замочувати вироби, а
                також використовувати агресивні засоби для очищення. Для догляду
                достатньо регулярно протирати прикраси мʼякою сухою тканиною.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-12 text-center font-[family-name:var(--font-display)] text-lg uppercase tracking-[0.2em] text-accent md:text-xl">
          Піклуйся про себе і свої прикраси
        </p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className={`${headingClassName} text-center text-2xl md:text-3xl`}>
          FAQ
        </h2>
        <div className="mt-10">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* Direct CTA */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-xl border border-border bg-muted p-10 text-center">
          <p className="text-brand sm:text-lg">
            Виникли запитання? Ми з радістю відповімо на них в Direct
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="https://www.instagram.com/stan.jewels" external>
              Написати нам
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
