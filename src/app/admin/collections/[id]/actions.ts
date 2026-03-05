"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  updateCollectionSchema,
  type CollectionFormState,
} from "@/lib/validations/collection";

function extractValues(formData: FormData) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    name: str("name"),
    slug: str("slug"),
    imageUrl: str("imageUrl"),
  };
}

export async function updateCollectionAction(
  _prev: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return {
      message: "Collection ID is missing.",
      fieldErrors: {},
      values: extractValues(formData),
    };
  }

  const values = extractValues(formData);
  const parsed = updateCollectionSchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        name: flat.name?.[0],
        slug: flat.slug?.[0],
        imageUrl: flat.imageUrl?.[0],
      },
      values,
    };
  }

  try {
    await db.collection.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        imageUrl: parsed.data.imageUrl,
      },
    });
  } catch (error: unknown) {
    const conflict = getUniqueConflictField(error);
    if (conflict === "name") {
      return {
        message: "A collection with this name already exists.",
        fieldErrors: { name: "Name is already taken." },
        values,
      };
    }
    if (conflict === "slug") {
      return {
        message: "A collection with this slug already exists.",
        fieldErrors: { slug: "Slug is already taken." },
        values,
      };
    }
    return {
      message: "Unable to update collection right now. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin/collections");
  redirect("/admin/collections");
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
