import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Ticket } from "@/types/tickets";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteTicketDialog = ({
  ticket,
  isOpen,
  onOpenChange,
  onDelete,
}: {
  ticket: Ticket;
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
          <DialogTitle>Delete Ticket</DialogTitle>
          <DialogDescription className="leading-7">
            Are you sure you want to delete ticket number{" "}
            <span className="font-bold text-primary underline">
              #{ticket.id}
            </span>{" "}
            ? <br />
            This action cannot be undone.
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
              onDelete(ticket.id);
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

export default DeleteTicketDialog;
