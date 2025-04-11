import { Link } from "react-router-dom";
import logoBlack from "@/assets/imgs/LogoBlack.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center"
    >
      <div
        className="flex h-[60px] w-[60px] items-center justify-center rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${logoBlack})` }}
      />
      <span className="font-viper text-3xl pt-2">TICTRACK</span>
    </Link>
  );
};

export default Logo;
