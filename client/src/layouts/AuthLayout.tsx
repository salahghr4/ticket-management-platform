import noBgBlack from "@/assets/imgs/LogoBlack.png";
import authImg from "@/assets/imgs/authImg.jpg";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full h-full flex items-center p-5">
      <div className="w-full h-full flex flex-col gap-15">
        <div className="w-full h-full flex justify-center items-center">
          <img
            src={noBgBlack}
            alt=""
            className="w-1/3"
          />
        </div>
        <div className="w-full px-10 flex justify-center flex-1">
          <Outlet />
        </div>
      </div>
      <div className="hidden lg:flex w-full h-full py-10">
        <div className="w-full h-full flex justify-center items-center">
          <img
            src={authImg}
            alt=""
            className="w-[80%] h-full object-cover rounded-4xl"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
