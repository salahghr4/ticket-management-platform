import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
    role: z.enum(["admin", "employee", "manager", "technician"]),
    department_id: z.number(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export type UserFormValues = z.infer<typeof userSchema>;
