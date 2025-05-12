import Loader from "@/components/Logo/Loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useDepartments } from "@/hooks/useDepartments";
import { useCreateTicket } from "@/hooks/useTickets";
import { useUsers } from "@/hooks/useUsers";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TicketFormValues } from "@/validation/tickets";
import { ticketSchema } from "@/validation/tickets";
import { zodResolver } from "@hookform/resolvers/zod";
import { subDays } from "date-fns";
import {
  ArrowLeft,
  Building,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Ticket as TicketIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreateTicket() {
  const [openPopover, setOpenPopover] = useState(false);
  const [dueDatePopover, setDueDatePopover] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync: createTicket, isPending } = useCreateTicket();
  const { user } = useAuth();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: users, isLoading: usersLoading } = useUsers();

  const isLoading = departmentsLoading || usersLoading;

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "open",
      department_id: user?.department_id || 1,
      assigned_to: null,
      due_date: undefined,
    },
  });

  const [filteredUsers, setFilteredUsers] = useState<
    {
      value: number;
      label: string;
      email: string;
      searchValue: string;
    }[]
  >(
    users
      ?.filter((user) => user.department_id === form.getValues("department_id"))
      .map((user) => ({
        value: user.id,
        label: user.name,
        email: user.email,
        searchValue: user.name + user.email,
      })) || []
  );

  if (isLoading) {
    return <Loader />;
  }

  async function onSubmit(data: TicketFormValues) {
    toast.promise(createTicket(data), {
      loading: "Creating ticket...",
      success: () => {
        navigate("/tickets");
        return "Ticket created successfully!";
      },
      error: "Failed to create ticket. Please try again.",
    });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full md:max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/tickets")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TicketIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              <h1 className="text-2xl font-bold">Create New Ticket</h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6">
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter ticket title"
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your issue or request..."
                              className="min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide detailed information about your ticket
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-6">
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-base">
                              Priority
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                    Low
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                    Medium
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500" />
                                    High
                                  </div>
                                </SelectItem>
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
                            <FormLabel className="text-base">
                              Department
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(Number(value));
                                setFilteredUsers(
                                  users
                                    ?.filter(
                                      (user) =>
                                        user.department_id === Number(value)
                                    )
                                    .map((user) => ({
                                      value: user.id,
                                      label: user.name,
                                      email: user.email,
                                      searchValue: user.name + user.email,
                                    })) || []
                                );
                                form.setValue("assigned_to", null);
                              }}
                              value={field.value?.toString()}
                            >
                              <FormControl className="w-full">
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {departments?.map((department) => (
                                  <SelectItem
                                    key={department.id}
                                    value={department.id.toString()}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Building className="h-4 w-4" />
                                      {department.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <FormField
                        control={form.control}
                        name="assigned_to"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-base">
                              Assigned to
                            </FormLabel>
                            <Popover
                              open={openPopover}
                              onOpenChange={setOpenPopover}
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
                                        <User />
                                        {
                                          filteredUsers.find(
                                            (user) => user.value === field.value
                                          )?.label
                                        }
                                      </div>
                                    ) : (
                                      "Select user to assign..."
                                    )}
                                    <ChevronsUpDown className="opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search user..."
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>No user found.</CommandEmpty>
                                    <CommandGroup>
                                      {filteredUsers.map((user) => (
                                        <CommandItem
                                          value={user.searchValue}
                                          key={user.value}
                                          onSelect={() => {
                                            form.setValue(
                                              "assigned_to",
                                              user.value === field.value
                                                ? null
                                                : user.value
                                            );
                                            setOpenPopover(false);
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Avatar>
                                              <AvatarFallback className="bg-primary text-primary-foreground dark:bg-primary-foreground dark:text-primary">
                                                {user.label
                                                  .slice(0, 2)
                                                  .toLocaleUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                              <span className="text-sm font-medium">
                                                {user.label}
                                              </span>
                                              <span className="text-xs text-muted-foreground font-medium">
                                                {user.email}
                                              </span>
                                            </div>
                                          </div>
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              user.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              This is the user that will be assigned to the
                              ticket.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Due date */}
                      <FormField
                        control={form.control}
                        name="due_date"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className="text-base">
                              Due date
                            </FormLabel>
                            <Popover
                              open={dueDatePopover}
                              onOpenChange={setDueDatePopover}
                            >
                              <PopoverTrigger asChild>
                                <FormControl className="w-full">
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal hover:bg-background/80",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      formatDate(field.value)
                                    ) : (
                                      <span>Pick a date (optional)</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setDueDatePopover(false);
                                  }}
                                  disabled={(date) =>
                                    date < subDays(new Date(), 1)
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              This is the date when the ticket is due.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Ticket"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
