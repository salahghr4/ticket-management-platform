import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Department name must be at least 2 characters.",
  }),
});

export type DepartmentFormValues = z.infer<typeof formSchema>;
