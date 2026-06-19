"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

type ProductOption = {
  id: string;
  type: string;
  value: string;
};

type OptionPickerProps = {
  productId: string;
  productTitle: string;
  productSlug: string;
  imageUrl: string | null;
  price: number;
  options: ProductOption[];
};

export function OptionPicker({
  productId,
  productTitle,
  productSlug,
  imageUrl,
  price,
  options,
}: OptionPickerProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const grouped = useMemo(() => {
    const materials = options
      .filter((o) => o.type === "COLOR")
      .map((o) => o.value);
    const sizes = options
      .filter((o) => o.type === "SIZE")
      .map((o) => o.value);
    const gemstones = options
      .filter((o) => o.type === "GEMSTONE")
      .map((o) => o.value);
    const pendants = options
      .filter((o) => o.type === "PENDANT")
      .map((o) => o.value);
    return { materials, sizes, gemstones, pendants };
  }, [options]);

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGemstone, setSelectedGemstone] = useState<string | null>(null);
  const [selectedPendant, setSelectedPendant] = useState<string | null>(null);

  const [highlightMaterial, setHighlightMaterial] = useState(false);
  const [highlightPendant, setHighlightPendant] = useState(false);
  const materialRef = useRef<HTMLDivElement | null>(null);
  const pendantRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightMaterial) return;
    const t = setTimeout(() => setHighlightMaterial(false), 1600);
    return () => clearTimeout(t);
  }, [highlightMaterial]);

  useEffect(() => {
    if (!highlightPendant) return;
    const t = setTimeout(() => setHighlightPendant(false), 1600);
    return () => clearTimeout(t);
  }, [highlightPendant]);

  function handleAdd() {
    const materialMissing = grouped.materials.length > 0 && !selectedMaterial;
    const pendantMissing = grouped.pendants.length > 0 && !selectedPendant;

    if (materialMissing || pendantMissing) {
      setHighlightMaterial(materialMissing);
      setHighlightPendant(pendantMissing);
      // Scroll to the first missing selection.
      const target = materialMissing ? materialRef : pendantRef;
      target.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    addItem({
      productId,
      productTitle,
      productSlug,
      imageUrl,
      material: selectedMaterial,
      size: selectedSize,
      gemstone: selectedGemstone,
      pendant: selectedPendant,
      price,
    });
    router.push("/shop");
  }

  return (
    <div className="space-y-6">
      {grouped.materials.length > 0 && (
        <AttributeGroup
          label="Колір"
          options={grouped.materials}
          selected={selectedMaterial}
          onSelect={(value) => {
            setSelectedMaterial(value);
            setHighlightMaterial(false);
          }}
          containerRef={materialRef}
          highlight={highlightMaterial}
        />
      )}

      {grouped.sizes.length > 0 && (
        <AttributeGroup
          label="Розмір"
          options={grouped.sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      {grouped.gemstones.length > 0 && (
        <AttributeGroup
          label="Камінь"
          options={grouped.gemstones}
          selected={selectedGemstone}
          onSelect={setSelectedGemstone}
        />
      )}

      {grouped.pendants.length > 0 && (
        <PendantGroup
          label="Підвіска"
          options={grouped.pendants}
          selected={selectedPendant}
          onSelect={(value) => {
            setSelectedPendant(value);
            setHighlightPendant(false);
          }}
          containerRef={pendantRef}
          highlight={highlightPendant}
        />
      )}

      <p className="font-[family-name:var(--font-display)] text-xl font-medium uppercase text-brand">
        {formatPrice(price)}
      </p>

      <button
        onClick={handleAdd}
        className="w-full rounded-xl bg-accent py-3.5 font-[family-name:var(--font-display)] text-base font-extrabold text-accent-foreground transition-opacity hover:opacity-90"
      >
        Додати в кошик
      </button>
    </div>
  );
}

function PendantGroup({
  label,
  options,
  selected,
  onSelect,
  containerRef,
  highlight = false,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  containerRef?: React.Ref<HTMLDivElement>;
  highlight?: boolean;
}) {
  return (
    <div
      ref={containerRef}
      className={`scroll-mt-24 rounded-md p-2 transition-all ${
        highlight
          ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
          : "ring-0"
      }`}
    >
      <p className="mb-2 text-base font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(isActive ? null : option)}
              className={`relative h-14 w-14 overflow-hidden rounded-md border transition-colors ${
                isActive
                  ? "border-foreground ring-1 ring-foreground"
                  : "border-border hover:border-foreground"
              }`}
              aria-label="Обрати підвіску"
            >
              <Image
                src={option}
                alt="Варіант підвіски"
                fill
                sizes="56px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AttributeGroup({
  label,
  options,
  selected,
  onSelect,
  containerRef,
  highlight = false,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  containerRef?: React.Ref<HTMLDivElement>;
  highlight?: boolean;
}) {
  return (
    <div
      ref={containerRef}
      className={`scroll-mt-24 rounded-md p-2 transition-all ${
        highlight
          ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
          : "ring-0"
      }`}
    >
      <p className="mb-2 text-base font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(isActive ? null : option)}
              className={`rounded-md border px-4 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-foreground bg-muted text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
