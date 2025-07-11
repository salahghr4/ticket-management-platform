import DataTable from "@/components/DataTale/DataTable";
import getTicketTableColumns from "@/components/DataTale/TicketsTableColumns";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteTicket, useUpdateTicket } from "@/hooks/useTickets";
import { Ticket } from "@/types/tickets";
import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TicketTableProps {
  data: Ticket[];
  isLoading: boolean;
}

const TicketTable = ({ data, isLoading }: TicketTableProps) => {
  const navigate = useNavigate();
  const { mutateAsync: updateTicket } = useUpdateTicket();
  const { mutateAsync: deleteTicket } = useDeleteTicket();
  const { user } = useAuth();

  const handleDeleteTicket = useCallback(
    (ticketId: number) => {
      try {
        toast.promise(deleteTicket(ticketId), {
          loading: "Deleting ticket...",
          success: () => `Ticket deleted`,
          error: "Error deleting ticket, please try again",
        });
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    },
    [deleteTicket]
  );

  const handleStatusChange = useCallback(
    (ticket: Ticket) => {
      const newStatus =
        ticket.status === "open"
          ? "in progress"
          : ticket.status === "in progress"
          ? "resolved"
          : ticket.status === "resolved"
          ? "closed"
          : "open";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { updated_at, user, assignee, department, ...rest } = ticket;
      const ticketData: Partial<Ticket> = {
        ...rest,
        status: newStatus as Ticket["status"],
      };

      try {
        toast.promise(updateTicket(ticketData), {
          loading: "Updating ticket status...",
          success: () => `Ticket status updated to ${newStatus}`,
          error: "Error updating ticket status, please try again",
        });
      } catch (error) {
        console.error("Error updating ticket:", error);
      }
    },
    [updateTicket]
  );

  const { pathname } = useLocation();
  const columns: ColumnDef<Ticket>[] = useMemo(
    () =>
      getTicketTableColumns({
        handleStatusChange,
        navigate,
        handleDeleteTicket,
        user,
        pathname,
      }),
    [handleStatusChange, navigate, handleDeleteTicket, user, pathname]
  );
  return (
    <DataTable
      data={data}
      isLoading={isLoading}
      columns={columns}
      dataFor="tickets"
      filterConfig={{
        showSearch: true,
        showStatus: true,
        showPriority: true,
        showDepartment: true,
        showDateFilter: true,
        searchField: "title",
      }}
    />
  );
};

export default TicketTable;
