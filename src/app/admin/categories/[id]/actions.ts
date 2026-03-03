"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  updateCategorySchema,
  type CategoryFormState,
} from "@/lib/validations/category";

function extractValues(formData: FormData) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    name: str("name"),
    slug: str("slug"),
  };
}

export async function updateCategoryAction(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return {
      message: "Category ID is missing.",
      fieldErrors: {},
      values: extractValues(formData),
    };
  }

  const values = extractValues(formData);
  const parsed = updateCategorySchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        name: flat.name?.[0],
        slug: flat.slug?.[0],
      },
      values,
    };
  }

  try {
    await db.category.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
      },
    });
  } catch (error: unknown) {
    const conflict = getUniqueConflictField(error);
    if (conflict === "name") {
      return {
        message: "A category with this name already exists.",
        fieldErrors: { name: "Name is already taken." },
        values,
      };
    }
    if (conflict === "slug") {
      return {
        message: "A category with this slug already exists.",
        fieldErrors: { slug: "Slug is already taken." },
        values,
      };
    }
    return {
      message: "Unable to update category right now. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

function getUniqueConflictField(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const e = error as { code?: string; meta?: { target?: unknown } };
  if (e.code !== "P2002" || !Array.isArray(e.meta?.target)) return null;
  const target = e.meta!.target as string[];
  if (target.includes("name")) return "name";
  if (target.includes("slug")) return "slug";
  return null;
}
