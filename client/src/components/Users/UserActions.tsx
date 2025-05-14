import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteUserDialog from "@/components/Users/DeleteUserDialog";
import { User } from "@/types/auth";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { toast } from "sonner";

const UserActions = ({
  user,
  navigate,
  handleDeleteUser,
  AuthUser,
}: {
  user: User;
  navigate: NavigateFunction;
  handleDeleteUser: (userId: number) => void;
  AuthUser: User | null;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(user.email);
              toast.success("User email copied to clipboard");
            }}
            className="cursor-pointer"
          >
            Copy user email
          </DropdownMenuItem>
          {AuthUser?.role === "admin" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate(`/admin/users/${user.id}/edit`);
                }}
                className="cursor-pointer"
              >
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="cursor-pointer"
                variant="destructive"
              >
                Delete user
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteUserDialog
        user={user}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteUser}
      />
    </>
  );
};

export default UserActions;
