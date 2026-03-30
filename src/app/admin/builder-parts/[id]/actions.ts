"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { deleteBuilderPartImageAction } from "@/app/admin/builder-parts/actions";
import {
  updateBuilderPartSchema,
  type BuilderPartFormState,
} from "@/lib/validations/builder-part";

function extractValues(formData: FormData) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    id: str("id"),
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

export async function updateBuilderPartAction(
  _prev: BuilderPartFormState,
  formData: FormData,
): Promise<BuilderPartFormState> {
  await requireAdmin();
  const values = extractValues(formData);
  const parsed = updateBuilderPartSchema.safeParse(values);

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
      values: {
        title: values.title,
        previewImageUrl: values.previewImageUrl,
        selectorImageUrl: values.selectorImageUrl,
        price: values.price,
        kind: values.kind,
        sortOrder: values.sortOrder,
        collectionId: values.collectionId,
        categoryId: values.categoryId,
      },
    };
  }

  const existing = await db.builderPart.findUnique({
    where: { id: parsed.data.id },
    select: {
      previewImageUrl: true,
      selectorImageUrl: true,
    },
  });

  if (!existing) {
    return {
      message: "Part not found.",
      fieldErrors: {},
      values: {
        title: values.title,
        previewImageUrl: values.previewImageUrl,
        selectorImageUrl: values.selectorImageUrl,
        price: values.price,
        kind: values.kind,
        sortOrder: values.sortOrder,
        collectionId: values.collectionId,
        categoryId: values.categoryId,
      },
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
      values: {
        title: values.title,
        previewImageUrl: values.previewImageUrl,
        selectorImageUrl: values.selectorImageUrl,
        price: values.price,
        kind: values.kind,
        sortOrder: values.sortOrder,
        collectionId: values.collectionId,
        categoryId: values.categoryId,
      },
    };
  }

  if (!category) {
    return {
      message: "Invalid category.",
      fieldErrors: { categoryId: "Selected category no longer exists." },
      values: {
        title: values.title,
        previewImageUrl: values.previewImageUrl,
        selectorImageUrl: values.selectorImageUrl,
        price: values.price,
        kind: values.kind,
        sortOrder: values.sortOrder,
        collectionId: values.collectionId,
        categoryId: values.categoryId,
      },
    };
  }

  if (parsed.data.previewImageUrl !== existing.previewImageUrl) {
    await deleteBuilderPartImageAction(existing.previewImageUrl);
  }
  if (parsed.data.selectorImageUrl !== existing.selectorImageUrl) {
    await deleteBuilderPartImageAction(existing.selectorImageUrl);
  }

  try {
    await db.builderPart.update({
      where: { id: parsed.data.id },
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
      message: "Could not update builder part. Please try again.",
      fieldErrors: {},
      values: {
        title: values.title,
        previewImageUrl: values.previewImageUrl,
        selectorImageUrl: values.selectorImageUrl,
        price: values.price,
        kind: values.kind,
        sortOrder: values.sortOrder,
        collectionId: values.collectionId,
        categoryId: values.categoryId,
      },
    };
  }

  revalidatePath("/admin/builder-parts");
  revalidatePath(`/admin/builder-parts/${parsed.data.id}`);
  redirect("/admin/builder-parts");
}
