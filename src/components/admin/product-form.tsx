"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createProductAction } from "@/app/admin/products/new/actions";
import { updateProductAction } from "@/app/admin/products/[id]/actions";
import { slugify } from "@/lib/utils";
import { initialFormState, type FormState } from "@/lib/validations/product";

type Category = {
  id: string;
  name: string;
};

export type ProductData = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  categoryId: string;
  published: boolean;
  featured: boolean;
};

function SubmitButton({
  disabled,
  isEdit,
}: {
  disabled: boolean;
  isEdit: boolean;
}) {
  const { pending } = useFormStatus();

  const label = isEdit
    ? pending
      ? "Saving..."
      : "Save Changes"
    : pending
      ? "Creating..."
      : "Create Product";

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function buildInitialState(product?: ProductData): FormState {
  if (!product) return initialFormState;

  return {
    message: null,
    fieldErrors: {},
    values: {
      title: product.title,
      description: product.description ?? "",
      slug: product.slug,
      categoryId: product.categoryId,
      published: product.published,
      featured: product.featured,
    },
  };
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductData;
}) {
  const isEdit = Boolean(product);
  const action = isEdit ? updateProductAction : createProductAction;
  const [state, formAction] = useActionState(
    action,
    buildInitialState(product),
  );

  const defaultCategoryId = categories[0]?.id ?? "";

  const [slug, setSlug] = useState(state.values.slug);
  const [slugEdited, setSlugEdited] = useState(isEdit || Boolean(state.values.slug));

  const canSubmit = categories.length > 0;

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {state.message && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
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
        <SubmitButton disabled={!canSubmit} isEdit={isEdit} />
      </div>
    </form>
  );
}
