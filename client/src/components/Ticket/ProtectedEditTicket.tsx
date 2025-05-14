import { useAuth } from "@/hooks/useAuth";
import { useTicket } from "@/hooks/useTickets";
import { Navigate, useParams } from "react-router-dom";
import EditTicket from "@/pages/EditTicket";
import Loader from "@/components/Logo/Loader";
import TicketNotFound from "@/components/Ticket/TicketNotFound";

const ProtectedEditTicket = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: ticketData, isLoading } = useTicket(Number(id));

  if (isLoading) {
    return <Loader />;
  }

  if (!ticketData?.ticket) {
    return <TicketNotFound />;
  }

  // Check if user is admin or from the same department
  const canEdit =
    user?.role === "admin" ||
    user?.department_id === ticketData?.ticket?.department_id;

  if (!canEdit) {
    return <Navigate to={`/tickets/${id}`} />;
  }

  return <EditTicket ticket={ticketData?.ticket} />;
};

export default ProtectedEditTicket;
