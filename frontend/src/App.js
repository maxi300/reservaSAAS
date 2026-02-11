import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardCliente from "./pages/DashboardCliente";
import DashboardNegocio from "./pages/DashboardNegocio";
import DashboardAdmin from "./pages/DashboardAdmin";
import ClientLayout from "./components/ClientLayout";
import { ROUTES } from "./routes";

// Componente para proteger rutas según rol
function ProtectedRoute({ children, allowedRoles, rol, token }) {
  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(rol)) return <Navigate to="/" />;
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [rol, setRol] = useState(localStorage.getItem("rol"));


  // Cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    setToken(null);
    setRol(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} setRol={setRol} />} />
        <Route
          path="/dashboard/cliente"
          element={
            <ProtectedRoute allowedRoles={["cliente"]} rol={rol} token={token}>
              <ClientLayout onLogout={handleLogout}>
                <DashboardCliente onLogout={handleLogout} />
              </ClientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/negocio"
          element={
            <ProtectedRoute allowedRoles={["negocio"]} rol={rol} token={token}>
              <DashboardNegocio onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]} rol={rol} token={token}>
              <DashboardAdmin onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        {/* Redirección automática al dashboard según rol */}
        <Route
          path="/"
          element={token ? (
            rol === "cliente" ? <Navigate to={ROUTES.DASHBOARD_CLIENT} /> :
            rol === "negocio" ? <Navigate to={ROUTES.DASHBOARD_NEGOCIO} /> :
            rol === "admin" ? <Navigate to={ROUTES.DASHBOARD_ADMIN} /> :
            <Navigate to={ROUTES.LOGIN} />
          ) : (
            <Navigate to={ROUTES.LOGIN} />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;