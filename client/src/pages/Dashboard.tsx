import { SectionCards } from "@/components/Cards/SectionCards";
import { TicketChart } from "@/components/Charts/TicketChart";
import { TicketPriorityChart } from "@/components/Charts/TicketPriorityChart";
import DataTable from "@/components/DataTale/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicketStats } from "@/hooks/useTickets";
import { fillMissingDates } from "@/lib/utils";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const initialTicketStats = {
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
  };

  const { data: ticketStats, isLoading } = useTicketStats();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards ticketStats={ticketStats || initialTicketStats} />
          <div className="flex flex-col gap-4 flex-wrap px-4 lg:flex-row lg:gap-6 lg:px-6">
            <TicketChart
              chartData={fillMissingDates(ticketStats?.ticketCounts || [])}
            />
            <TicketPriorityChart
              highestPriority={ticketStats?.highestPriority || 0}
              mediumPriority={ticketStats?.mediumPriority || 0}
              lowPriority={ticketStats?.lowPriority || 0}
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
                  data={ticketStats?.tickets || []}
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
