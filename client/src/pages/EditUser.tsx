import Loader from "@/components/Logo/Loader";
import { Button } from "@/components/ui/button";
import UserEditForm from "@/components/Users/UserEditForm";
import UserNotFound from "@/components/Users/UserNotFound";
import { useDepartments } from "@/hooks/useDepartments";
import { useUser } from "@/hooks/useUsers";
import { ArrowLeft, UserIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const { id } = useParams();
  const { data: user, isLoading: userLoading } = useUser(Number(id));
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const navigate = useNavigate();

  if (departmentsLoading || userLoading) {
    return <Loader />;
  }

  if (!user) {
    return <UserNotFound />;
  }

  return (
    <div className="w-[90%] container mx-auto py-8 px-4">
      <div className="w-full md:max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/users")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-primary dark:text-primary-foreground" />
              <h1 className="text-2xl font-bold">Edit User</h1>
            </div>
          </div>
        </div>

        <UserEditForm
          departments={departments || []}
          user={user}
        />
      </div>
    </div>
  );
};

export default EditUser;
