import { Button } from "@/components/ui/button";
import { TicketIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TicketNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Ticket Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The ticket you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => navigate("/tickets")}
              className="gap-2"
            >
              <TicketIcon className="h-4 w-4" />
              Go to Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketNotFound;
