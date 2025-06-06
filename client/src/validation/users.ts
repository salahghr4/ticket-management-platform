import { z } from "zod";

const baseUserSchema = {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "employee", "manager", "technician"]),
  department_id: z.number(),
};

export const createUserSchema = z
  .object({
    ...baseUserSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export const updateUserSchema = z
  .object({
    ...baseUserSchema,
    password: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || val.length === 0 || val.length >= 8,
        {
          message: "Password must be at least 8 characters",
        }
      ),
    password_confirmation: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || val.length === 0 || val.length >= 8,
        {
          message: "Password must be at least 8 characters",
        }
      ),
  })
  .refine(
    (data) => {
      if (data.password || data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["password_confirmation"],
    }
  );

export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export const userPasswordSchema = z.object({
  current_password: z.string().min(8, "Old password must be at least 8 characters"),
  password: z.string().min(8, "New password must be at least 8 characters"),
  password_confirmation: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export type UserCreateFormValues = z.infer<typeof createUserSchema>;
export type UserEditFormValues = z.infer<typeof updateUserSchema>;
export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
export type UserPasswordFormValues = z.infer<typeof userPasswordSchema>;
