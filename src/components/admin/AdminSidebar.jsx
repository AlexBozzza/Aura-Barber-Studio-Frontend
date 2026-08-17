import { Link, useLocation } from "react-router-dom";

function AdminSidebar() {

  const location = useLocation();


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


  return (

    <aside className="
      fixed
      top-0
      left-0
      h-screen
      w-64
      bg-[#181818]
      border-r
      border-gray-800
      flex
      flex-col
      z-50
    ">


      {/* ==========================================
          LOGO
      ========================================== */}

      <div className="
        px-6
        py-7
        border-b
        border-gray-800
      ">

        <h1 className="
          text-xl
          font-bold
          text-white
        ">
          AuraBarberStudio
        </h1>


        <p className="
          text-xs
          text-gray-500
          mt-1
          uppercase
          tracking-wider
        ">
          Panel administrativo
        </p>

      </div>


      {/* ==========================================
          MENÚ
      ========================================== */}

      <nav className="
        flex-1
        px-4
        py-6
      ">

        <p className="
          text-xs
          text-gray-500
          uppercase
          tracking-widest
          px-3
          mb-4
        ">
          Menú
        </p>


        <div className="space-y-2">

          {menuItems.map((item) => {

            const isActive =
              location.pathname === item.path;


            return (

              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex
                  items-center
                  gap-4
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-[#B8860B] text-white"
                      : "text-gray-400 hover:bg-[#242424] hover:text-white"
                  }
                `}
              >

                <span className="text-lg">
                  {item.icon}
                </span>


                <span className="
                  font-medium
                ">
                  {item.name}
                </span>

              </Link>

            );

          })}

        </div>

      </nav>


      {/* ==========================================
          PARTE INFERIOR
      ========================================== */}

      <div className="
        p-4
        border-t
        border-gray-800
      ">

        <button
          onClick={() => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/login";

          }}
          className="
            w-full
            flex
            items-center
            gap-4
            px-4
            py-3
            rounded-xl
            text-gray-400
            hover:bg-red-900/20
            hover:text-red-400
            transition
          "
        >

          <span className="text-lg">
            🚪
          </span>

          <span className="font-medium">
            Cerrar sesión
          </span>

        </button>

      </div>


    </aside>

  );

}

export default AdminSidebar;