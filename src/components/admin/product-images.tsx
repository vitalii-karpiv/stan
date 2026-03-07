"use client";

import Image from "next/image";
import { useState, useTransition, useCallback } from "react";

import {
  addProductImagesAction,
  deleteProductImageAction,
} from "@/app/admin/products/[id]/image-actions";
import { ImageDropzone } from "@/components/admin/image-dropzone";

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFiles = useCallback(
    (files: File[]) => {
      setError(null);
      if (files.length === 0) return;

      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }

      startTransition(async () => {
        const result = await addProductImagesAction(productId, formData);
        if (result.error) {
          setError(result.error);
        }
      });
    },
    [productId],
  );

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

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6">
        <ImageDropzone onFiles={handleFiles} disabled={isPending} />
      </div>
    </div>
  );
}
