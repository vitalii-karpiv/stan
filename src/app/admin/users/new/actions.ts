"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import {
  createUserSchema,
  type UserFormState,
} from "@/lib/validations/user";

function extractValues(formData: FormData) {
  const str = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };

  return {
    name: str("name"),
    email: str("email"),
    password: str("password"),
    phone: str("phone"),
    role: str("role"),
  };
}

export async function createUserAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireAdmin();
  const values = extractValues(formData);
  const parsed = createUserSchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        password: flat.password?.[0],
        phone: flat.phone?.[0],
        role: flat.role?.[0],
      },
      values,
    };
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        phone: parsed.data.phone || null,
        role: parsed.data.role,
      },
    });
  } catch (error: unknown) {
    if (isEmailConflict(error)) {
      return {
        message: "A user with this email already exists.",
        fieldErrors: { email: "Email is already taken." },
        values,
      };
    }
    return {
      message: "Unable to create user right now. Please try again.",
      fieldErrors: {},
      values,
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

function isEmailConflict(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { code?: string; meta?: { target?: unknown } };
  return (
    e.code === "P2002" &&
    Array.isArray(e.meta?.target) &&
    e.meta!.target.includes("email")
  );
}
