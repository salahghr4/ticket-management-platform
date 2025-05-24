import api from "@/lib/api";
import type {
  Ticket,
  TicketResponse,
  TicketsResponse,
  TicketStats,
} from "@/types/tickets";
import { TicketFormValues } from "@/validation/tickets";
const ticketService = {
  getAll: async (): Promise<TicketsResponse> => {
    return await api<TicketsResponse>({
      method: "GET",
      url: "/tickets",
    });
  },

  getById: async (id: number): Promise<TicketResponse> => {
    return await api<TicketResponse>({
      method: "GET",
      url: `/tickets/${id}`,
    });
  },

  getStats: async (): Promise<TicketStats> => {
    return await api<TicketStats>({
      method: "GET",
      url: "/tickets/stats",
    });
  },

  create: async (ticket: TicketFormValues): Promise<TicketResponse> => {
    return await api<TicketResponse>({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "POST",
      url: "/tickets",
      data: ticket,
    });
  },

  update: async (ticket: Partial<Ticket>): Promise<TicketResponse> => {
    return await api<TicketResponse>({
      method: "PUT",
      url: `/tickets/${ticket.id}`,
      data: ticket,
    });
  },

  delete: async (id: number): Promise<{ message: string }> => {
    return await api<{ message: string }>({
      method: "DELETE",
      url: `/tickets/${id}`,
    });
  },
};

export default ticketService;
