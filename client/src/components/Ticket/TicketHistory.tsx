import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TicketHistory as TicketHistoryType } from "@/types/tickets";
import { Building, Calendar, Flag, Info, Paperclip, User } from "lucide-react";

interface TicketHistoryProps {
  history: TicketHistoryType[];
}

const getActionTypeStyles = (actionType: string) => {
  switch (actionType) {
    case "created":
      return {
        icon: "text-green-600 dark:text-green-400",
        badge:
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        border: "border-l-green-500",
      };
    case "status_changed":
      return {
        icon: "text-blue-600 dark:text-blue-400",
        badge:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
        border: "border-l-blue-500",
      };
    case "assigned_changed":
      return {
        icon: "text-purple-600 dark:text-purple-400",
        badge:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
        border: "border-l-purple-500",
      };
    case "attachment_added":
      return {
        icon: "text-green-600 dark:text-green-400",
        badge:
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
        border: "border-l-green-500",
      };
    case "attachment_deleted":
      return {
        icon: "text-red-600 dark:text-red-400",
        badge:
          "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
        border: "border-l-red-500",
      };
    case "updated":
      return {
        icon: "text-amber-600 dark:text-amber-400",
        badge:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
        border: "border-l-amber-500",
      };
    default:
      return {
        icon: "text-gray-600 dark:text-gray-400",
        badge:
          "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
        border: "border-l-gray-500",
      };
  }
};

const getHistoryIcon = (fieldName: string, actionType: string) => {
  const styles = getActionTypeStyles(actionType);
  switch (fieldName) {
    case "status":
      return <Info className={cn("h-4 w-4", styles.icon)} />;
    case "priority":
      return <Flag className={cn("h-4 w-4", styles.icon)} />;
    case "assigned_to":
      return <User className={cn("h-4 w-4", styles.icon)} />;
    case "department_id":
      return <Building className={cn("h-4 w-4", styles.icon)} />;
    case "due_date":
      return <Calendar className={cn("h-4 w-4", styles.icon)} />;
    case "attachments":
      return <Paperclip className={cn("h-4 w-4", styles.icon)} />;
    default:
      return null;
  }
};

const TicketHistory = ({ history }: TicketHistoryProps) => {
  if (!history?.length) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-center text-muted-foreground">
          No history available for this ticket.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn(history.length > 2 ? "h-[400px] pr-4" : "")}>
      <div className="space-y-4">
        {history.map((item) => {
          const styles = getActionTypeStyles(item.action_type);
          const isAttachmentAction =
            item.action_type === "attachment_added" ||
            item.action_type === "attachment_deleted";

          return (
            <Card
              key={item.id}
              className={cn(
                "group transition-all duration-200",
                "hover:bg-muted/50",
                "border-l-4",
                styles.border
              )}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {item.user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-sm font-medium flex items-center gap-1.5",
                            styles.badge
                          )}
                        >
                          {getHistoryIcon(
                            item.field_name || "",
                            item.action_type
                          )}
                          {item.description}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.created_at || "")}
                      </span>
                    </div>

                    {item.field_name && !isAttachmentAction && (
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Changed from
                        </span>
                        <Badge
                          variant="outline"
                          className="font-normal bg-muted/50"
                        >
                          {item.formatted_old_value || "No value"}
                        </Badge>
                        <span className="text-muted-foreground">to</span>
                        <Badge
                          variant="outline"
                          className="font-normal bg-muted/50"
                        >
                          {item.formatted_new_value || "No value"}
                        </Badge>
                      </div>
                    )}

                    {isAttachmentAction && (
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <Badge
                          variant="outline"
                          className="font-normal bg-muted/50"
                        >
                          {item.action_type === "attachment_added"
                            ? item.new_value
                            : item.old_value}
                        </Badge>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>by</span>
                      <span className="font-medium text-foreground">
                        {item.user?.name || "Unknown User"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default TicketHistory;
