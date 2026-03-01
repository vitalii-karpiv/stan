"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createProductAction } from "@/app/admin/products/new/actions";
import { slugify } from "@/lib/utils";
import { initialFormState } from "@/lib/validations/product";

type Category = {
  id: string;
  name: string;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Creating..." : "Create Product"}
    </button>
  );
}

export function ProductForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(
    createProductAction,
    initialFormState,
  );

  const defaultCategoryId = categories[0]?.id ?? "";

  const [slug, setSlug] = useState(state.values.slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(state.values.slug));

  const canSubmit = categories.length > 0;

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.message && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={state.values.title}
            onChange={(e) => {
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.title && (
            <p className="text-sm text-red-600">{state.fieldErrors.title}</p>
          )}
        </div>

        {/* Slug */}
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

        {/* Description */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={state.values.description}
            rows={5}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.description && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={state.values.categoryId || defaultCategoryId}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {state.fieldErrors.categoryId && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.categoryId}
            </p>
          )}
        </div>

        {/* Visibility toggles */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Visibility</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="published"
              type="checkbox"
              defaultChecked={state.values.published}
              className="h-4 w-4 rounded border-border"
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={state.values.featured}
              className="h-4 w-4 rounded border-border"
            />
            Featured
          </label>
        </div>
      </div>

      {!canSubmit && (
        <p className="text-sm text-muted-foreground">
          Add at least one category before creating products.
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton disabled={!canSubmit} />
      </div>
    </form>
  );
}
