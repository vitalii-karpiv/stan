export const metadata = { title: "Акаунт" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Мій акаунт
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Налаштування акаунту та історія замовлень будуть доступні тут.
      </p>
    </div>
  );
}
