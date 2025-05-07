import ticketsService from "@/services/tickets";
import { Ticket } from "@/types/tickets";
import { useState } from "react";
import { toast } from "sonner";

export const useTicket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTickets = async () => {
    setIsLoading(true);
    setError(null);
    const response = await ticketsService.getTickets();
    if (response.success) {
      setIsLoading(false);
      return response.tickets;
    } else {
      setError(response.message || "Failed to fetch tickets");
      toast.error(response.message || "Failed to fetch tickets");
      setIsLoading(false);
      return [];
    }
  };

  const getTicket = async (id: number) => {
    setIsLoading(true);
    setError(null);
    const response = await ticketsService.getTicket(id);
    if (response.success) {
      setIsLoading(false);
      return response.ticket;
    } else {
      setError(response.message || "Failed to fetch ticket");
      toast.error(response.message || "Failed to fetch ticket");
      setIsLoading(false);
      return null;
    }
  };

  const createTicket = async (
    ticketData: Omit<
      Ticket,
      "id" | "created_at" | "updated_at" | "user" | "assignee" | "department"
    >
  ) => {
    setIsLoading(true);
    setError(null);
    const response = await ticketsService.createTicket(ticketData);
    if (response.success) {
      setIsLoading(false);
      return response.ticket;
    } else {
      setError(response.message || "Failed to create ticket");
      toast.error(response.message || "Failed to create ticket");
      setIsLoading(false);
      return undefined;
    }
  };

  const updateTicket = async (
    ticketData: Partial<Ticket> & { id: number }
  ) => {
    setIsLoading(true);
    setError(null);
    const response = await ticketsService.updateTicket(
      ticketData.id,
      ticketData
    );
    if (response.success) {
      setIsLoading(false);
      console.log(response.ticket);
      return response.ticket;
    } else {
      setError(response.message || "Failed to update ticket");
      toast.error(response.message || "Failed to update ticket");
      setIsLoading(false);
      return undefined;
    }
  };

  const deleteTicket = async (id: number) => {
    setIsLoading(true);
    setError(null);
    const response = await ticketsService.deleteTicket(id);
    if (response.success) {
      setIsLoading(false);
      return true;
    } else {
      setError(response.message || "Failed to delete ticket");
      toast.error(response.message || "Failed to delete ticket");
      setIsLoading(false);
      return false;
    }
  };

  return {
    isLoading,
    error,
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
  };
};
