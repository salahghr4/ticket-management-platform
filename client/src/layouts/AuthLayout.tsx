import noBgBlack from "@/assets/imgs/LogoBlack.png";
import authImg from "@/assets/imgs/authImg.jpg";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <img
            src={noBgBlack}
            alt=""
            className="w-1/4"
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={authImg}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-80"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
