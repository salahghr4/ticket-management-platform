import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Department } from "@/types/department";
const DepartmentDeleteModel = ({
  department,
  isOpen,
  onOpenChange,
  onDelete,
}: {
  department: Department;
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
          <DialogTitle>Delete Department</DialogTitle>
          <DialogDescription className="leading-7">
            Are you sure you want to delete department{" "}
            <span className="font-bold text-primary dark:text-accent-foreground underline">
              {department?.name}
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
              onDelete(department.id);
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

export default DepartmentDeleteModel;
