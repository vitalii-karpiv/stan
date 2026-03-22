"use client";

import Image from "next/image";
import {
  useState,
  useTransition,
  useCallback,
  useEffect,
  type DragEvent,
} from "react";

import {
  addProductImagesAction,
  deleteProductImageAction,
  reorderProductImagesAction,
} from "@/app/admin/products/[id]/image-actions";
import { ImageDropzone } from "@/components/admin/image-dropzone";

const MAX_TOTAL_UPLOAD_SIZE = 20 * 1024 * 1024; // 20 MB total request size

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

function reorderByIndex<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [moved] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, moved);
  return nextItems;
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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [orderedImages, setOrderedImages] = useState(images);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dropTargetImageId, setDropTargetImageId] = useState<string | null>(null);

  useEffect(() => {
    setOrderedImages(images);
  }, [images]);

  const handleFiles = useCallback(
    (files: File[]) => {
      setError(null);
      if (files.length === 0) return;

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      if (totalSize > MAX_TOTAL_UPLOAD_SIZE) {
        setError("Selected files are too large together. Please upload up to 20 MB at a time.");
        return;
      }

      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }

      startTransition(async () => {
        try {
          const result = await addProductImagesAction(productId, formData);
          if (result.error) {
            setError(result.error);
          }
        } catch {
          setError("Upload failed due to a server error. Please try fewer files.");
        }
      });
    },
    [productId],
  );

  const handleDragStart = useCallback(
    (imageId: string) => {
      if (isPending) return;
      setDraggedImageId(imageId);
      setError(null);
    },
    [isPending],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>, imageId: string) => {
      event.preventDefault();
      if (!draggedImageId || isPending) return;
      setDropTargetImageId(imageId);
    },
    [draggedImageId, isPending],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedImageId(null);
    setDropTargetImageId(null);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>, targetImageId: string) => {
      event.preventDefault();
      if (!draggedImageId || isPending) return;

      const fromIndex = orderedImages.findIndex((image) => image.id === draggedImageId);
      const toIndex = orderedImages.findIndex((image) => image.id === targetImageId);

      setDraggedImageId(null);
      setDropTargetImageId(null);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      const previousImages = orderedImages;
      const reorderedImages = reorderByIndex(orderedImages, fromIndex, toIndex).map(
        (image, index) => ({ ...image, sortOrder: index }),
      );
      setOrderedImages(reorderedImages);
      setError(null);

      startTransition(async () => {
        try {
          const result = await reorderProductImagesAction(
            productId,
            reorderedImages.map((image) => image.id),
          );
          if (result.error) {
            setError(result.error);
            setOrderedImages(previousImages);
          }
        } catch {
          setError("Could not save image order. Please try again.");
          setOrderedImages(previousImages);
        }
      });
    },
    [draggedImageId, isPending, orderedImages, productId],
  );

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold">Images</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload images and drag to reorder. The first image is used as the product thumbnail.
      </p>

      {orderedImages.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderedImages.map((img) => (
            <div
              key={img.id}
              draggable={!isPending}
              onDragStart={() => handleDragStart(img.id)}
              onDragOver={(event) => handleDragOver(event, img.id)}
              onDrop={(event) => handleDrop(event, img.id)}
              onDragEnd={handleDragEnd}
              className={`group relative overflow-hidden rounded-lg border border-border transition-colors ${
                draggedImageId === img.id ? "cursor-grabbing opacity-70" : "cursor-grab"
              } ${dropTargetImageId === img.id ? "border-foreground" : ""}`}
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
