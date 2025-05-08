import Logo from "@/components/Logo/Logo";
import logoIcon from "@/assets/imgs/logo.png";
import logoWhite from "@/assets/imgs/LogoWhite.png";
import { useTheme } from "@/hooks/useTheme";

const SidebarLogo = ({ sideBarOpen }: { sideBarOpen: boolean }) => {
  const { theme } = useTheme();
  // handle system theme
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const selectedLogo = resolvedTheme === "dark" ? logoWhite : logoIcon;
  return sideBarOpen ? (
    <Logo />
  ) : (
    <img
      src={selectedLogo}
      alt="TYTICKET logo"
    />
  );
};

export default SidebarLogo;
