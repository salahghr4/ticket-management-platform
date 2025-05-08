import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NumberFlow from "@number-flow/react";
import { TicketStats } from "@/types/tickets";

export function SectionCards({ ticketStats }: { ticketStats: TicketStats }) {
  const cardData = [
    {
      title: "Total tickets",
      value: ticketStats.totalTickets,
      color: "bg-primary",
    },
    {
      title: "Open tickets",
      value: ticketStats.openTickets,
      color: "bg-blue-500",
    },
    {
      title: "In Progress tickets",
      value: ticketStats.inProgressTickets,
      color: "bg-yellow-500",
    },
    {
      title: "Resolved tickets",
      value: ticketStats.resolvedTickets,
      color: "bg-green-500",
    },
    {
      title: "Rejected tickets",
      value: ticketStats.rejectedTickets,
      color: "bg-red-500",
    },
    {
      title: "Closed tickets",
      value: ticketStats.closedTickets,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @7xl/main:grid-cols-6 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      {cardData.map((card) => (
        <div
          className="relative"
          key={card.title}
        >
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>{card.title}</CardDescription>
              <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${card.color}`} />
                  <NumberFlow
                    value={card.value}
                    className="text-primary dark:text-primary-foreground text-2xl"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <div className="absolute h-[2px] w-full bottom-0 start-0 bg-gradient-to-r from-transparent from-10% via-primary to-transparent to-90%"></div>
          </Card>
        </div>
      ))}
    </div>
  );
}
