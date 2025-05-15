import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateDepartment } from "@/hooks/useDepartments";
import { Department } from "@/types/department";
import { formSchema, DepartmentFormValues } from "@/validation/departments";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

interface DepartmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
}

const DepartmentEditModal = ({
  isOpen,
  onClose,
  department,
}: DepartmentEditModalProps) => {
  const { mutate: updateDepartment, isPending } = useUpdateDepartment();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
      });
    }
  }, [department, form]);

  const onSubmit = (data: DepartmentFormValues) => {
    toast.promise(
      new Promise((resolve, reject) => {
        updateDepartment({ ...department, name: data.name } as Department, {
          onSuccess: () => {
            form.reset();
            onClose();
            resolve("Department updated successfully!");
          },
          onError: () => {
            reject("Failed to update department. Please try again.");
          },
        });
      }),
      {
        loading: "Updating department...",
        success: () => {
          form.reset();
          onClose();
          return "Department updated successfully!";
        },
        error: "Failed to update department. Please try again.",
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Edit the department details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter department name"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentEditModal;
