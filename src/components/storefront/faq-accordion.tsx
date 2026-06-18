"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";
import { Plus, Minus } from "lucide-react";

type FaqItem = {
  question: string;
  answer: ReactNode;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const uid = useId();

  return (
    <div className="divide-y divide-brand/25 border-t border-brand/25">
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `faq-panel-${uid}-${index}`;
        const triggerId = `faq-trigger-${uid}-${index}`;

        return (
          <div key={item.question}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex((current) => (current === index ? null : index))}
              className="flex w-full items-center justify-between gap-4 py-6 text-left text-brand transition-colors hover:opacity-80"
            >
              <span className="font-[family-name:var(--font-display)] text-sm font-normal uppercase tracking-wide sm:text-base">
                {item.question}
              </span>
              {open ? (
                <Minus className="h-5 w-5 shrink-0" aria-hidden />
              ) : (
                <Plus className="h-5 w-5 shrink-0" aria-hidden />
              )}
            </button>
            {open ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="max-w-3xl space-y-4 pb-6 leading-relaxed text-muted-foreground"
              >
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
