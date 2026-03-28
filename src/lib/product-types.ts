import type { ProductType } from "@/generated/prisma";

/** Prisma enum order + Ukrainian labels (match schema @map). */
export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "HALVES", label: "Половинки" },
  { value: "READY_COMBINATIONS", label: "Готові поєднання" },
  { value: "CAPSULES", label: "Капсули" },
];

export const PRODUCT_TYPE_VALUES = PRODUCT_TYPE_OPTIONS.map(
  (o) => o.value,
) as [ProductType, ...ProductType[]];
