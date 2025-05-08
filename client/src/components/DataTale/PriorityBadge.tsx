import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/types/tickets";

const PriorityBadge = ({ priority }: { priority: Ticket["priority"] }) => {
  const priorityStyles = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700",
  };

  return (
    <Badge
      variant="outline"
      className={`${priorityStyles[priority]} font-medium`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

export default PriorityBadge;
