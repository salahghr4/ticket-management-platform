import Logo from "@/components/Logo";
import logoIcon from "@/assets/imgs/LogoIcon.png";

const SidebarLogo = ({ sideBarOpen }: { sideBarOpen: boolean }) => {
  return sideBarOpen ? (
    <Logo />
  ) : (
    <img
      src={logoIcon}
      alt="Tictrak triangle icon logo"
    />
  );
};

export default SidebarLogo;
