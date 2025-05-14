import Loader from "@/components/Logo/Loader";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/Users/UserForm";
import { useDepartments } from "@/hooks/useDepartments";
import { ArrowLeft, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const navigate = useNavigate();

  if (departmentsLoading) {
    return <Loader />;
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
              <h1 className="text-2xl font-bold">Create New User</h1>
            </div>
          </div>
        </div>

        <UserForm departments={departments} />
      </div>
    </div>
  );
};

export default CreateUser;
