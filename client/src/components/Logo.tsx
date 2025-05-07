import { Link } from "react-router-dom";
import logoBlack from "@/assets/imgs/logo.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex justify-center items-center h-full w-full gap-2"
    >
      <div
        className="flex h-[50px] w-[50px] items-center justify-center rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${logoBlack})` }}
      />
      <span className="font-viper text-3xl pt-2 text-primary">TYTICKET</span>
    </Link>
  );
};

export default Logo;
