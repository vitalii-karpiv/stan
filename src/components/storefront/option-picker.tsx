"use client";

import { useMemo, useState } from "react";

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
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const grouped = useMemo(() => {
    const materials = options
      .filter((o) => o.type === "MATERIAL")
      .map((o) => o.value);
    const sizes = options
      .filter((o) => o.type === "SIZE")
      .map((o) => o.value);
    const gemstones = options
      .filter((o) => o.type === "GEMSTONE")
      .map((o) => o.value);
    return { materials, sizes, gemstones };
  }, [options]);

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGemstone, setSelectedGemstone] = useState<string | null>(null);

  function handleAdd() {
    addItem({
      productId,
      productTitle,
      productSlug,
      imageUrl,
      material: selectedMaterial,
      size: selectedSize,
      gemstone: selectedGemstone,
      price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="space-y-6">
      {grouped.materials.length > 0 && (
        <AttributeGroup
          label="Матеріал"
          options={grouped.materials}
          selected={selectedMaterial}
          onSelect={setSelectedMaterial}
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

      <p className="font-[family-name:var(--font-cormorant)] text-2xl font-light">
        {formatPrice(price)}
      </p>

      <button
        onClick={handleAdd}
        className="w-full bg-accent py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        {added ? "Додано ✓" : "Додати до кошика"}
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
