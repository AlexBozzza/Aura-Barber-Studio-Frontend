import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";

import AdminAppointments from "./components/admin/AdminAppointments";
import AdminClients from "./components/admin/AdminClients";

import AdminSidebar from "./components/admin/AdminSidebar";
import AdminHeader from "./components/admin/AdminHeader";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  return (

    <Routes>

      {/* ==========================================
          PÁGINAS PÚBLICAS
      ========================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/contact"
        element={<Contact />}
      />

      <Route
        path="/services"
        element={<Services />}
      />

      <Route
        path="/appointments"
        element={<Appointments />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==========================================
          PANEL ADMINISTRATIVO
      ========================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="BARBER">

            <AdminPanel />

          </ProtectedRoute>
        }
      />


      {/* ==========================================
          CITAS ADMINISTRATIVAS
      ========================================== */}

      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute role="BARBER">

            <div className="min-h-screen bg-[#111111] text-white">

              <AdminSidebar />

              <div className="ml-64">

                <AdminHeader />

                <main className="p-8">

                  <AdminAppointments />

                </main>

              </div>

            </div>

          </ProtectedRoute>
        }
      />


      {/* ==========================================
          CLIENTES ADMINISTRATIVOS
      ========================================== */}

      <Route
        path="/admin/clients"
        element={
          <ProtectedRoute role="BARBER">

            <div className="min-h-screen bg-[#111111] text-white">

              <AdminSidebar />

              <div className="ml-64">

                <AdminHeader />

                <main className="p-8">

                  <AdminClients />

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