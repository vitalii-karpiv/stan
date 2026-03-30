"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import {
  createBuilderPartSchema,
  type BuilderPartFormState,
} from "@/lib/validations/builder-part";

function extractValues(formData: FormData) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    title: str("title"),
    previewImageUrl: str("previewImageUrl"),
    selectorImageUrl: str("selectorImageUrl"),
    price: str("price"),
    kind: str("kind"),
    sortOrder: Number(str("sortOrder")) || 0,
    collectionId: str("collectionId"),
    categoryId: str("categoryId"),
  };
}

export async function createBuilderPartAction(
  _prev: BuilderPartFormState,
  formData: FormData,
): Promise<BuilderPartFormState> {
  await requireAdmin();
  const values = extractValues(formData);
  const parsed = createBuilderPartSchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        title: flat.title?.[0],
        previewImageUrl: flat.previewImageUrl?.[0],
        selectorImageUrl: flat.selectorImageUrl?.[0],
        price: flat.price?.[0],
        kind: flat.kind?.[0],
        sortOrder: flat.sortOrder?.[0],
        collectionId: flat.collectionId?.[0],
        categoryId: flat.categoryId?.[0],
      },
      values,
    };
  }

  const [collection, category] = await Promise.all([
    db.collection.findUnique({
      where: { id: parsed.data.collectionId },
      select: { id: true },
    }),
    db.category.findUnique({
      where: { id: parsed.data.categoryId },
      select: { id: true },
    }),
  ]);

  if (!collection) {
    return {
      message: "Invalid collection.",
      fieldErrors: { collectionId: "Selected collection no longer exists." },
      values,
    };
  }

  if (!category) {
    return {
      message: "Invalid category.",
      fieldErrors: { categoryId: "Selected category no longer exists." },
      values,
    };
  }

  try {
    await db.builderPart.create({
      data: {
        title: parsed.data.title,
        previewImageUrl: parsed.data.previewImageUrl,
        selectorImageUrl: parsed.data.selectorImageUrl,
        price: parsed.data.price,
        kind: parsed.data.kind,
        sortOrder: parsed.data.sortOrder,
        collectionId: parsed.data.collectionId,
        categoryId: parsed.data.categoryId,
      },
    });
  } catch {
    return {
      message: "Could not create builder part. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin/builder-parts");
  redirect("/admin/builder-parts");
}
