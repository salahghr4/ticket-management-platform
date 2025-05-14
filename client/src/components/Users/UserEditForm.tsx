import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUser } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { Department, User } from "@/types/auth";
import { UserEditFormValues, updateUserSchema } from "@/validation/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserEditForm = ({
  user,
  departments,
}: {
  user: User;
  departments: Department[];
}) => {
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser(
    user.id
  );
  const [openDepartmentPopover, setOpenDepartmentPopover] = useState(false);
  const navigate = useNavigate();

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      password_confirmation: "",
      role: user.role,
      department_id: user.department_id || undefined,
    },
    mode: "onBlur",
  });

  async function onSubmit(data: UserEditFormValues) {
    toast.promise(updateUser(data), {
      loading: "Updating user...",
      success: () => {
        navigate("/users");
        return "User updated successfully!";
      },
      error: "Failed to update user. Please try again.",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter user's name"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter user's email"
                        type="email"
                        className="h-12 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-base">
                        New Password (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter new password"
                          type="password"
                          className="h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-base">
                        Confirm New Password (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm new password"
                          type="password"
                          className="h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-base">Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-base">Department</FormLabel>
                      <Popover
                        open={openDepartmentPopover}
                        onOpenChange={setOpenDepartmentPopover}
                      >
                        <PopoverTrigger asChild>
                          <FormControl className="w-full">
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between hover:bg-background/80",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                <div className="flex items-center gap-2">
                                  <Building />
                                  {
                                    departments?.find(
                                      (department) =>
                                        department.id === field.value
                                    )?.name
                                  }
                                </div>
                              ) : (
                                "Select department..."
                              )}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search department..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No department found.</CommandEmpty>
                              <CommandGroup>
                                {departments?.map((department) => (
                                  <CommandItem
                                    defaultValue={field.value}
                                    key={department.id}
                                    value={department.name}
                                    onSelect={() => {
                                      field.onChange(department.id);
                                      setOpenDepartmentPopover(false);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-2">
                                        <Building className="h-4 w-4" />
                                        {department.name}
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          department.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update User"}
        </Button>
      </form>
    </Form>
  );
};

export default UserEditForm;
