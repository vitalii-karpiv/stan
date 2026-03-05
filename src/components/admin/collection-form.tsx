"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createCollectionAction } from "@/app/admin/collections/new/actions";
import { updateCollectionAction } from "@/app/admin/collections/[id]/actions";
import { slugify } from "@/lib/utils";
import {
  initialCollectionFormState,
  type CollectionFormState,
} from "@/lib/validations/collection";

export type CollectionData = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  const label = isEdit
    ? pending
      ? "Saving..."
      : "Save Changes"
    : pending
      ? "Creating..."
      : "Create Collection";

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {label}
    </button>
  );
}

function buildInitialState(
  collection?: CollectionData,
): CollectionFormState {
  if (!collection) return initialCollectionFormState;

  return {
    message: null,
    fieldErrors: {},
    values: {
      name: collection.name,
      slug: collection.slug,
      imageUrl: collection.imageUrl ?? "",
    },
  };
}

export function CollectionForm({
  collection,
}: {
  collection?: CollectionData;
}) {
  const isEdit = Boolean(collection);
  const action = isEdit ? updateCollectionAction : createCollectionAction;
  const [state, formAction] = useActionState(
    action,
    buildInitialState(collection),
  );

  const [slug, setSlug] = useState(state.values.slug);
  const [slugEdited, setSlugEdited] = useState(
    isEdit || Boolean(state.values.slug),
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {collection && (
        <input type="hidden" name="id" value={collection.id} />
      )}

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

        <div className="space-y-1.5">
          <label htmlFor="imageUrl" className="block text-sm font-medium">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={state.values.imageUrl}
            placeholder="https://..."
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.imageUrl && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.imageUrl}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton isEdit={isEdit} />
      </div>
    </form>
  );
}
