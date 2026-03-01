export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Your Cart
      </h1>

      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          Your cart is empty. Start shopping to add items.
        </p>
      </div>
    </div>
  );
}
