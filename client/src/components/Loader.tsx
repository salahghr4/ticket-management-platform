import logoIcon from "@/assets/imgs/logo.png";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-svh">
      <img
        src={logoIcon}
        alt=""
        className="w-10 animate-spin"
        style={{ animationDuration: ".5s" }}
      />
    </div>
  );
};

export default Loader;
