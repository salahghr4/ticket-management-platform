import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { User } from "@/types/auth";
import {
  UserPasswordFormValues,
  userPasswordSchema,
  UserProfileFormValues,
  userProfileSchema,
} from "@/validation/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ArrowLeft, Loader2, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  const UserInfoForm = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const UserPasswordForm = useForm<UserPasswordFormValues>({
    resolver: zodResolver(userPasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const redirectUrl = state?.from || "/dashboard";

  const queryClient = useQueryClient();
  const {
    mutate: SaveProfile,
    error,
    isPending,
  } = useMutation({
    mutationFn: async (data: UserProfileFormValues) => {
      return await api<{ user: User }>({
        method: "PATCH",
        url: "/profile",
        data,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], (oldData: User) => ({
        ...oldData,
        ...data,
      }));
      toast.success("Profile updated successfuly");
    },
  });
  const {
    mutate: UpdatePassword,
    error: passwordError,
    isPending: passwordPending,
  } = useMutation({
    mutationFn: async (data: UserPasswordFormValues) => {
      return await api<{ message: string }>({
        method: "PUT",
        url: "/password",
        data,
      });
    },
    onSuccess: () => {
      toast.success("password updated successfuly");
      UserPasswordForm.reset();
    },
  });

  const handleProfileSave = async (data: UserProfileFormValues) => {
    SaveProfile(data);
  };

  const handlePasswordSave = (data: UserPasswordFormValues) => {
    UpdatePassword(data);
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-y-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(redirectUrl, {
                  state: {
                    from: pathname,
                  },
                })
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="flex flex-col justify-center gap-1">
                Profile Information
                <p className="text-sm text-gray-500">
                  Update your account's profile information and email address.
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...UserInfoForm}>
                {error && (
                  <p className="text-red-500 text-sm mb-4">
                    {isAxiosError(error)
                      ? error.response?.data.message
                      : "An error occurred, Please try again later."}
                  </p>
                )}
                <form
                  onSubmit={UserInfoForm.handleSubmit(handleProfileSave)}
                  className="space-y-7"
                >
                  <FormField
                    control={UserInfoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="sm:w-1/2">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            className="py-5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={UserInfoForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:w-1/2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="m@example.com"
                            className="py-5"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="cursor-pointer px-6"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle className="flex flex-col justify-center gap-1">
                Update Password
                <p className="text-sm text-gray-500">
                  Ensure your account is using a long, random password to stay
                  secure.
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...UserPasswordForm}>
                {passwordError && (
                  <p className="text-red-500 text-sm mb-4">
                    {isAxiosError(passwordError)
                      ? passwordError.response?.data.message
                      : "An error occurred, Please try again later."}
                  </p>
                )}
                <form
                  onSubmit={UserPasswordForm.handleSubmit(handlePasswordSave)}
                  className="space-y-7"
                >
                  <FormField
                    control={UserPasswordForm.control}
                    name="current_password"
                    render={({ field }) => (
                      <FormItem className="sm:w-1/2">
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            className="py-5"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={UserPasswordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="sm:w-1/2">
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            className="py-5"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={UserPasswordForm.control}
                    name="password_confirmation"
                    render={({ field }) => (
                      <FormItem className="sm:w-1/2">
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            className="py-5"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="cursor-pointer px-6"
                    disabled={passwordPending}
                  >
                    {passwordPending ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
