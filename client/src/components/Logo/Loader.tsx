import logoIcon from "@/assets/imgs/logo.png";
import logoWhite from "@/assets/imgs/LogoWhite.png";
import { useTheme } from "@/hooks/useTheme";
const Loader = () => {
  const { theme } = useTheme();
  return (
    <div className="flex justify-center items-center h-svh">
      <img
        src={theme === "dark" ? logoWhite : logoIcon}
        alt=""
        className="w-10 animate-spin"
        style={{ animationDuration: ".5s" }}
      />
    </div>
  );
};

export default Loader;
