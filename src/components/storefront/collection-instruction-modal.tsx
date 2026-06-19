"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

import { getCollectionInstruction } from "@/lib/collection-instructions";

import { InstructionContent } from "./instruction-content";
import { Button, ButtonLink } from "./button";

type CollectionInstructionModalProps = Readonly<{
  slug: string;
  name: string;
  onClose: () => void;
  /** When set, the primary CTA runs this instead of navigating to /builder
   *  (used when the modal is already opened on the builder route). */
  onPrimaryAction?: () => void;
}>;

export function CollectionInstructionModal({
  slug,
  name,
  onClose,
  onPrimaryAction,
}: CollectionInstructionModalProps) {
  const instruction = getCollectionInstruction(slug);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative mx-auto my-8 w-full max-w-2xl rounded-xl bg-background p-6 sm:p-8 md:max-w-5xl lg:max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute right-4 top-4 text-brand transition-opacity hover:opacity-70"
        >
          <X className="h-6 w-6" aria-hidden />
        </button>

        <h2 className="text-center font-[family-name:var(--font-display)] text-2xl font-[750] uppercase tracking-tight text-brand md:text-3xl">
          {name}
        </h2>

        <div className="mt-8">
          {instruction ? (
            <InstructionContent
              instruction={instruction}
              onPrimaryAction={onPrimaryAction}
            />
          ) : (
            <div className="flex flex-col items-center gap-6">
              <p className="text-center text-sm text-brand/80">
                Інструкція скоро зʼявиться.
              </p>
              {onPrimaryAction ? (
                <Button onClick={onPrimaryAction}>
                  Створити в конструкторі
                </Button>
              ) : (
                <ButtonLink href="/builder">Створити в конструкторі</ButtonLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
