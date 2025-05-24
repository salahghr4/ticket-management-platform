import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import AttachmentForm from "./AttachmentForm";

interface AttachmentModalProps {
  ticketId: number;
  trigger?: React.ReactNode;
}

const AttachmentModal = ({ ticketId, trigger }: AttachmentModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <>
      {trigger && <div onClick={() => setIsOpen(true)}>{trigger}</div>}
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Attachments</DialogTitle>
            <DialogDescription>
              Upload files to attach to this ticket. You can drag and drop files
              or click to browse.
            </DialogDescription>
          </DialogHeader>
          <AttachmentForm
            ticketId={ticketId}
            onSuccess={handleSuccess}
            onClose={setIsOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttachmentModal;
