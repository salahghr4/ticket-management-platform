import Logo from "@/components/Logo";
import logoIcon from "@/assets/imgs/logo.png";

const SidebarLogo = ({ sideBarOpen }: { sideBarOpen: boolean }) => {
  return sideBarOpen ? (
    <Logo />
  ) : (
    <img
      src={logoIcon}
      alt="TYTICKET logo"
    />
  );
};

export default SidebarLogo;
