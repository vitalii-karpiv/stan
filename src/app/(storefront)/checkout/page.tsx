import { CheckoutForm } from "@/components/storefront/checkout-form";

export const metadata = { title: "Оформлення замовлення" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-light">
        Оформлення замовлення
      </h1>

      <CheckoutForm />
    </div>
  );
}
