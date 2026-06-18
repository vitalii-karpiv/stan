export const metadata = { title: "Доставка і оплата" };

export default function DeliveryPaymentPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light">
        Доставка і оплата
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Ми доставляємо замовлення по всій Україні службами доставки. Термін
          відправки зазвичай становить 1-3 робочі дні після підтвердження
          замовлення.
        </p>
        <p>
          Вартість доставки розраховується за тарифами перевізника та
          оплачується покупцем під час отримання, якщо інше не вказано під час
          оформлення.
        </p>
        <p>
          Оплата доступна онлайн під час оформлення замовлення або іншим
          способом, запропонованим на сторінці checkout.
        </p>
        <p>
          Після відправки ви отримуєте повідомлення з номером ТТН для
          відстеження посилки.
        </p>
      </div>
    </div>
  );
}
