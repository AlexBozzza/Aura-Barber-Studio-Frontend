import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import MyAppointments from "./pages/MyAppointments";

import AdminServices from "./components/admin/AdminServices";
import AdminAppointments from "./components/admin/AdminAppointments";
import AdminClients from "./components/admin/AdminClients";
import AdminProfile from "./components/admin/AdminProfile";

import AdminSidebar from "./components/admin/AdminSidebar";
import AdminHeader from "./components/admin/AdminHeader";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PÁGINAS PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PERFIL DEL USUARIO */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* MIS CITAS */}
      <Route
        path="/my-appointments"
        element={
          <ProtectedRoute>
            <MyAppointments />
          </ProtectedRoute>
        }
      />

      {/* DASHBOARD ADMINISTRATIVO */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="BARBER">
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      {/* CITAS ADMINISTRATIVAS */}
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute role="BARBER">
            <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#111111] text-white">
              <AdminSidebar />
              <div className="ml-0 min-w-0 w-full lg:ml-64">
                <AdminHeader />
                <main className="min-w-0 w-full p-4 sm:p-6 lg:p-8">
                  <AdminAppointments />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* CLIENTES ADMINISTRATIVOS */}
      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute role="BARBER">
            <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#111111] text-white">
              <AdminSidebar />
              <div className="ml-0 min-w-0 w-full lg:ml-64">
                <AdminHeader />
                <main className="min-w-0 w-full p-4 sm:p-6 lg:p-8">
                  <AdminClients />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* SERVICIOS ADMINISTRATIVOS */}
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute role="BARBER">
            <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#111111] text-white">
              <AdminSidebar />
              <div className="ml-0 min-w-0 w-full lg:ml-64">
                <AdminHeader />
                <main className="min-w-0 w-full p-4 sm:p-6 lg:p-8">
                  <AdminServices />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />

      {/* PERFIL ADMINISTRATIVO */}
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute role="BARBER">
            <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#111111] text-white">
              <AdminSidebar />
              <div className="ml-0 min-w-0 w-full lg:ml-64">
                <AdminHeader />
                <main className="min-w-0 w-full p-4 sm:p-6 lg:p-8">
                  <AdminProfile />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
