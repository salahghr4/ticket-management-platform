import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/Login";
import PrivateRoutes from "@/routes/PrivateRoutes";
import PublicRoutes from "@/routes/PublicRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<h1>DASHBOARD</h1>} />
            </Route>
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
