"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { sendShipmentNotification } from "@/app/admin/orders/[id]/actions";
import { initialShipmentNotifyState } from "@/app/admin/orders/[id]/shipment-notify-state";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Надсилання…" : "Надіслати"}
    </button>
  );
}

type Props = {
  orderId: string;
  trackingNumber: string | null;
};

export function OrderShipmentNotifyForm({ orderId, trackingNumber }: Props) {
  const [state, formAction] = useActionState(
    sendShipmentNotification.bind(null, orderId),
    initialShipmentNotifyState,
  );

  return (
    <form action={formAction} className="mt-2 space-y-2">
      {state.message && state.variant === "error" && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}
      {state.message && state.variant === "success" && (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          {state.message}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          key={trackingNumber ?? ""}
          id="trackingNumber"
          name="trackingNumber"
          type="text"
          autoComplete="off"
          placeholder="59001234567890"
          defaultValue={trackingNumber ?? ""}
          className="min-w-[12rem] flex-1 rounded border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-foreground"
        />
        <SubmitButton />
      </div>
    </form>
  );
}
