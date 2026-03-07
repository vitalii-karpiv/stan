"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createUserAction } from "@/app/admin/users/new/actions";
import {
  initialUserFormState,
} from "@/lib/validations/user";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Creating..." : "Create User"}
    </button>
  );
}

export function UserForm() {
  const [state, formAction] = useActionState(
    createUserAction,
    initialUserFormState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.message && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={state.values.name}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.name && (
            <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={state.values.email}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.email && (
            <p className="text-sm text-red-600">{state.fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue={state.values.password}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.password && (
            <p className="text-sm text-red-600">{state.fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={state.values.phone}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.phone && (
            <p className="text-sm text-red-600">{state.fieldErrors.phone}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="role" className="block text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            defaultValue={state.values.role}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          >
            <option value="ADMIN">Admin</option>
            <option value="CUSTOMER">Customer</option>
          </select>
          {state.fieldErrors.role && (
            <p className="text-sm text-red-600">{state.fieldErrors.role}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
      </div>
    </form>
  );
}
