import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Введіть ваше ім'я").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Введіть email")
    .email("Невірний формат email"),
  phone: z.string().trim().min(1, "Введіть номер телефону"),
  shippingCity: z.string().trim().min(1, "Введіть місто"),
  shippingPostOffice: z
    .string()
    .trim()
    .min(1, "Введіть номер відділення Нової Пошти"),
  note: z.string().trim().max(500, "Максимум 500 символів"),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

type FieldKey = keyof CheckoutInput;

export type CheckoutFormValues = {
  name: string;
  email: string;
  phone: string;
  shippingCity: string;
  shippingPostOffice: string;
  note: string;
};

export type CheckoutFormState = {
  message: string | null;
  fieldErrors: Partial<Record<FieldKey, string>>;
  values: CheckoutFormValues;
};

export const initialCheckoutFormState: CheckoutFormState = {
  message: null,
  fieldErrors: {},
  values: {
    name: "",
    email: "",
    phone: "",
    shippingCity: "",
    shippingPostOffice: "",
    note: "",
  },
};
