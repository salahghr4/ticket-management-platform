
export interface TicketHistory {
  id: number;
  ticket_id: number;
  user_id: number;
  action_type: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  formatted_old_value?: string;
  formatted_new_value?: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "open" | "in progress" | "resolved" | "closed" | "rejected";
  priority: "low" | "medium" | "high";
  department_id: number;
  user_id: number;
  assigned_to: number | null;
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
  department: {
    id: number;
    name: string;
  };
  history?: TicketHistory[];
}

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
