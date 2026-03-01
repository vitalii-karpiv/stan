import { z } from "zod";

import { slugify } from "@/lib/utils";

export const createProductSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    description: z
      .string()
      .trim()
      .max(5000, "Description is too long")
      .optional()
      .or(z.literal("")),
    slug: z.string().trim().max(160).optional().or(z.literal("")),
    categoryId: z.string().trim().min(1, "Category is required"),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
  })
  .transform((data, ctx) => {
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
  });

export type CreateProductInput = z.input<typeof createProductSchema>;

type FieldKey = keyof CreateProductInput;

export type FormValues = {
  title: string;
  description: string;
  slug: string;
  categoryId: string;
  published: boolean;
  featured: boolean;
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
    published: false,
    featured: false,
  },
};
