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
import TicketDetails from "@/pages/TicketDetails";
import ProtectedEditTicket from "@/components/Ticket/ProtectedEditTicket";
import Users from "@/pages/Users";
import AdminRoutes from "@/routes/AdminRoutes";
import CreateUser from "@/pages/CreateUser";
import EditUser from "@/pages/EditUser";
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
            <Route path="/" element={<Navigate to="/dashboard" />}/>
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/tickets" element={<Tickets />}/>
            <Route path="/tickets/create" element={<CreateTicket />}/>
            <Route path="/tickets/:id" element={<TicketDetails />}/>
            <Route path="/tickets/:id/edit" element={<ProtectedEditTicket />}/>
            <Route path="/users" element={<Users />}/>
            <Route element={<AdminRoutes />}>
              <Route path="/admin/users/create" element={<CreateUser />}/>
              <Route path="/admin/users/:id/edit" element={<EditUser />}/>
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
