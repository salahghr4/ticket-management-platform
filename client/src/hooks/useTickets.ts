import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ticketService from "@/services/tickets";
import type { Ticket, TicketStats } from "@/types/tickets";

// Query keys
export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (filters: string) => [...ticketKeys.lists(), { filters }] as const,
  details: () => [...ticketKeys.all, "detail"] as const,
  detail: (id: number) => [...ticketKeys.details(), id] as const,
  stats: () => [...ticketKeys.all, "stats"] as const,
};

// Hooks
export const useTickets = () => {
  return useQuery({
    queryKey: ticketKeys.lists(),
    queryFn: ticketService.getTickets,
  });
};

export const useTicket = (id: number) => {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketService.getTicket(id),
    enabled: !!id,
  });
};

export const useTicketStats = () => {
  return useQuery<TicketStats>({
    queryKey: ticketKeys.stats(),
    queryFn: async () => {
      const response = await ticketService.getTicketStats();
      return response as TicketStats;
    },
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ticket }: { id: number; ticket: Partial<Ticket> }) =>
      ticketService.updateTicket(id, { ...ticket, id }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.detail(data.ticket.id),
      });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketService.deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
    },
  });
};
