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
import { useCreateDepartment } from "@/hooks/useDepartments";
import { formSchema, DepartmentFormValues } from "@/validation/departments";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface DepartmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepartmentCreateModal = ({
  isOpen,
  onClose,
}: DepartmentCreateModalProps) => {
  const { mutate: createDepartment, isPending } = useCreateDepartment();

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: DepartmentFormValues) => {
    toast.promise(
      new Promise((resolve, reject) => {
        createDepartment(data, {
          onSuccess: () => {
            form.reset();
            onClose();
            resolve("Department created successfully!");
          },
          onError: () => {
            reject("Failed to create department. Please try again.");
          },
        });
      }),
      {
        loading: "Creating department...",
        success: () => {
          form.reset();
          onClose();
          return "Department created successfully!";
        },
        error: "Failed to create department. Please try again.",
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
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Add a new department to the system. Click save when you're done.
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
                {isPending ? "Creating..." : "Create Department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentCreateModal;
