"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { X } from "lucide-react";

import { createCollectionAction } from "@/app/admin/collections/new/actions";
import { updateCollectionAction } from "@/app/admin/collections/[id]/actions";
import {
  uploadCollectionImageAction,
  deleteCollectionImageAction,
} from "@/app/admin/collections/actions";
import { slugify } from "@/lib/utils";
import {
  initialCollectionFormState,
  type CollectionFormState,
} from "@/lib/validations/collection";
import { ImageDropzone } from "@/components/admin/image-dropzone";

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

  const [imageUrl, setImageUrl] = useState(state.values.imageUrl || "");
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, startUpload] = useTransition();

  function handleFiles(files: File[]) {
    if (files.length === 0) return;
    setImageError(null);

    const formData = new FormData();
    formData.append("file", files[0]);

    startUpload(async () => {
      const result = await uploadCollectionImageAction(formData);
      if (result.error) {
        setImageError(result.error);
      } else if (result.url) {
        if (imageUrl) {
          deleteCollectionImageAction(imageUrl);
        }
        setImageUrl(result.url);
      }
    });
  }

  function handleRemoveImage() {
    if (imageUrl) {
      deleteCollectionImageAction(imageUrl);
      setImageUrl("");
    }
  }

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {collection && (
        <input type="hidden" name="id" value={collection.id} />
      )}
      <input type="hidden" name="imageUrl" value={imageUrl} />

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

        <div className="space-y-1.5 md:col-span-2">
          <span className="block text-sm font-medium">Collection Image</span>

          {imageUrl ? (
            <div className="relative inline-block overflow-hidden rounded-lg border border-border">
              <div className="relative h-40 w-40">
                <Image
                  src={imageUrl}
                  alt="Collection image"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-1.5 top-1.5 rounded-full bg-red-600 p-1 text-white transition-opacity hover:opacity-90"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <ImageDropzone
              onFiles={handleFiles}
              multiple={false}
              disabled={isUploading}
              label={isUploading ? "Uploading..." : "Drag & drop an image here"}
            />
          )}

          {imageError && (
            <p className="text-sm text-red-600">{imageError}</p>
          )}
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
