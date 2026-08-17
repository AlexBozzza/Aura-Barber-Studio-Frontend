import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

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

    navigate("/login");

  };


  return (

    <nav className="fixed top-0 left-0 w-full z-50">

      <div className="w-full flex items-center justify-between px-20 py-6">


        {/* LOGO */}

        <Link
          to="/"
          className="text-3xl font-bold text-white"
        >

          AuraBarberStudio

        </Link>


        {/* MENU PRINCIPAL */}

        <ul className="flex gap-10 text-white uppercase text-sm tracking-widest">


          <Link
            to="/"
            className="hover:text-yellow-500 transition duration-300"
          >

            Inicio

          </Link>


          <Link
            to="/services"
            className="hover:text-yellow-500 transition duration-300"
          >

            Servicios

          </Link>


          <Link
            to="/appointments"
            className="hover:text-yellow-500 transition duration-300"
          >

            Reservar

          </Link>


          <Link
            to="/contact"
            className="hover:text-yellow-500 transition duration-300"
          >

            Contacto

          </Link>


        </ul>


        {/* USUARIO / LOGIN */}

        {!user ? (

          // ==========================================
          // NO HAY SESIÓN
          // ==========================================

          <Link
            to="/login"
            className="border border-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-500 hover:text-black transition"
          >

            Iniciar sesión

          </Link>

        ) : (

          // ==========================================
          // USUARIO CON SESIÓN
          // ==========================================

          <div className="relative">


            {/* BOTÓN DEL USUARIO */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="border border-yellow-500 px-4 py-2 rounded-md text-white hover:bg-yellow-500 hover:text-black transition"
            >

              👤 {user.first_name}

            </button>


            {/* MENÚ DESPLEGABLE */}

            {menuOpen && (

              <div className="absolute right-0 mt-2 w-52 bg-neutral-900 border border-gray-700 rounded-md shadow-lg overflow-hidden">


                {/* NOMBRE */}

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


                {/* CLIENTE */}

                {user.role === "CLIENT" && (

                  <Link
                    to="/my-appointments"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition"
                  >

                    Mis citas

                  </Link>

                )}


                {/* BARBERO / ADMIN */}

                {(user.role === "BARBER" || user.role === "ADMIN") && (

                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition"
                  >

                    Panel administrativo

                  </Link>

                )}


                {/* PERFIL */}

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-yellow-500 hover:text-black transition"
                >

                  Mi perfil

                </Link>


                {/* CERRAR SESIÓN */}

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

    </nav>

  );

}

export default Navbar;