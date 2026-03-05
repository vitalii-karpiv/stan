"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

type DeleteButtonProps = {
  action: () => Promise<{ error: string | null }>;
  confirmMessage?: string;
  disabled?: boolean;
};

export function DeleteButton({
  action,
  confirmMessage = "Are you sure? This action cannot be undone.",
  disabled,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (pending) return;
    setOpen(false);
    setError(null);
  }, [pending]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function onCancel(e: Event) {
      if (pending) e.preventDefault();
      else handleClose();
    }
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [pending, handleClose]);

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled || pending}
        className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        className="fixed inset-0 m-auto w-full max-w-sm rounded-lg border border-border bg-background p-0 shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold">Confirm deletion</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {confirmMessage}
          </p>

          {error && (
            <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={pending}
              className="rounded border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pending}
              className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {pending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
