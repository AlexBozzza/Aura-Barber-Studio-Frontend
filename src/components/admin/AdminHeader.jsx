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
      gap-2
      px-3
      sm:px-5
      lg:px-8
      min-w-0
    ">
      {/* TÍTULO */}
      <div className="min-w-0 flex-1">
        <h2 className="
          text-base
          sm:text-lg
          lg:text-xl
          font-bold
          text-white
          truncate
        ">
          Panel administrativo
        </h2>

        <p className="
          text-xs
          sm:text-sm
          text-gray-500
          mt-1
          truncate
        ">
          Gestiona tu barbería desde aquí
        </p>
      </div>

      {/* USUARIO */}
      <Link
        to="/admin/profile"
        className="
          flex
          items-center
          gap-2
          sm:gap-4
          rounded-xl
          px-1
          sm:px-3
          py-2
          hover:bg-[#242424]
          transition
          shrink-0
          max-w-[48%]
          lg:max-w-none
        "
      >
        {/* INFORMACIÓN */}
        <div className="text-right min-w-0">
          <p className="
            text-white
            font-semibold
            text-xs
            sm:text-sm
            lg:text-base
            truncate
          ">
            {firstName} {lastName}
          </p>

          <p className="
            text-[9px]
            sm:text-[10px]
            lg:text-xs
            text-[#B8860B]
            uppercase
            tracking-wide
            sm:tracking-wider
            truncate
          ">
            Barbero / Administrador
          </p>
        </div>

        {/* AVATAR */}
        <div className="
          w-9
          h-9
          sm:w-11
          sm:h-11
          rounded-full
          bg-[#B8860B]
          flex
          items-center
          justify-center
          text-white
          font-bold
          text-base
          sm:text-lg
          shrink-0
        ">
          {firstName.charAt(0).toUpperCase()}
        </div>
      </Link>
    </header>
  );
}

export default AdminHeader;