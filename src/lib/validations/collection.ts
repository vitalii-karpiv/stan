import { z } from "zod";

import { slugify } from "@/lib/utils";

const collectionFields = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  slug: z.string().trim().max(120).optional().or(z.literal("")),
  imageUrl: z
    .string()
    .trim()
    .max(500, "URL is too long")
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

function normalizeCollectionData(
  data: z.output<typeof collectionFields>,
  ctx: z.RefinementCtx,
) {
  const slug = slugify(data.slug || data.name);

  if (!slug) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Slug is required",
      path: ["slug"],
    });
  }

  return {
    ...data,
    slug,
    imageUrl: data.imageUrl || null,
  };
}

export const createCollectionSchema =
  collectionFields.transform(normalizeCollectionData);
export const updateCollectionSchema =
  collectionFields.transform(normalizeCollectionData);

export type CollectionInput = z.input<typeof collectionFields>;

type FieldKey = keyof CollectionInput;

export type CollectionFormValues = {
  name: string;
  slug: string;
  imageUrl: string;
};

export type CollectionFormState = {
  message: string | null;
  fieldErrors: Partial<Record<FieldKey, string>>;
  values: CollectionFormValues;
};

export const initialCollectionFormState: CollectionFormState = {
  message: null,
  fieldErrors: {},
  values: {
    name: "",
    slug: "",
    imageUrl: "",
  },
};
