import type { Material, ProductType } from "@/generated/prisma";

import { MATERIAL_VALUES } from "@/lib/materials";
import { PRODUCT_TYPE_VALUES } from "@/lib/product-types";

const MATERIAL_SET = new Set<string>(MATERIAL_VALUES);
const PRODUCT_TYPE_SET = new Set<string>(PRODUCT_TYPE_VALUES);

export type ShopSortOrder = "asc" | "desc";

export type ParsedShopFilters = {
  category?: string;
  collection?: string;
  material?: Material;
  productType?: ProductType;
  sort: ShopSortOrder;
};

export type ShopHrefPatch = Partial<{
  category: string | null;
  collection: string | null;
  material: Material | null;
  productType: ProductType | null;
  sort: ShopSortOrder | null;
}>;

function firstString(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export function parseShopSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ParsedShopFilters {
  const category = firstString(raw.category);
  const collection = firstString(raw.collection);
  const materialRaw = firstString(raw.material);
  const typeRaw = firstString(raw.type);
  const sortRaw = firstString(raw.sort);

  const material =
    materialRaw && MATERIAL_SET.has(materialRaw)
      ? (materialRaw as Material)
      : undefined;
  const productType =
    typeRaw && PRODUCT_TYPE_SET.has(typeRaw)
      ? (typeRaw as ProductType)
      : undefined;
  const sort: ShopSortOrder = sortRaw === "desc" ? "desc" : "asc";

  return {
    ...(category ? { category } : {}),
    ...(collection ? { collection } : {}),
    ...(material ? { material } : {}),
    ...(productType ? { productType } : {}),
    sort,
  };
}

export function shopHref(
  current: ParsedShopFilters,
  patch: ShopHrefPatch,
): string {
  let category = current.category;
  let collection = current.collection;
  let material = current.material;
  let productType = current.productType;
  let sort = current.sort;

  if (patch.category !== undefined) {
    category = patch.category === null ? undefined : patch.category;
  }
  if (patch.collection !== undefined) {
    collection = patch.collection === null ? undefined : patch.collection;
  }
  if (patch.material !== undefined) {
    material = patch.material === null ? undefined : patch.material;
  }
  if (patch.productType !== undefined) {
    productType =
      patch.productType === null ? undefined : patch.productType;
  }
  if (patch.sort !== undefined) {
    sort = patch.sort === null ? "asc" : patch.sort;
  }

  const qs = new URLSearchParams();
  if (category) qs.set("category", category);
  if (collection) qs.set("collection", collection);
  if (material) qs.set("material", material);
  if (productType) qs.set("type", productType);
  if (sort === "desc") qs.set("sort", "desc");

  const s = qs.toString();
  return s ? `/shop?${s}` : "/shop";
}
