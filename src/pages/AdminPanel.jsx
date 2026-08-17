import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

function AdminPanel() {

  return (

    <div className="min-h-screen bg-[#111111] text-white">

      {/* SIDEBAR */}

      <AdminSidebar />


      {/* CONTENIDO PRINCIPAL */}

      <div className="ml-64">

        <AdminHeader />


        <main className="p-8">

          {/* TÍTULO */}

          <div className="mb-8">

            <h1 className="
              text-3xl
              font-bold
            ">
              Dashboard
            </h1>

            <p className="
              text-gray-400
              mt-2
            ">
              Bienvenido al panel administrativo de AuraBarberStudio.
            </p>

          </div>


          {/* ESTADÍSTICAS */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          ">


            {/* CITAS DE HOY */}

            <div className="
              bg-[#202020]
              border
              border-gray-700
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400">
                Citas de hoy
              </p>

              <h2 className="
                text-4xl
                font-bold
                text-[#B8860B]
                mt-3
              ">
                0
              </h2>

            </div>


            {/* PENDIENTES */}

            <div className="
              bg-[#202020]
              border
              border-gray-700
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400">
                Citas pendientes
              </p>

              <h2 className="
                text-4xl
                font-bold
                text-[#B8860B]
                mt-3
              ">
                0
              </h2>

            </div>


            {/* CLIENTES */}

            <div className="
              bg-[#202020]
              border
              border-gray-700
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400">
                Clientes
              </p>

              <h2 className="
                text-4xl
                font-bold
                text-[#B8860B]
                mt-3
              ">
                0
              </h2>

            </div>


            {/* SERVICIOS */}

            <div className="
              bg-[#202020]
              border
              border-gray-700
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400">
                Servicios
              </p>

              <h2 className="
                text-4xl
                font-bold
                text-[#B8860B]
                mt-3
              ">
                0
              </h2>

            </div>

          </div>


          {/* PRÓXIMAS CITAS */}

          <div className="
            mt-10
            bg-[#202020]
            border
            border-gray-700
            rounded-2xl
            p-6
          ">

            <div className="
              flex
              items-center
              justify-between
              mb-6
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                ">
                  Próximas citas
                </h2>

                <p className="
                  text-gray-400
                  mt-1
                ">
                  Resumen de las próximas reservas.
                </p>

              </div>

            </div>


            {/* POR AHORA VACÍO */}

            <div className="
              py-12
              text-center
              text-gray-500
            ">

              No hay citas para mostrar.

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

export default AdminPanel;