import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-svh bg-background">
      <main className="flex flex-col gap-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
