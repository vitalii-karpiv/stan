"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Settings2 } from "lucide-react";

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
        <Settings2 className="h-4 w-4 shrink-0" aria-hidden />
        <span>Фільтри</span>
      </button>
      {open ? (
        <div
          id="shop-filters-panel"
          role="region"
          aria-labelledby="shop-filters-trigger"
          className="mt-3 space-y-3 border-t border-border pt-3"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
