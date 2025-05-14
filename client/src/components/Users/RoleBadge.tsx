import { Badge } from "@/components/ui/badge";
import { User } from "@/types/auth";

const RoleBadge = ({ role }: { role: User["role"] }) => {
  const roleStyles = {
    admin:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-purple-300 dark:border-purple-700",
    employee:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-300 dark:border-blue-700",
    manager:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
    technician:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 border-orange-300 dark:border-orange-700",
  };

  return (
    <Badge
      variant="outline"
      className={`${roleStyles[role]} font-medium`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
    </Badge>
  );
};

export default RoleBadge;
