import { Department, User } from "@/types/auth";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  department_id: number;
  user_id: number;
  assigned_to: number | null;
  status: "open" | "in progress" | "resolved" | "closed" | "rejected";
  priority: "low" | "medium" | "high";
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
  user: User;
  assignee: User | null;
  department: Department;
};

export type TicketStats = {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  rejectedTickets: number;
  closedTickets: number;
  ticketCounts: {
    date: string;
    count: number;
  }[];
  highestPriority: number;
  mediumPriority: number;
  lowPriority: number;
  tickets: Ticket[];
};

export type TicketsResponse = {
  success: boolean;
  tickets: Ticket[];
};

export type TicketResponse = {
  success: boolean;
  message: string;
  ticket: Ticket;
};
