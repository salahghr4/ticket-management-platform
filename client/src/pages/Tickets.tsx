import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicket } from "@/hooks/useTicket";
import { Ticket } from "@/types/tickets";
import { Plus, RefreshCw, Ticket as TicketIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { getTickets, isLoading } = useTicket();

  const fetchTickets = useCallback(async () => {
    const fetchedTickets = await getTickets();
    if (fetchedTickets) {
      setTickets(fetchedTickets);
    }
  }, [getTickets]);

  useEffect(() => {
    fetchTickets();
  }, [getTickets, fetchTickets]);

  const syncTickets = (updatedTicket: Ticket) => {
    setTickets((prev: Ticket[]) => {
      return prev.map((ticket: Ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      );
    });
  };

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-6">
      <div className="w-[95%] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <TicketIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Tickets</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage and track all your support tickets
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={fetchTickets}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link
              to="/tickets/create"
              className="flex-1 sm:flex-none"
            >
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </Link>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>All Tickets</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <DataTable
              data={tickets}
              syncTickets={syncTickets}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tickets;
