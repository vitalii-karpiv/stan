import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Введіть ваше ім'я").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Введіть email")
    .email("Невірний формат email"),
  phone: z.string().trim().optional().or(z.literal("")),
  shippingLine1: z.string().trim().min(1, "Введіть адресу доставки"),
  shippingLine2: z.string().trim().optional().or(z.literal("")),
  shippingCity: z.string().trim().min(1, "Введіть місто"),
  shippingState: z.string().trim().optional().or(z.literal("")),
  shippingPostal: z.string().trim().min(1, "Введіть поштовий індекс"),
  shippingCountry: z.string().trim().min(1, "Введіть країну"),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

type FieldKey = keyof CheckoutInput;

export type CheckoutFormValues = {
  name: string;
  email: string;
  phone: string;
  shippingLine1: string;
  shippingLine2: string;
  shippingCity: string;
  shippingState: string;
  shippingPostal: string;
  shippingCountry: string;
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
    shippingLine1: "",
    shippingLine2: "",
    shippingCity: "",
    shippingState: "",
    shippingPostal: "",
    shippingCountry: "Україна",
  },
};
