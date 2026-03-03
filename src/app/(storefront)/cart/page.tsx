export const metadata = { title: "Кошик" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Ваш кошик
      </h1>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          Ваш кошик порожній. Почніть покупки, щоб додати товари.
        </p>
      </div>
    </div>
  );
}
