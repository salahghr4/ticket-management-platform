import { User } from "@/types/auth";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  department_id: number;
  user_id: number;
  assigned_to: number;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  priority: "low" | "medium" | "high";
  due_date: Date;
  created_at: Date;
  updated_at: Date;
  user: User;
}

export type TicketStats = {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  rejectedTickets: number;
  ticketCounts: { date: string; count: number }[];
  highestPriority: number;
  mediumPriority: number;
  lowPriority: number;
};
