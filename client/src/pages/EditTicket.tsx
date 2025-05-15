import TicketForm from "@/components/Ticket/TikcetForm";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/tickets";
import {
  ArrowLeft,
  TicketIcon
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const EditTicket = ({ ticket }: { ticket: Ticket }) => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const redirectUrl = state?.from || "/tickets";


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full md:max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(redirectUrl, {
                state: {
                  from: pathname,
                },
              })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              <h1 className="text-2xl font-bold">Edit Ticket</h1>
            </div>
          </div>
        </div>

        <TicketForm ticket={ticket} />
      </div>
    </div>
  );
};

export default EditTicket;
