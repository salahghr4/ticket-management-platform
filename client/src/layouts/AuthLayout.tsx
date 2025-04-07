import noBgBlack from "@/assets/imgs/LogoBlack.png";
import authImg from "@/assets/imgs/authImg.jpg";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="w-full h-full flex items-center">
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex justify-center items-center py-10">
          <img
            src={noBgBlack}
            alt=""
            className="w-1/3"
          />
        </div>
        <div className="w-full flex justify-center">
          <Outlet />
        </div>
      </div>
      <div className="w-full h-full p-10">
        <div
          className="w-full h-full bg-cover bg-center rounded-4xl"
          style={{ backgroundImage: `url(${authImg})` }}
        ></div>
      </div>
    </div>
  );
};

export default AuthLayout;
