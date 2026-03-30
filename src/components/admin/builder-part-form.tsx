"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";

import { createBuilderPartAction } from "@/app/admin/builder-parts/new/actions";
import { updateBuilderPartAction } from "@/app/admin/builder-parts/[id]/actions";
import {
  uploadBuilderPartImageAction,
  deleteBuilderPartImageAction,
} from "@/app/admin/builder-parts/actions";
import {
  BUILDER_PART_KIND_LABELS,
  BUILDER_PART_KIND_VALUES,
} from "@/lib/builder-part-kinds";
import type { BuilderPartKind } from "@/generated/prisma";
import {
  initialBuilderPartFormState,
  type BuilderPartFormState,
} from "@/lib/validations/builder-part";
import { ImageDropzone } from "@/components/admin/image-dropzone";

export type BuilderPartData = {
  id: string;
  title: string;
  previewImageUrl: string;
  selectorImageUrl: string;
  price: number | null;
  kind: BuilderPartKind;
  sortOrder: number;
  collectionId: string;
  categoryId: string;
};

type SelectOption = { id: string; name: string };

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  const label = isEdit
    ? pending
      ? "Saving..."
      : "Save"
    : pending
      ? "Creating..."
      : "Create";

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

function buildInitialState(part?: BuilderPartData): BuilderPartFormState {
  if (!part) return initialBuilderPartFormState;

  return {
    message: null,
    fieldErrors: {},
    values: {
      title: part.title,
      previewImageUrl: part.previewImageUrl,
      selectorImageUrl: part.selectorImageUrl,
      price: part.price != null ? String(part.price) : "",
      kind: part.kind,
      sortOrder: part.sortOrder,
      collectionId: part.collectionId,
      categoryId: part.categoryId,
    },
  };
}

export function BuilderPartForm({
  part,
  collections,
  categories,
}: {
  part?: BuilderPartData;
  collections: SelectOption[];
  categories: SelectOption[];
}) {
  const isEdit = Boolean(part);
  const action = isEdit ? updateBuilderPartAction : createBuilderPartAction;
  const [state, formAction] = useActionState(action, buildInitialState(part));

  const [previewUrl, setPreviewUrl] = useState(
    state.values.previewImageUrl || "",
  );
  const [selectorUrl, setSelectorUrl] = useState(
    state.values.selectorImageUrl || "",
  );
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [selectorError, setSelectorError] = useState<string | null>(null);
  const [isUploadingPreview, startUploadPreview] = useTransition();
  const [isUploadingSelector, startUploadSelector] = useTransition();

  function uploadPreview(files: File[]) {
    if (files.length === 0) return;
    setPreviewError(null);
    const formData = new FormData();
    formData.append("file", files[0]);
    startUploadPreview(async () => {
      const result = await uploadBuilderPartImageAction(formData);
      if (result.error) setPreviewError(result.error);
      else if (result.url) {
        if (previewUrl) await deleteBuilderPartImageAction(previewUrl);
        setPreviewUrl(result.url);
      }
    });
  }

  function uploadSelector(files: File[]) {
    if (files.length === 0) return;
    setSelectorError(null);
    const formData = new FormData();
    formData.append("file", files[0]);
    startUploadSelector(async () => {
      const result = await uploadBuilderPartImageAction(formData);
      if (result.error) setSelectorError(result.error);
      else if (result.url) {
        if (selectorUrl) await deleteBuilderPartImageAction(selectorUrl);
        setSelectorUrl(result.url);
      }
    });
  }

  function removePreview() {
    if (previewUrl) {
      deleteBuilderPartImageAction(previewUrl);
      setPreviewUrl("");
    }
  }

  function removeSelector() {
    if (selectorUrl) {
      deleteBuilderPartImageAction(selectorUrl);
      setSelectorUrl("");
    }
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {part && <input type="hidden" name="id" value={part.id} />}
      <input type="hidden" name="previewImageUrl" value={previewUrl} />
      <input type="hidden" name="selectorImageUrl" value={selectorUrl} />

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
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.title && (
            <p className="text-sm text-red-600">{state.fieldErrors.title}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="collectionId" className="block text-sm font-medium">
            Collection
          </label>
          <select
            id="collectionId"
            name="collectionId"
            defaultValue={state.values.collectionId}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          >
            <option value="">Select…</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {state.fieldErrors.collectionId && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.collectionId}
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
            defaultValue={state.values.categoryId}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          >
            <option value="">Select…</option>
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

        <div className="space-y-1.5">
          <label htmlFor="kind" className="block text-sm font-medium">
            Part kind
          </label>
          <select
            id="kind"
            name="kind"
            defaultValue={state.values.kind}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          >
            {BUILDER_PART_KIND_VALUES.map((k) => (
              <option key={k} value={k}>
                {BUILDER_PART_KIND_LABELS[k]}
              </option>
            ))}
          </select>
          {state.fieldErrors.kind && (
            <p className="text-sm text-red-600">{state.fieldErrors.kind}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sortOrder" className="block text-sm font-medium">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={state.values.sortOrder}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          {state.fieldErrors.sortOrder && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.sortOrder}
            </p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="price" className="block text-sm font-medium">
            Price (kopiykas, optional)
          </label>
          <input
            id="price"
            name="price"
            type="text"
            inputMode="numeric"
            placeholder="Leave empty if this part should not change total"
            defaultValue={state.values.price}
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
          <p className="text-xs text-muted-foreground">
            Same unit as catalog products (e.g. 145000 = 1450 ₴). Empty = no
            price impact.
          </p>
          {state.fieldErrors.price && (
            <p className="text-sm text-red-600">{state.fieldErrors.price}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">Preview (result zone)</span>
          {previewUrl ? (
            <div className="relative inline-block overflow-hidden rounded-lg border border-border">
              <div className="relative h-40 w-40">
                <Image
                  src={previewUrl}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={removePreview}
                className="absolute right-1.5 top-1.5 rounded-full bg-red-600 p-1 text-white transition-opacity hover:opacity-90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <ImageDropzone
              onFiles={uploadPreview}
              multiple={false}
              disabled={isUploadingPreview}
              label={
                isUploadingPreview ? "Uploading..." : "Drop preview image"
              }
            />
          )}
          {previewError && (
            <p className="text-sm text-red-600">{previewError}</p>
          )}
          {state.fieldErrors.previewImageUrl && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.previewImageUrl}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium">Selector (grid)</span>
          {selectorUrl ? (
            <div className="relative inline-block overflow-hidden rounded-lg border border-border">
              <div className="relative h-40 w-40">
                <Image
                  src={selectorUrl}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={removeSelector}
                className="absolute right-1.5 top-1.5 rounded-full bg-red-600 p-1 text-white transition-opacity hover:opacity-90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <ImageDropzone
              onFiles={uploadSelector}
              multiple={false}
              disabled={isUploadingSelector}
              label={
                isUploadingSelector ? "Uploading..." : "Drop selector image"
              }
            />
          )}
          {selectorError && (
            <p className="text-sm text-red-600">{selectorError}</p>
          )}
          {state.fieldErrors.selectorImageUrl && (
            <p className="text-sm text-red-600">
              {state.fieldErrors.selectorImageUrl}
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
