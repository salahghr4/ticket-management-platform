import api from "@/lib/api";
import {
  Ticket,
  TicketResponse,
  TicketsResponse,
  TicketStats
} from "@/types/tickets";

const getTickets = async (): Promise<TicketsResponse> => {
  return await api<TicketsResponse>({
    method: "GET",
    url: "/tickets",
  });
};

const getTicketStats = async () => {
  return await api<TicketStats & { success: boolean }>({
    method: "GET",
    url: "/tickets/stats",
  });
};

const getTicket = async (id: number): Promise<TicketResponse> => {
  return await api<TicketResponse>({
    method: "GET",
    url: `/tickets/${id}`,
  });
};

const createTicket = async (
  ticket: Omit<
    Ticket,
    "id" | "created_at" | "updated_at" | "user" | "assignee" | "department"
  >
): Promise<TicketResponse> => {
  return await api<TicketResponse>({
    method: "POST",
    url: "/tickets",
    data: ticket,
  });
};

const updateTicket = async (
  id: number,
  ticket: Partial<Ticket> & { id: number }
): Promise<TicketResponse> => {
  return await api<TicketResponse>({
    method: "PUT",
    url: `/tickets/${id}`,
    data: ticket,
  });
};

const deleteTicket = async (id: number): Promise<TicketResponse> => {
  return await api<TicketResponse>({
    method: "DELETE",
    url: `/tickets/${id}`,
  });
};

export default {
  getTickets,
  getTicketStats,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
};
