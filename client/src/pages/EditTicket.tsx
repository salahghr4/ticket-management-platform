import Loader from "@/components/Logo/Loader";
import TicketNotFound from "@/components/Ticket/TicketNotFound";
import TicketForm from "@/components/Ticket/TikcetForm";
import { Button } from "@/components/ui/button";
import { useTicket } from "@/hooks/useTickets";
import {
  ArrowLeft,
  TicketIcon
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ticketData, isLoading: ticketLoading } = useTicket(Number(id));

  if (ticketLoading) {
    return <Loader />;
  }

  if (!ticketData?.ticket) {
    return <TicketNotFound />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full md:max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/tickets")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              <h1 className="text-2xl font-bold">Edit Ticket</h1>
            </div>
          </div>
        </div>

        <TicketForm ticket={ticketData.ticket} />
      </div>
    </div>
  );
};

export default EditTicket;
