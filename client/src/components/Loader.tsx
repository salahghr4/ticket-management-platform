import logoBlack from "@/assets/imgs/LogoBlack.png";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-svh">
      <img
        src={logoBlack}
        alt=""
        className="w-10 animate-spin"
        style={{ animationDuration: ".5s" }}
      />
    </div>
  );
};

export default Loader;
