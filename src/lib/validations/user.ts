import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional().or(z.literal("")),
  role: z.enum(["ADMIN", "CUSTOMER"]),
});

export type CreateUserInput = z.input<typeof createUserSchema>;

type FieldKey = keyof CreateUserInput;

export type UserFormValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
};

export type UserFormState = {
  message: string | null;
  fieldErrors: Partial<Record<FieldKey, string>>;
  values: UserFormValues;
};

export const initialUserFormState: UserFormState = {
  message: null,
  fieldErrors: {},
  values: {
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "ADMIN",
  },
};
