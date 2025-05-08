import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/types/tickets";

const StatusBadge = ({ status }: { status: Ticket["status"] }) => {
  const statusStyles = {
    open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
    "in progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700",
    resolved:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
    closed:
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700",
    rejected:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700",
  };

  return (
    <Badge
      variant="outline"
      className={`${statusStyles[status]} font-medium`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;
