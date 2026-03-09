"use server";

import { notifyAdminsContactForm } from "@/lib/mail";
import {
  contactSchema,
  type ContactFormState,
} from "@/lib/validations/contact";

export async function submitContactAction(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: formData.get("name") as string ?? "",
    phone: formData.get("phone") as string ?? "",
    message: formData.get("message") as string ?? "",
  };

  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Будь ласка, виправте виділені поля.",
      fieldErrors: {
        name: flat.name?.[0],
        phone: flat.phone?.[0],
        message: flat.message?.[0],
      },
      values,
    };
  }

  notifyAdminsContactForm({
    name: parsed.data.name,
    phone: parsed.data.phone,
    message: parsed.data.message,
  }).catch(() => {});

  return {
    success: true,
    message: "Дякуємо! Ваше повідомлення надіслано.",
    fieldErrors: {},
    values: { name: "", phone: "", message: "" },
  };
}
