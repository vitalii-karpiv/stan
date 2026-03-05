"use client";

import { useMemo, useState } from "react";

import { formatPrice } from "@/lib/utils";

type Variant = {
  id: string;
  size: string | null;
  material: string | null;
  gemstone: string | null;
  priceInCents: number;
  stock: number;
};

type VariantPickerProps = {
  variants: Variant[];
};

function uniqueNonNull(values: (string | null)[]): string[] {
  return [...new Set(values.filter((v): v is string => v != null))];
}

export function VariantPicker({ variants }: VariantPickerProps) {
  const dimensions = useMemo(() => {
    const materials = uniqueNonNull(variants.map((v) => v.material));
    const sizes = uniqueNonNull(variants.map((v) => v.size));
    const gemstones = uniqueNonNull(variants.map((v) => v.gemstone));
    return {
      materials: materials.length > 1 ? materials : [],
      sizes: sizes.length > 1 ? sizes : [],
      gemstones: gemstones.length > 1 ? gemstones : [],
    };
  }, [variants]);

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGemstone, setSelectedGemstone] = useState<string | null>(null);

  const matchedVariant = useMemo(() => {
    const candidates = variants.filter((v) => {
      if (selectedMaterial && v.material !== selectedMaterial) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      if (selectedGemstone && v.gemstone !== selectedGemstone) return false;
      return true;
    });
    return candidates[0] ?? variants[0];
  }, [variants, selectedMaterial, selectedSize, selectedGemstone]);

  const inStock = matchedVariant.stock > 0;

  return (
    <div className="space-y-6">
      {dimensions.materials.length > 0 && (
        <AttributeGroup
          label="Матеріал"
          options={dimensions.materials}
          selected={selectedMaterial}
          onSelect={setSelectedMaterial}
        />
      )}

      {dimensions.sizes.length > 0 && (
        <AttributeGroup
          label="Розмір"
          options={dimensions.sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      {dimensions.gemstones.length > 0 && (
        <AttributeGroup
          label="Камінь"
          options={dimensions.gemstones}
          selected={selectedGemstone}
          onSelect={setSelectedGemstone}
        />
      )}

      <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
        {formatPrice(matchedVariant.priceInCents)}
      </p>

      <p className={`text-sm ${inStock ? "text-green-700" : "text-destructive"}`}>
        {inStock ? "В наявності" : "Немає в наявності"}
      </p>

      <button
        disabled={!inStock}
        className="w-full bg-accent py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Додати до кошика
      </button>
    </div>
  );
}

function AttributeGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selected === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(isActive ? null : option)}
              className={`border px-4 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-foreground bg-foreground text-background"
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
