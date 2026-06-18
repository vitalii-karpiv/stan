"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { syncMonobankPaymentReturn } from "../../payment-sync";

const POLL_MS = 2000;
const MAX_POLLS = 12;

export function PaymentReturnClient({
  orderId,
  initialFailedMessage,
}: {
  orderId: string;
  initialFailedMessage: string | null;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(initialFailedMessage);
  const polls = useRef(0);

  useEffect(() => {
    if (initialFailedMessage) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      const r = await syncMonobankPaymentReturn(orderId);

      if (r.kind === "success") {
        router.replace(r.successUrl);
        return;
      }

      if (r.kind === "failed" || r.kind === "error") {
        setMessage(r.message);
        return;
      }

      polls.current += 1;
      if (polls.current >= MAX_POLLS) {
        setMessage(
          "Оплата ще обробляється. Якщо кошти списано, замовлення з’явиться в листі на email після підтвердження банку.",
        );
        return;
      }

      timer = setTimeout(poll, POLL_MS);
    }

    poll();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [orderId, initialFailedMessage, router]);

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
        {message ? "Статус оплати" : "Перевіряємо оплату…"}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {message ?? "Зачекайте кілька секунд."}
      </p>
      {message && (
        <Link
          href="/checkout"
          className="mt-8 inline-flex bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Повернутися до оформлення
        </Link>
      )}
    </div>
  );
}
