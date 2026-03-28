"use client";

import type { ReactNode } from "react";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export function CollapsibleFilterBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const uid = useId();
  const panelId = `shop-filter-options-${uid}`;
  const triggerId = `shop-filter-trigger-${uid}`;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 py-1 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
        id={triggerId}
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <nav
          id={panelId}
          className="mt-1.5 flex flex-wrap gap-1.5"
          aria-labelledby={triggerId}
        >
          {children}
        </nav>
      ) : null}
    </div>
  );
}
