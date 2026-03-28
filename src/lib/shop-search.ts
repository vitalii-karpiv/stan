import type { Material, ProductType } from "@/generated/prisma";

import { MATERIAL_VALUES } from "@/lib/materials";
import { PRODUCT_TYPE_VALUES } from "@/lib/product-types";

const MATERIAL_SET = new Set<string>(MATERIAL_VALUES);
const PRODUCT_TYPE_SET = new Set<string>(PRODUCT_TYPE_VALUES);

export type ShopSortOrder = "asc" | "desc";

export type ParsedShopFilters = {
  categories: string[];
  collection?: string;
  materials: Material[];
  productTypes: ProductType[];
  sort: ShopSortOrder;
};

export type ShopHrefPatch = Partial<{
  collection: string | null;
  sort: ShopSortOrder | null;
  categories: string[] | null;
  toggleCategory: string;
  materials: Material[] | null;
  toggleMaterial: Material;
  productTypes: ProductType[] | null;
  toggleProductType: ProductType;
}>;

function allStrings(
  v: string | string[] | undefined,
): string[] {
  if (v === undefined) return [];
  const arr = Array.isArray(v) ? v : [v];
  return [...new Set(arr.filter((s): s is string => typeof s === "string" && s.length > 0))];
}

export function parseShopSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ParsedShopFilters {
  const categorySlugs = allStrings(raw.category);
  const collection = firstString(raw.collection);
  const materialStrs = allStrings(raw.material);
  const typeStrs = allStrings(raw.type);
  const sortRaw = firstString(raw.sort);

  const materials = materialStrs.filter((s): s is Material =>
    MATERIAL_SET.has(s),
  ) as Material[];
  const productTypes = typeStrs.filter((s): s is ProductType =>
    PRODUCT_TYPE_SET.has(s),
  ) as ProductType[];

  const sort: ShopSortOrder = sortRaw === "desc" ? "desc" : "asc";

  return {
    categories: categorySlugs,
    ...(collection ? { collection } : {}),
    materials: [...new Set(materials)],
    productTypes: [...new Set(productTypes)],
    sort,
  };
}

function firstString(
  v: string | string[] | undefined,
): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export function shopHref(
  current: ParsedShopFilters,
  patch: ShopHrefPatch,
): string {
  let categories = [...current.categories];
  let collection = current.collection;
  let materials = [...current.materials];
  let productTypes = [...current.productTypes];
  let sort = current.sort;

  if (patch.collection !== undefined) {
    collection = patch.collection === null ? undefined : patch.collection;
  }
  if (patch.sort !== undefined) {
    sort = patch.sort === null ? "asc" : patch.sort;
  }

  if (patch.categories !== undefined) {
    categories =
      patch.categories === null ? [] : [...new Set(patch.categories)];
  }
  if (patch.toggleCategory !== undefined) {
    const slug = patch.toggleCategory;
    const i = categories.indexOf(slug);
    if (i >= 0) categories.splice(i, 1);
    else categories.push(slug);
  }

  if (patch.materials !== undefined) {
    materials =
      patch.materials === null ? [] : [...new Set(patch.materials)];
  }
  if (patch.toggleMaterial !== undefined) {
    const m = patch.toggleMaterial;
    const i = materials.indexOf(m);
    if (i >= 0) materials.splice(i, 1);
    else materials.push(m);
  }

  if (patch.productTypes !== undefined) {
    productTypes =
      patch.productTypes === null ? [] : [...new Set(patch.productTypes)];
  }
  if (patch.toggleProductType !== undefined) {
    const t = patch.toggleProductType;
    const i = productTypes.indexOf(t);
    if (i >= 0) productTypes.splice(i, 1);
    else productTypes.push(t);
  }

  const qs = new URLSearchParams();
  for (const c of categories) qs.append("category", c);
  if (collection) qs.set("collection", collection);
  for (const m of materials) qs.append("material", m);
  for (const t of productTypes) qs.append("type", t);
  if (sort === "desc") qs.set("sort", "desc");

  const s = qs.toString();
  return s ? `/shop?${s}` : "/shop";
}
