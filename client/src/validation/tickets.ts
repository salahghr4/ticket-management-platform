import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["open", "in progress", "resolved", "closed", "rejected"]),
  department_id: z.number(),
  assigned_to: z.number().optional(),
  due_date: z.date().optional(),
});

export type TicketFormValues = z.infer<typeof ticketSchema>;
