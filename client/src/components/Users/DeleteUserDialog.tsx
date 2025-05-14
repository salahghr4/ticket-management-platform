import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/auth";
const DeleteUserDialog = ({
  user,
  isOpen,
  onOpenChange,
  onDelete,
}: {
  user: User;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription className="leading-7">
            Are you sure you want to delete user{" "}
            <span className="font-bold text-primary dark:text-accent-foreground underline">
              {user.name}
            </span>{" "}
            ? <br />
            This action cannot be undone. All data associated with this user will be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(user.id);
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
