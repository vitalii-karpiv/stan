"use client";

import Image from "next/image";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  addProductImageAction,
  deleteProductImageAction,
} from "@/app/admin/products/[id]/image-actions";

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add Image"}
    </button>
  );
}

function DeleteButton({ imageId }: { imageId: string }) {
  return (
    <form action={() => deleteProductImageAction(imageId)}>
      <button
        type="submit"
        className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90"
      >
        Remove
      </button>
    </form>
  );
}

export function ProductImages({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAdd(formData: FormData) {
    const result = await addProductImageAction(productId, formData);
    if (!result.error) {
      formRef.current?.reset();
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold">Images</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload images. The first image is used as the product thumbnail.
      </p>

      {images.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              <div className="relative aspect-square">
                <Image
                  src={img.url}
                  alt={img.alt ?? "Product image"}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-xs text-muted-foreground">
                  {img.alt || "No alt text"}
                </span>
                <DeleteButton imageId={img.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      <form
        ref={formRef}
        action={handleAdd}
        className="mt-6 flex flex-wrap items-end gap-3"
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor="image-file" className="block text-sm font-medium">
            Image File
          </label>
          <input
            id="image-file"
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-foreground file:px-3 file:py-1 file:text-sm file:font-medium file:text-background"
          />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor="image-alt" className="block text-sm font-medium">
            Alt Text
          </label>
          <input
            id="image-alt"
            name="alt"
            type="text"
            placeholder="Describe the image"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>
        <AddButton />
      </form>
    </div>
  );
}
