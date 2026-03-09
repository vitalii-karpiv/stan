"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitContactAction } from "@/app/(storefront)/contact/actions";
import { initialContactFormState } from "@/lib/validations/contact";

const inputClass =
  "mt-1 w-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-foreground";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Надсилання..." : "Надіслати"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(
    submitContactAction,
    initialContactFormState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.message && (
        <div
          className={`rounded border px-4 py-3 text-sm ${
            state.success
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Ім&apos;я
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={state.values.name}
          className={inputClass}
        />
        {state.fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Номер телефону
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          onKeyDown={(e) => {
            if (
              !/[0-9]/.test(e.key) &&
              !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key) &&
              !(e.metaKey || e.ctrlKey)
            )
              e.preventDefault();
          }}
          defaultValue={state.values.phone}
          className={inputClass}
        />
        {state.fieldErrors.phone && (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Повідомлення
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={state.values.message}
          className={inputClass}
        />
        {state.fieldErrors.message && (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
