import Loader from "@/components/Logo/Loader";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import PrivateRoutes from "@/routes/PrivateRoutes";
import PublicRoutes from "@/routes/PublicRoutes";
import Tickets from "@/pages/Tickets";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CreateTicket from "@/pages/CreateTicket";

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
            <Route
              path="/login"
              element={<Login />}
            />
          </Route>
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={<Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/tickets"
              element={<Tickets />}
            />
            <Route
              path="/tickets/create"
              element={<CreateTicket />}
            />
            <Route
              path="/users"
              element={<h1>USERS</h1>}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
