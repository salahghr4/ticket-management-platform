import { AuthProvider } from "@/context/AuthContext";
import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/Login";
import PrivateRoutes from "@/routes/PrivateRoutes";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<h1>DASHBOARD</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
