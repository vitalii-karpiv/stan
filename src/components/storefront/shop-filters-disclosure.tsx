"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function ShopFiltersDisclosure({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
        aria-expanded={open}
        id="shop-filters-trigger"
      >
        <span>Фільтри</span>
        {open ? (
          <Minus className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <Plus className="h-4 w-4 shrink-0" aria-hidden />
        )}
      </button>
      {open ? (
        <div
          id="shop-filters-panel"
          role="region"
          aria-labelledby="shop-filters-trigger"
          className="mt-4 space-y-5 border-t border-border pt-4"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
