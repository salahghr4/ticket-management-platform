import { Link } from "react-router-dom";
import logoBlack from "@/assets/imgs/LogoBlack.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex justify-center items-center"
    >
      <img
        src={logoBlack}
        alt="TicTrack logo with a triangle icon"
        className="w-[90%]"
      />
    </Link>
  );
};

export default Logo;
