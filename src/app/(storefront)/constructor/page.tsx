export const metadata = { title: "Конструктор" };

export default function ConstructorPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Конструктор
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Розділ конструктора зараз у розробці.
        </p>
        <p>
          Незабаром тут можна буде зібрати прикрасу у власній комбінації та
          переглянути доступні елементи.
        </p>
      </div>
    </div>
  );
}
