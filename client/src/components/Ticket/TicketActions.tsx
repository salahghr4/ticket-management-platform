import DeleteTicketDialog from "@/components/Ticket/DeleteTicketDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/auth";
import { Ticket } from "@/types/tickets";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";

const TicketActions = ({
  ticket,
  handleStatusChange,
  navigate,
  handleDeleteTicket,
  AuthUser,
}: {
  ticket: Ticket;
  handleStatusChange: (ticket: Ticket) => void;
  navigate: NavigateFunction;
  handleDeleteTicket: (ticketId: number) => void;
  AuthUser: User | null;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(ticket.id.toString());
              toast.success("Ticket ID copied to clipboard");
            }}
            className="cursor-pointer"
          >
            Copy ticket ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate(`/tickets/${ticket.id}`);
            }}
            className="cursor-pointer"
          >
            View details
          </DropdownMenuItem>
          {(AuthUser?.role === "admin" ||
            AuthUser?.department_id === ticket.department_id) && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/tickets/${ticket.id}/edit`);
                }}
                className="cursor-pointer"
              >
                Edit ticket
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(ticket)}
                className="cursor-pointer"
              >
                Mark as{" "}
                {ticket.status === "open"
                  ? "in progress"
                  : ticket.status === "in progress"
                  ? "resolved"
                  : ticket.status === "resolved"
                  ? "closed"
                  : "open"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="cursor-pointer"
                variant="destructive"
              >
                Delete ticket
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteTicketDialog
        ticket={ticket}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteTicket}
      />
    </>
  );
};

export default TicketActions;
