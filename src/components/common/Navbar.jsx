
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Obtener usuario guardado después del login
  const getUser = () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        return null;
      }

      return JSON.parse(user);
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  };

  const user = getUser();

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    setMobileMenuOpen(false);

    navigate("/login");
  };

  // Cerrar menú móvil al navegar
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="w-full flex items-center justify-between px-4 sm:px-8 lg:px-20 py-4 lg:py-6">

        {/* LOGO */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-white whitespace-nowrap"
        >
          AuraBarberStudio
        </Link>

        {/* MENU PRINCIPAL: PC */}
        <ul className="hidden lg:flex gap-10 text-white uppercase text-sm tracking-widest">
          <li>
            <Link
              to="/"
              className="hover:text-yellow-500 transition duration-300"
            >
              Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/services"
              className="hover:text-yellow-500 transition duration-300"
            >
              Servicios
            </Link>
          </li>

          <li>
            <Link
              to="/appointments"
              className="hover:text-yellow-500 transition duration-300"
            >
              Reservar
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="hover:text-yellow-500 transition duration-300"
            >
              Contacto
            </Link>
          </li>
        </ul>

        {/* USUARIO / LOGIN: PC */}
        <div className="hidden lg:block">
          {!user ? (
            <Link
              to="/login"
              className="border border-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-500 hover:text-black transition"
            >
              Iniciar sesión
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="border border-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-500 hover:text-black transition"
              >
                👤 {user.first_name}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-gray-700 rounded-md shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-semibold">
                      {user.first_name} {user.last_name}
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      {user.role === "CLIENT"
                        ? "Mi cuenta"
                        : "Administrador"}
                    </p>
                  </div>

                  {user.role === "CLIENT" && (
                    <Link
                      to="/my-appointments"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition"
                    >
                      Mis citas
                    </Link>
                  )}

                  {(user.role === "BARBER" || user.role === "ADMIN") && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition"
                    >
                      Panel administrativo
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition"
                  >
                    Mi perfil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTÓN HAMBURGUESA: MÓVIL */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
          className="lg:hidden flex items-center justify-center w-10 h-10 border border-yellow-500 rounded-md text-white text-2xl hover:bg-yellow-500 hover:text-black transition"
        >
          {mobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* MENU DESPLEGABLE: MÓVIL */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-t border-gray-800 shadow-lg px-5 py-4">
          <div className="flex flex-col gap-1 text-white uppercase text-sm tracking-widest">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="py-3 border-b border-gray-800 hover:text-yellow-500 transition"
            >
              Inicio
            </Link>

            <Link
              to="/services"
              onClick={closeMobileMenu}
              className="py-3 border-b border-gray-800 hover:text-yellow-500 transition"
            >
              Servicios
            </Link>

            <Link
              to="/appointments"
              onClick={closeMobileMenu}
              className="py-3 border-b border-gray-800 hover:text-yellow-500 transition"
            >
              Reservar
            </Link>

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="py-3 border-b border-gray-800 hover:text-yellow-500 transition"
            >
              Contacto
            </Link>
          </div>

          {/* ACCESO DE USUARIO: MÓVIL */}
          <div className="mt-4 pt-2 border-t border-gray-800">
            {!user ? (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block text-center border border-yellow-500 px-4 py-3 rounded-md text-white hover:bg-yellow-500 hover:text-black transition"
              >
                Iniciar sesión
              </Link>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="py-3">
                  <p className="text-white font-semibold">
                    👤 {user.first_name} {user.last_name}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {user.role === "CLIENT"
                      ? "Mi cuenta"
                      : "Administrador"}
                  </p>
                </div>

                {user.role === "CLIENT" && (
                  <Link
                    to="/my-appointments"
                    onClick={closeMobileMenu}
                    className="py-3 text-white hover:text-yellow-500 transition"
                  >
                    Mis citas
                  </Link>
                )}

                {(user.role === "BARBER" || user.role === "ADMIN") && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="py-3 text-white hover:text-yellow-500 transition"
                  >
                    Panel administrativo
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="py-3 text-white hover:text-yellow-500 transition"
                >
                  Mi perfil
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left py-3 text-red-400 hover:text-red-300 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
