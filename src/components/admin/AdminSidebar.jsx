import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Citas",
      path: "/admin/appointments",
      icon: "📅",
    },
    {
      name: "Clientes",
      path: "/admin/clients",
      icon: "👥",
    },
    {
      name: "Servicios",
      path: "/admin/services",
      icon: "✂️",
    },
    {
      name: "Perfil",
      path: "/admin/profile",
      icon: "⚙️",
    },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Botón móvil */}
      <button
        type="button"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={mobileMenuOpen}
        className="lg:hidden fixed top-3 left-3 z-[70] w-11 h-11 flex items-center justify-center rounded-lg border border-[#B8860B] bg-[#181818] text-white text-2xl"
      >
        {mobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Fondo del menú móvil */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={closeMobileMenu}
          className="lg:hidden fixed inset-0 z-[55] bg-black/60"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-[#181818] border-r border-gray-800
          flex flex-col z-[60]
          transition-transform duration-200
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* LOGO */}
        <div className="px-6 py-7 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">
            AuraBarberStudio
          </h1>

          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Panel administrativo
          </p>
        </div>

        {/* MENÚ */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs text-gray-500 uppercase tracking-widest px-3 mb-4">
            Menú
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    flex items-center gap-4 px-4 py-3
                    rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#B8860B] text-white"
                        : "text-gray-400 hover:bg-[#242424] hover:text-white"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* PARTE INFERIOR */}
        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#242424] hover:text-white transition mb-2"
          >
            <span className="text-lg">🏠</span>
            <span className="font-medium">Página principal</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition"
          >
            <span className="text-lg">🚪</span>
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;