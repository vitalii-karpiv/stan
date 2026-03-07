"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  addOptionAction,
  deleteOptionAction,
} from "@/app/admin/products/[id]/option-actions";

type Option = {
  id: string;
  type: string;
  value: string;
};

const TYPE_LABELS: Record<string, string> = {
  SIZE: "Size",
  MATERIAL: "Material",
  GEMSTONE: "Gemstone",
};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add Option"}
    </button>
  );
}

function OptionRow({ option }: { option: Option }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteOptionAction(option.id);
  }

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/50">
      <td className="px-4 py-3 text-sm">
        {TYPE_LABELS[option.type] ?? option.type}
      </td>
      <td className="px-4 py-3 text-sm">{option.value}</td>
      <td className="px-4 py-3 text-right">
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

export function ProductOptions({
  productId,
  options,
}: {
  productId: string;
  options: Option[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(formData: FormData) {
    setError(null);
    const result = await addOptionAction(productId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold">Options</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Configure available sizes, materials, and gemstones independently.
      </p>

      {options.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {options.map((o) => (
                <OptionRow key={o.id} option={o} />
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
        <p className="text-sm font-medium">Add new option</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="opt-type" className="block text-sm font-medium">
              Type
            </label>
            <select
              id="opt-type"
              name="type"
              required
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            >
              <option value="">Select type...</option>
              <option value="SIZE">Size</option>
              <option value="MATERIAL">Material</option>
              <option value="GEMSTONE">Gemstone</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="opt-value" className="block text-sm font-medium">
              Value
            </label>
            <input
              id="opt-value"
              name="value"
              type="text"
              required
              placeholder="e.g. Gold, 18cm, Ruby"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
            />
          </div>
        </div>

        <AddButton />
      </form>
    </div>
  );
}
