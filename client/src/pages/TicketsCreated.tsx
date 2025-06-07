import TicketTable from "@/components/Ticket/TicketTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicketsCreated } from "@/hooks/useTickets";
import { ArrowLeft, Plus, RefreshCw, Ticket as TicketIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const TicketsCreated = () => {
  const { data: ticketsData, isLoading, refetch, isFetching } = useTicketsCreated("created");
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const redirectUrl = state?.from || "/dashboard";
  return (
    <div className="min-h-fit w-full flex justify-center px-4 py-6">
      <div className="w-[95%] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <TicketIcon className="h-8 w-8 text-primary dark:text-primary-foreground" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Tickets</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage and track all your created support tickets
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  isLoading || isFetching ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
            <Link
              to="/tickets/create"
              className="flex-1 sm:flex-none"
              state={{
                from: pathname,
              }}
            >
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>All Tickets</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <TicketTable
              data={ticketsData?.tickets || []}
              isLoading={isLoading || isFetching}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketsCreated;
