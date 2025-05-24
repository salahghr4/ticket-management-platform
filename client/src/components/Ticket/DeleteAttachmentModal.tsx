import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAttachment } from "@/hooks/useAttachments";
import { Attachment } from "@/types/tickets";
import { toast } from "sonner";

interface DeleteAttachmentModalProps {
  isOpen: boolean;
  onOpen: React.Dispatch<React.SetStateAction<boolean>>;
  attachment: Attachment;
  trigger?: React.ReactNode;
  setDeleteAttachment: (value: Attachment | null) => void;
}

const DeleteAttachmentModal = ({
  attachment,
  trigger,
  isOpen,
  onOpen,
  setDeleteAttachment,
}: DeleteAttachmentModalProps) => {
  const deleteAttachment = useDeleteAttachment(
    attachment.ticket_id,
    attachment.id
  );
  const handleDelete = async () => {
    toast.promise(deleteAttachment.mutateAsync(), {
      loading: "Deleting attachment...",
      success: () => {
        return "Attachment deleted successfully";
      },
      error: "Failed to delete attachment. Please try again.",
    });
    onOpen(false);
    setDeleteAttachment(null);
  };

  return (
    <>
      {trigger && <div onClick={() => onOpen(true)}>{trigger}</div>}
      <Dialog
        open={isOpen}
        onOpenChange={onOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Attachment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this attachment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              File: {attachment.file_name}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpen(false)}
              disabled={deleteAttachment.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteAttachment.isPending}
            >
              {deleteAttachment.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteAttachmentModal;
