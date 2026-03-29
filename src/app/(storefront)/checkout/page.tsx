import { CheckoutForm } from "@/components/storefront/checkout-form";

export const metadata = { title: "Оформлення замовлення" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-light sm:text-4xl">
        Оформлення замовлення
      </h1>

      <CheckoutForm />
    </div>
  );
}
