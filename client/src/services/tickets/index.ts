import api from "@/lib/api";
import { Ticket, TicketStats } from "@/types/tickets";


const getTickets = async () => {
  return await api<Ticket[]>({
    method: "GET",
    url: "/tickets",
  });
};

const getTicketStats = async () => {
  return await api<TicketStats>({
    method: "GET",
    url: "/tickets/stats",
  });
};
export default { getTickets, getTicketStats };
