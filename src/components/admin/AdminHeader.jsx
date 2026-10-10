import { Link } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";

function AdminHeader() {

  const user = getCurrentUser();

  const firstName = user?.first_name || "Administrador";
  const lastName = user?.last_name || "";

  return (

    <header className="
      h-20
      bg-[#181818]
      border-b
      border-gray-800
      flex
      items-center
      justify-between
      px-8
    ">


      {/* ==========================================
          TÍTULO
      ========================================== */}

      <div>

        <h2 className="
          text-xl
          font-bold
          text-white
        ">
          Panel administrativo
        </h2>

        <p className="
          text-sm
          text-gray-500
          mt-1
        ">
          Gestiona tu barbería desde aquí
        </p>

      </div>


      {/* ==========================================
          USUARIO
      ========================================== */}

      <Link
        to="/admin/profile"
        className="
          flex
          items-center
          gap-4
          rounded-xl
          px-3
          py-2
          hover:bg-[#242424]
          transition
        "
      >

        {/* INFORMACIÓN */}

        <div className="text-right">

          <p className="
            text-white
            font-semibold
          ">
            {firstName} {lastName}
          </p>

          <p className="
            text-xs
            text-[#B8860B]
            uppercase
            tracking-wider
          ">
            Barbero / Administrador
          </p>

        </div>


        {/* AVATAR */}

        <div className="
          w-11
          h-11
          rounded-full
          bg-[#B8860B]
          flex
          items-center
          justify-center
          text-white
          font-bold
          text-lg
        ">

          {firstName.charAt(0).toUpperCase()}

        </div>

      </Link>

    </header>

  );

}

export default AdminHeader;