"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  updateProductSchema,
  type FormState,
} from "@/lib/validations/product";

function extractValues(formData: FormData) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    title: str("title"),
    description: str("description"),
    slug: str("slug"),
    categoryId: str("categoryId"),
    price: str("price"),
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
    collectionIds: formData.getAll("collectionIds").filter((v): v is string => typeof v === "string"),
  };
}

export async function updateProductAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return {
      message: "Product ID is missing.",
      fieldErrors: {},
      values: extractValues(formData),
    };
  }

  const values = extractValues(formData);
  const parsed = updateProductSchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        title: flat.title?.[0],
        description: flat.description?.[0],
        slug: flat.slug?.[0],
        categoryId: flat.categoryId?.[0],
        price: flat.price?.[0],
      },
      values,
    };
  }

  try {
    const category = await db.category.findUnique({
      where: { id: parsed.data.categoryId },
      select: { id: true },
    });

    if (!category) {
      return {
        message: "Please choose a valid category.",
        fieldErrors: { categoryId: "Selected category no longer exists." },
        values,
      };
    }

    await db.$transaction([
      db.product.update({
        where: { id },
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          slug: parsed.data.slug,
          categoryId: parsed.data.categoryId,
          price: parsed.data.price,
          published: parsed.data.published,
          featured: parsed.data.featured,
        },
      }),
      db.productCollection.deleteMany({ where: { productId: id } }),
      ...(parsed.data.collectionIds.length > 0
        ? [
            db.productCollection.createMany({
              data: parsed.data.collectionIds.map((collectionId) => ({
                productId: id,
                collectionId,
              })),
            }),
          ]
        : []),
    ]);
  } catch (error: unknown) {
    if (isSlugConflict(error)) {
      return {
        message: "A product with this slug already exists.",
        fieldErrors: { slug: "Slug is already taken." },
        values,
      };
    }
    return {
      message: "Unable to update product right now. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

function isSlugConflict(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { code?: string; meta?: { target?: unknown } };
  return (
    e.code === "P2002" &&
    Array.isArray(e.meta?.target) &&
    e.meta!.target.includes("slug")
  );
}
