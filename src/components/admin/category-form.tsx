"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createCategoryAction } from "@/app/admin/categories/new/actions";
import { slugify } from "@/lib/utils";
import { initialCategoryFormState } from "@/lib/validations/category";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Creating..." : "Create Category"}
    </button>
  );
}

export function CategoryForm() {
  const [state, formAction] = useActionState(
    createCategoryAction,
    initialCategoryFormState,
  );

  const [slug, setSlug] = useState(state.values.slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(state.values.slug));

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.message && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={state.values.name}
            onChange={(e) => {
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.name && (
            <p className="text-sm text-red-600">{state.fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.slug && (
            <p className="text-sm text-red-600">{state.fieldErrors.slug}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton />
      </div>
    </form>
  );
}
