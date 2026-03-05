"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  addVariantAction,
  deleteVariantAction,
} from "@/app/admin/products/[id]/variant-actions";
import { formatPrice } from "@/lib/utils";

type Variant = {
  id: string;
  size: string | null;
  material: string | null;
  gemstone: string | null;
  priceInCents: number;
  stock: number;
  sku: string | null;
};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add Variant"}
    </button>
  );
}

function VariantRow({ variant }: { variant: Variant }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const attrs = [variant.material, variant.size, variant.gemstone]
    .filter(Boolean)
    .join(" / ");

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const result = await deleteVariantAction(variant.id);
    if (result?.error) {
      setError(result.error);
      setDeleting(false);
    }
  }

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/50">
      <td className="px-4 py-3 text-sm">{attrs || "—"}</td>
      <td className="px-4 py-3 text-sm">{formatPrice(variant.priceInCents)}</td>
      <td className="px-4 py-3 text-sm">{variant.stock}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {variant.sku ?? "—"}
      </td>
      <td className="px-4 py-3 text-right">
        {error && (
          <span className="mr-2 text-xs text-red-600">{error}</span>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {deleting ? "..." : "Remove"}
        </button>
      </td>
    </tr>
  );
}

export function ProductVariants({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(formData: FormData) {
    setError(null);
    const result = await addVariantAction(productId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold">Variants</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Each variant defines a purchasable option with its own price and stock.
      </p>

      {variants.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Attributes</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <VariantRow key={v.id} variant={v} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      <form
        ref={formRef}
        action={handleAdd}
        className="mt-6 space-y-4 rounded-lg border border-border p-4"
      >
        <p className="text-sm font-medium">Add new variant</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <label htmlFor="var-material" className="block text-sm font-medium">
              Material
            </label>
            <input
              id="var-material"
              name="material"
              type="text"
              placeholder="e.g. Gold"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="var-size" className="block text-sm font-medium">
              Size
            </label>
            <input
              id="var-size"
              name="size"
              type="text"
              placeholder="e.g. 18cm"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="var-gemstone" className="block text-sm font-medium">
              Gemstone
            </label>
            <input
              id="var-gemstone"
              name="gemstone"
              type="text"
              placeholder="e.g. Ruby"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="var-price"
              className="block text-sm font-medium"
            >
              Price (in kopiykas)
            </label>
            <input
              id="var-price"
              name="priceInCents"
              type="number"
              min="0"
              required
              placeholder="e.g. 250000"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="var-stock" className="block text-sm font-medium">
              Stock
            </label>
            <input
              id="var-stock"
              name="stock"
              type="number"
              min="0"
              defaultValue="0"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="var-sku" className="block text-sm font-medium">
              SKU
            </label>
            <input
              id="var-sku"
              name="sku"
              type="text"
              placeholder="Optional"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>
        </div>

        <AddButton />
      </form>
    </div>
  );
}
