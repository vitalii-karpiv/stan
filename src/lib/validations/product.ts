import { z } from "zod";

import { slugify } from "@/lib/utils";

const productFields = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z
    .string()
    .trim()
    .max(5000, "Description is too long")
    .optional()
    .or(z.literal("")),
  slug: z.string().trim().max(160).optional().or(z.literal("")),
  categoryId: z.string().trim().min(1, "Category is required"),
  price: z.coerce.number().int().min(0, "Price must be a positive number"),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  collectionIds: z.array(z.string()).default([]),
});

function normalizeProductData(
  data: z.output<typeof productFields>,
  ctx: z.RefinementCtx,
) {
  const slug = slugify(data.slug || data.title);

  if (!slug) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Slug is required",
      path: ["slug"],
    });
  }

  return {
    ...data,
    description: data.description || null,
    slug,
  };
}

export const createProductSchema = productFields.transform(normalizeProductData);
export const updateProductSchema = productFields.transform(normalizeProductData);

export type ProductInput = z.input<typeof productFields>;

type FieldKey = keyof ProductInput | "collectionIds";

export type FormValues = {
  title: string;
  description: string;
  slug: string;
  categoryId: string;
  price: number;
  published: boolean;
  featured: boolean;
  collectionIds: string[];
};

export type FormState = {
  message: string | null;
  fieldErrors: Partial<Record<FieldKey, string>>;
  values: FormValues;
};

export const initialFormState: FormState = {
  message: null,
  fieldErrors: {},
  values: {
    title: "",
    description: "",
    slug: "",
    categoryId: "",
    price: 0,
    published: false,
    featured: false,
    collectionIds: [],
  },
};
