import { Link } from "react-router-dom";
import logoBlack from "@/assets/imgs/logo.png";
import logoWhite from "@/assets/imgs/LogoWhite.png";
import { useTheme } from "@/hooks/useTheme";
const Logo = () => {
  const { theme } = useTheme();
  // handle system theme
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const selectedLogo = resolvedTheme === "dark" ? logoWhite : logoBlack;
  
  return (
    <Link
      to="/"
      className="flex justify-center items-center h-full w-full gap-2"
    >
      <div
        className="flex h-[40px] w-[40px] items-center justify-center rounded-md bg-cover bg-center"
        style={{
          backgroundImage: `url(${selectedLogo})`,
        }}
      />
      <span className="font-viper text-3xl pt-2 text-primary dark:text-white">
        TYTICKET
      </span>
    </Link>
  );
};

export default Logo;
