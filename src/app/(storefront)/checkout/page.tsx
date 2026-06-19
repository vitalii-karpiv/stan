import { CheckoutForm } from "@/components/storefront/checkout-form";

export const metadata = { title: "Оформлення замовлення" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[max(2rem,env(safe-area-inset-top,0px))] pb-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pt-[max(3rem,env(safe-area-inset-top,0px))] sm:pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
      <h1 className="font-display text-2xl font-normal sm:text-3xl">
        Оформлення замовлення
      </h1>

      <CheckoutForm />
    </div>
  );
}
