import { z } from "zod";

import { slugify } from "@/lib/utils";

export const createCategorySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    slug: z.string().trim().max(120).optional().or(z.literal("")),
  })
  .transform((data, ctx) => {
    const slug = slugify(data.slug || data.name);

    if (!slug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Slug is required",
        path: ["slug"],
      });
    }

    return { ...data, slug };
  });

export type CreateCategoryInput = z.input<typeof createCategorySchema>;

type FieldKey = keyof CreateCategoryInput;

export type CategoryFormValues = {
  name: string;
  slug: string;
};

export type CategoryFormState = {
  message: string | null;
  fieldErrors: Partial<Record<FieldKey, string>>;
  values: CategoryFormValues;
};

export const initialCategoryFormState: CategoryFormState = {
  message: null,
  fieldErrors: {},
  values: {
    name: "",
    slug: "",
  },
};
