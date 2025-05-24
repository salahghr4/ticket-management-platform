import { z } from "zod";

export const attachmentsSchema = z.object({
  attachments: z
    .array(z.custom<File>())
    .optional()
    .refine((files) => files?.every((file) => file?.size <= 10 * 1024 * 1024), {
      message: "File size must be less than 10MB",
      path: ["files"],
    }),
});

export type attachmentFormValues = z.infer<typeof attachmentsSchema>;
