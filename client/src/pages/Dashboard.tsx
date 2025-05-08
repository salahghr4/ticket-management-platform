import { SectionCards } from "@/components/Cards/SectionCards";
import { Ticket, TicketStats } from "@/types/tickets";
import { useState } from "react";
import { useEffect } from "react";
import ticketsService from "@/services/tickets";
import { fillMissingDates } from "@/lib/utils";
import { TicketChart } from "@/components/Charts/TicketChart";
import { TicketPriorityChart } from "@/components/Charts/TicketPriorityChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DataTable from "@/components/DataTale/DataTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    rejectedTickets: 0,
    ticketCounts: [],
    highestPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    tickets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchTicketStats = async () => {
      setIsLoading(true);
      const response = await ticketsService.getTicketStats();
      if (response) {
        setTicketStats(response as TicketStats);
      }
      setIsLoading(false);
    };
    fetchTicketStats();
  }, []);

  const syncTickets = (updatedTicket: Ticket) => {
    setTicketStats((prev: TicketStats) => {
      return {
        ...prev,
        tickets: prev.tickets.map((ticket: Ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        ),
      };
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards ticketStats={ticketStats} />
          <div className="flex flex-col gap-4 flex-wrap px-4 lg:flex-row lg:gap-6 lg:px-6">
            <TicketChart
              chartData={fillMissingDates(ticketStats.ticketCounts)}
            />
            <TicketPriorityChart
              highestPriority={ticketStats.highestPriority}
              mediumPriority={ticketStats.mediumPriority}
              lowPriority={ticketStats.lowPriority}
            />
          </div>
          <div className="flex flex-col gap-4 px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span className="flex items-center">Recent Tickets</span>
                  <Link to="/tickets">
                    <Button
                      variant="link"
                      className="text-sm dark:text-muted-foreground text-primary"
                    >
                      View all tickets
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={ticketStats.tickets}
                  syncTickets={syncTickets}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
