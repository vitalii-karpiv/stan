import { z } from "zod";

const urlRequired = z
  .string()
  .trim()
  .min(1, "URL is required")
  .max(2000, "URL is too long")
  .url("Must be a valid URL");

const builderPartFields = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  previewImageUrl: urlRequired,
  selectorImageUrl: urlRequired,
  price: z
    .string()
    .trim()
    .refine((s) => s === "" || /^\d+$/.test(s), "Use whole kopiykas or leave empty")
    .transform((s) => (s === "" ? null : parseInt(s, 10))),
  kind: z.enum(["LEFT_HALF", "RIGHT_HALF", "PENDANT"]),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  collectionId: z.string().trim().min(1, "Collection is required"),
  categoryId: z.string().trim().min(1, "Category is required"),
});

export const createBuilderPartSchema = builderPartFields;

export const updateBuilderPartSchema = builderPartFields.extend({
  id: z.string().trim().min(1),
});

export type BuilderPartFormValues = {
  title: string;
  previewImageUrl: string;
  selectorImageUrl: string;
  price: string;
  kind: string;
  sortOrder: number;
  collectionId: string;
  categoryId: string;
};

type FieldKey = keyof BuilderPartFormValues;

export type BuilderPartFormState = {
  message: string | null;
  fieldErrors: Partial<Record<FieldKey, string>>;
  values: BuilderPartFormValues;
};

export const initialBuilderPartFormState: BuilderPartFormState = {
  message: null,
  fieldErrors: {},
  values: {
    title: "",
    previewImageUrl: "",
    selectorImageUrl: "",
    price: "",
    kind: "LEFT_HALF",
    sortOrder: 0,
    collectionId: "",
    categoryId: "",
  },
};
