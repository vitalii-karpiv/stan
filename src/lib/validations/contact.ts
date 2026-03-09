import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Введіть ваше ім'я").max(100),
  phone: z
    .string()
    .trim()
    .min(1, "Введіть номер телефону")
    .regex(/^\d+$/, "Номер телефону може містити лише цифри"),
  message: z.string().trim().min(1, "Введіть повідомлення").max(5000),
});

export type ContactInput = z.input<typeof contactSchema>;

type FieldKey = keyof ContactInput;

export type ContactFormValues = {
  name: string;
  phone: string;
  message: string;
};

export type ContactFormState = {
  success: boolean;
  message: string | null;
  fieldErrors: Partial<Record<FieldKey, string>>;
  values: ContactFormValues;
};

export const initialContactFormState: ContactFormState = {
  success: false,
  message: null,
  fieldErrors: {},
  values: {
    name: "",
    phone: "",
    message: "",
  },
};
