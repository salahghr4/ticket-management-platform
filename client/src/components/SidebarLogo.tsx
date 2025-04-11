import Logo from "@/components/Logo";
import logoBlack from "@/assets/imgs/LogoBlack.png";

const SidebarLogo = ({ sideBarOpen }: { sideBarOpen: boolean }) => {
  return sideBarOpen ? (
    <Logo />
  ) : (
    <img
      src={logoBlack}
      alt=""
      className="w-10"
    />
  );
};

export default SidebarLogo;
