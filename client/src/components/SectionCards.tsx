import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NumberFlow from "@number-flow/react";
import { useEffect, useState } from "react";
import ticketsService from "@/services/tickets";
import { TicketStats } from "@/types/tickets";

export function SectionCards() {
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    rejectedTickets: 0,
  });

  useEffect(() => {
    const fetchTicketStats = async () => {
      const ticketStats = await ticketsService.getTicketStats();
      setTicketStats(ticketStats);
    };
    fetchTicketStats();
  }, []);

  const cardData = [
    {
      title: "Open tickets",
      value: ticketStats.openTickets,
    },
    {
      title: "In Progress tickets",
      value: ticketStats.inProgressTickets,
    },
    {
      title: "Resolved tickets",
      value: ticketStats.resolvedTickets,
    },
    {
      title: "Rejected tickets",
      value: ticketStats.rejectedTickets,
    },
  ];

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {cardData.map((card) => (
        <Card className="@container/card" key={card.title}>
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              <NumberFlow value={card.value} />
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
