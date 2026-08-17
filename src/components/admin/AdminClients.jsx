import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminClients() {

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ==========================================
  // OBTENER CLIENTES
  // ==========================================

  const loadClients = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get("/users");

      const users = response.data.data || [];

      const onlyClients = users.filter(
        (user) => user.role === "CLIENT"
      );

      setClients(onlyClients);

    } catch (error) {

      console.error("Error obteniendo clientes:", error);

      setError(
        error.response?.data?.message ||
        "No se pudieron cargar los clientes."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CARGAR AL ENTRAR
  // ==========================================

  useEffect(() => {

    loadClients();

  }, []);


  // ==========================================
  // BUSCAR CLIENTES
  // ==========================================

  const filteredClients = clients.filter((client) => {

    const fullName = (
      `${client.first_name || ""} ${client.last_name || ""}`
    ).toLowerCase();

    const email = (
      client.email || ""
    ).toLowerCase();

    const phone = (
      client.phone || ""
    ).toLowerCase();

    const searchValue = search.toLowerCase();

    return (
      fullName.includes(searchValue) ||
      email.includes(searchValue) ||
      phone.includes(searchValue)
    );

  });


  // ==========================================
  // INICIAL DEL CLIENTE
  // ==========================================

  const getInitial = (client) => {

    return (
      client.first_name?.charAt(0) || "?"
    ).toUpperCase();

  };


  // ==========================================
  // FECHA
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "es-CR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="space-y-8">

      {/* ==========================================
          ENCABEZADO
      ========================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-[#B8860B] text-sm font-semibold uppercase tracking-widest">
            Administración
          </p>

          <h1 className="text-3xl font-bold text-white mt-1">
            Clientes
          </h1>

          <p className="text-gray-400 mt-2">
            Gestiona los clientes registrados en AuraBarberStudio.
          </p>

        </div>


        <button
          onClick={loadClients}
          disabled={loading}
          className="px-5 py-3 rounded-xl border border-gray-700 bg-[#181818] text-gray-300 hover:bg-[#242424] hover:text-white transition disabled:opacity-50"
        >
          🔄 Actualizar
        </button>

      </div>


      {/* ==========================================
          ESTADÍSTICAS
      ========================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* TOTAL */}

        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

          <p className="text-gray-400">
            Total de clientes
          </p>

          <h2 className="text-4xl font-bold text-[#B8860B] mt-3">
            {clients.length}
          </h2>

        </div>


        {/* ACTIVOS */}

        <div className="bg-[#202020] border border-gray-700 rounded-2xl p-6">

          <p className="text-gray-400">
            Clientes activos
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-3">

            {
              clients.filter(
                (client) => client.is_active === 1
              ).length
            }

          </h2>

        </div>

      </div>


      {/* ==========================================
          BUSCADOR
      ========================================== */}

      <div className="bg-[#202020] border border-gray-700 rounded-2xl p-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-lg font-semibold text-white">
              Lista de clientes
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Busca por nombre, correo o teléfono.
            </p>

          </div>


          <div className="relative w-full md:w-80">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full bg-[#181818] border border-gray-700 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none focus:border-[#B8860B] transition"
            />

          </div>

        </div>

      </div>


      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (

        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400">
          {error}
        </div>

      )}


      {/* ==========================================
          TABLA
      ========================================== */}

      <div className="bg-[#202020] border border-gray-700 rounded-2xl overflow-hidden">

        {/* CABECERA */}

        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#181818] border-b border-gray-700 text-xs text-gray-500 uppercase tracking-wider">

          <div className="col-span-3">
            Cliente
          </div>

          <div className="col-span-3">
            Email
          </div>

          <div className="col-span-2">
            Teléfono
          </div>

          <div className="col-span-2">
            Registro
          </div>

          <div className="col-span-2">
            Estado
          </div>

        </div>


        {/* CARGANDO */}

        {loading && (

          <div className="py-16 text-center text-gray-500">
            Cargando clientes...
          </div>

        )}


        {/* SIN CLIENTES */}

        {!loading && filteredClients.length === 0 && (

          <div className="py-16 text-center">

            <div className="text-4xl mb-3">
              👥
            </div>

            <p className="text-gray-400">

              {search
                ? "No se encontraron clientes."
                : "No hay clientes registrados."
              }

            </p>

          </div>

        )}


        {/* CLIENTES */}

        {!loading && filteredClients.length > 0 && (

          <div>

            {filteredClients.map((client) => (

              <div
                key={client.id}
                className="grid grid-cols-12 gap-4 items-center px-6 py-5 border-b border-gray-700 last:border-b-0 hover:bg-[#242424] transition"
              >

                {/* CLIENTE */}

                <div className="col-span-3 flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/30 flex items-center justify-center text-[#B8860B] font-semibold">
                    {getInitial(client)}
                  </div>


                  <div>

                    <p className="text-white font-semibold">
                      {client.first_name} {client.last_name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Cliente #{client.id}
                    </p>

                  </div>

                </div>


                {/* EMAIL */}

                <div className="col-span-3 text-gray-300 truncate">
                  {client.email || "Sin correo"}
                </div>


                {/* TELÉFONO */}

                <div className="col-span-2 text-gray-300">
                  {client.phone || "Sin teléfono"}
                </div>


                {/* REGISTRO */}

                <div className="col-span-2 text-gray-400 text-sm">
                  {formatDate(client.created_at)}
                </div>


                {/* ESTADO */}

                <div className="col-span-2">

                  {client.is_active === 1 ? (

                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-900/20 border border-green-700/50 text-green-400 text-sm font-medium">

                      <span className="w-2 h-2 rounded-full bg-green-400" />

                      Activo

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-900/20 border border-red-700/50 text-red-400 text-sm font-medium">

                      <span className="w-2 h-2 rounded-full bg-red-400" />

                      Inactivo

                    </span>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* ==========================================
          RESULTADOS
      ========================================== */}

      {!loading && filteredClients.length > 0 && (

        <p className="text-sm text-gray-500 text-right">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </p>

      )}

    </div>

  );

}

export default AdminClients;