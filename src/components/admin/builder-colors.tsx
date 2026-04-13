"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  addBuilderColorAction,
  deleteBuilderColorAction,
} from "@/app/admin/collections/[id]/builder-color-actions";

type BuilderColorItem = {
  id: string;
  value: string;
};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Adding..." : "Add Color"}
    </button>
  );
}

function ColorRow({ color }: { color: BuilderColorItem }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteBuilderColorAction(color.id);
  }

  return (
    <tr className="border-b border-border last:border-b-0 hover:bg-muted/50">
      <td className="px-4 py-3 text-sm">{color.value}</td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
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

export function BuilderColors({
  collectionId,
  colors,
}: {
  collectionId: string;
  colors: BuilderColorItem[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(formData: FormData) {
    setError(null);
    const result = await addBuilderColorAction(collectionId, formData);
    if (result.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold">Builder Colors</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Configure available colors for builder assemblies in this collection.
      </p>

      {colors.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Color</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((c) => (
                <ColorRow key={c.id} color={c} />
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
        <p className="text-sm font-medium">Add new color</p>

        <div className="max-w-sm space-y-1.5">
          <label htmlFor="color-value" className="block text-sm font-medium">
            Color name
          </label>
          <input
            id="color-value"
            name="value"
            type="text"
            required
            placeholder="e.g. Золото, Срібло"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          />
        </div>

        <AddButton />
      </form>
    </div>
  );
}
