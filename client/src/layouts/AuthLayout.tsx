import authImgDark from "@/assets/imgs/authImgDark.png";
import authImg from "@/assets/imgs/authImg.png";
import { Outlet } from "react-router-dom";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import { useTheme } from "@/hooks/usetheme";

const AuthLayout = () => {
  const { isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 mt-10">
          <div className="w-1/2">
            <Logo />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={theme === "dark" ? authImgDark : authImg}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-80"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
