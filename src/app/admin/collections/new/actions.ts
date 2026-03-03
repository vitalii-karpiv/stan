"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  createCollectionSchema,
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
    season: str("season"),
    imageUrl: str("imageUrl"),
  };
}

export async function createCollectionAction(
  _prev: CollectionFormState,
  formData: FormData,
): Promise<CollectionFormState> {
  const values = extractValues(formData);
  const parsed = createCollectionSchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        name: flat.name?.[0],
        slug: flat.slug?.[0],
        season: flat.season?.[0],
        imageUrl: flat.imageUrl?.[0],
      },
      values,
    };
  }

  try {
    await db.collection.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        season: parsed.data.season,
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
      message: "Unable to create collection right now. Please try again.",
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
