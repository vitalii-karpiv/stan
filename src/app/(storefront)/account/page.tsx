export const metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        My Account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Account settings and order history will be accessible here.
      </p>
    </div>
  );
}
