import logoIcon from "@/assets/imgs/logo.png";
import logoWhite from "@/assets/imgs/LogoWhite.png";
import { useTheme } from "@/hooks/useTheme";
const Loader = () => {
  const { theme } = useTheme();
  // handle system theme
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const selectedLogo = resolvedTheme === "dark" ? logoWhite : logoIcon;
  return (
    <div className="flex justify-center items-center h-svh">
      <img
        src={selectedLogo}
        alt="TYTICKET logo"
        className="w-10 animate-spin"
        style={{ animationDuration: ".5s" }}
      />
    </div>
  );
};

export default Loader;
