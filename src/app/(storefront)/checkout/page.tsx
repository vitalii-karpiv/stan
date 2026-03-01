export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Checkout form with shipping, contact info, and payment will be
        implemented here.
      </p>
    </div>
  );
}
