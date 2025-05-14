import UsersTable from "@/components/Users/UsersTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Plus, Users as UsersIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Users = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  
  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-6">
      <div className="w-[95%] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <UsersIcon className="h-8 w-8 text-primary dark:text-primary-foreground" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>
              {isAdmin ? (
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage and track all system users
                </p>
              ) : (
                <p className="text-muted-foreground text-sm sm:text-base">
                  View all users
                </p>
              )}
            </div>
          </div>
          {isAdmin && (
            <Link
              to="/admin/users/create"
              className="flex-1 sm:flex-none"
            >
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </Link>
          )}
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>All Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <UsersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;
