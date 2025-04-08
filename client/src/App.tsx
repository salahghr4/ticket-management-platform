import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
