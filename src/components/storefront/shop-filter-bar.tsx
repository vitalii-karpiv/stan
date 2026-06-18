"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { MATERIAL_OPTIONS } from "@/lib/materials";
import { PRODUCT_TYPE_OPTIONS } from "@/lib/product-types";
import { shopHref, type ParsedShopFilters } from "@/lib/shop-search";

type CategoryOption = { id: string; slug: string; name: string };

type ShopFilterBarProps = Readonly<{
  filters: ParsedShopFilters;
  categories: CategoryOption[];
  basePath?: string;
  showProductType?: boolean;
}>;

const DropdownCloseContext = createContext<() => void>(() => {});

export function ShopFilterBar({
  filters,
  categories,
  basePath = "/shop",
  showProductType = Boolean(filters.collection),
}: ShopFilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const filterGroups = (
    <>
      <FilterDropdown label="Вид прикраси">
        {categories.map((c) => (
          <OptionLink
            key={c.id}
            href={shopHref(filters, { toggleCategory: c.slug }, basePath)}
            active={filters.categories.includes(c.slug)}
          >
            {c.name}
          </OptionLink>
        ))}
      </FilterDropdown>

      <FilterDropdown label="Матеріал">
        {MATERIAL_OPTIONS.map((o) => (
          <OptionLink
            key={o.value}
            href={shopHref(filters, { toggleMaterial: o.value }, basePath)}
            active={filters.materials.includes(o.value)}
          >
            {o.label}
          </OptionLink>
        ))}
      </FilterDropdown>

      {showProductType ? (
        <FilterDropdown label="Комплектація">
          {PRODUCT_TYPE_OPTIONS.map((o) => (
            <OptionLink
              key={o.value}
              href={shopHref(filters, { toggleProductType: o.value }, basePath)}
              active={filters.productTypes.includes(o.value)}
            >
              {o.label}
            </OptionLink>
          ))}
        </FilterDropdown>
      ) : null}
    </>
  );

  const sortDropdown = (
    <FilterDropdown
      label={`Сортувати: ${filters.sort === "desc" ? "спочатку дорогі" : "спочатку дешеві"}`}
      align="right"
    >
      <OptionLink
        href={shopHref(filters, { sort: null }, basePath)}
        active={filters.sort === "asc"}
      >
        Спочатку дешеві
      </OptionLink>
      <OptionLink
        href={shopHref(filters, { sort: "desc" }, basePath)}
        active={filters.sort === "desc"}
      >
        Спочатку дорогі
      </OptionLink>
    </FilterDropdown>
  );

  return (
    <div className="mt-6">
      {/* Desktop */}
      <div className="hidden items-center justify-between md:flex">
        <div className="flex items-center gap-6">{filterGroups}</div>
        {sortDropdown}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          aria-expanded={mobileOpen}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden />
          <span>Фільтри</span>
        </button>
        {mobileOpen ? (
          <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
            {filterGroups}
            {sortDropdown}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FilterDropdown({
  label,
  align = "left",
  children,
}: Readonly<{
  label: ReactNode;
  align?: "left" | "right";
  children: ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm text-foreground transition-colors hover:text-muted-foreground"
        aria-expanded={open}
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className={`absolute z-20 mt-2 flex min-w-[12rem] flex-col gap-1 border border-border bg-background p-2 shadow-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <DropdownCloseContext.Provider value={close}>
            {children}
          </DropdownCloseContext.Provider>
        </div>
      ) : null}
    </div>
  );
}

function OptionLink({
  href,
  active,
  children,
}: Readonly<{
  href: string;
  active: boolean;
  children: ReactNode;
}>) {
  const close = useContext(DropdownCloseContext);
  return (
    <Link
      href={href}
      onClick={close}
      scroll={false}
      className={
        active
          ? "block bg-foreground px-2.5 py-1.5 text-xs leading-tight text-background"
          : "block px-2.5 py-1.5 text-xs leading-tight text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}
