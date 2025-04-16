import { SectionCards } from "@/components/SectionCards";
import { TicketStats } from "@/types/tickets";
import { useState } from "react";
import { useEffect } from "react";
import ticketsService from "@/services/tickets";
import { fillMissingDates } from "@/lib/utils";
import { TicketChart } from "@/components/TicketChart";
import { TicketPriorityChart } from "@/components/TicketPriorityChart";

const Dashboard = () => {
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    rejectedTickets: 0,
    ticketCounts: [],
    highestPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  });

  useEffect(() => {
    const fetchTicketStats = async () => {
      const ticketStats = await ticketsService.getTicketStats();
      setTicketStats(ticketStats);
    };
    fetchTicketStats();
  }, []);

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
