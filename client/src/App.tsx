import Loader from "@/components/Logo/Loader";
import ProtectedEditTicket from "@/components/Ticket/ProtectedEditTicket";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import CreateTicket from "@/pages/CreateTicket";
import CreateUser from "@/pages/CreateUser";
import Dashboard from "@/pages/Dashboard";
import Departments from "@/pages/Departments";
import EditUser from "@/pages/EditUser";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import TicketDetails from "@/pages/TicketDetails";
import TicketsAll from "@/pages/TicketsAll";
import TicketsAssigned from "@/pages/TicketsAssigned";
import TicketsCreated from "@/pages/TicketsCreated";
import Users from "@/pages/Users";
import AdminRoutes from "@/routes/AdminRoutes";
import PrivateRoutes from "@/routes/PrivateRoutes";
import PublicRoutes from "@/routes/PublicRoutes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
            <Route path="/tickets" element={<Navigate to="/tickets/all" />}/>
            <Route path="/tickets/all" element={<TicketsAll />}/>
            <Route path="/tickets/assigned" element={<TicketsAssigned />}/>
            <Route path="/tickets/created" element={<TicketsCreated />}/>
            <Route path="/tickets/create" element={<CreateTicket />}/>
            <Route path="/tickets/:id" element={<TicketDetails />}/>
            <Route path="/tickets/:id/edit" element={<ProtectedEditTicket />}/>
            <Route path="/users" element={<Users />}/>
            <Route path="/departments" element={<Departments />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route element={<AdminRoutes />}>
              <Route path="/admin/users/create" element={<CreateUser />}/>
              <Route path="/admin/users/:id/edit" element={<EditUser />}/>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
