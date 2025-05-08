import { Link } from "react-router-dom";
import logoBlack from "@/assets/imgs/logo.png";
import logoWhite from "@/assets/imgs/LogoWhite.png";
import { useTheme } from "@/hooks/useTheme";
const Logo = () => {
  const { theme } = useTheme();
  return (
    <Link
      to="/"
      className="flex justify-center items-center h-full w-full gap-2"
    >
      <div
        className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-cover bg-center"
        style={{
          backgroundImage: `url(${theme === "dark" ? logoWhite : logoBlack})`,
        }}
      />
      <span className="font-viper text-3xl pt-2 text-primary dark:text-white">
        TYTICKET
      </span>
    </Link>
  );
};

export default Logo;
