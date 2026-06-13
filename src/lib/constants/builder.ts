import type { BuilderPartKind } from "@/generated/prisma";

/** Slug of the hidden Product used as OrderItem anchor for builder assemblies. */
export const BUILDER_ASSEMBLY_SLUG = "builder-assembly";

export const MAX_BUILDER_LEFT_INSTANCES = 3;
export const MAX_BUILDER_RIGHT_INSTANCES = 3;

/** Metal furniture colour choices offered in the builder. */
export const BUILDER_METAL_COLORS = ["Срібний", "Золотий"] as const;

/** Standard length note shown under the builder, mirrors the product page copy. */
export const BUILDER_LENGTH_NOTE =
  "38 см (стандартно). Якщо необхідна індивідуальна довжина - напиши про це у рядку «Коментар» при оформленні замовлення. Можлива доплата, якщо довжина буде більше стандартної.";

/** Public assets shown in the result zone when a slot has no selected part yet. */
export const BUILDER_DEFAULT_PREVIEW_BY_KIND: Record<BuilderPartKind, string> =
  {
    LEFT_HALF: "/left_side.png",
    PENDANT: "/pedant.png",
    RIGHT_HALF: "/right_side.png",
  };

/**
 * Pixel size of default preview PNGs under /public — keeps layout aspect ratios
 * aligned with the art so left/right meet at the bottom seam and scale together.
 */
export const BUILDER_PREVIEW_INTRINSIC = {
  LEFT_HALF: { width: 1761, height: 4505 },
  RIGHT_HALF: { width: 1782, height: 5708 },
  PENDANT: { width: 296, height: 280 },
} as const;
