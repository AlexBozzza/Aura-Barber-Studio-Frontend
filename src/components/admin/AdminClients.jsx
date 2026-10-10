import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminClients() {

  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [selectedClient, setSelectedClient] = useState(null);


  // ==========================================
  // OBTENER CLIENTES Y CITAS
  // ==========================================

  const loadClients = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        usersResponse,
        appointmentsResponse
      ] = await Promise.all([
        api.get("/users"),
        api.get("/appointments")
      ]);


      const users =
        usersResponse.data.data || [];

      const allAppointments =
        appointmentsResponse.data.data || [];


      const onlyClients = users.filter(
        (user) => user.role === "CLIENT"
      );


      setClients(onlyClients);
      setAppointments(allAppointments);

    } catch (error) {

      console.error(
        "Error obteniendo clientes:",
        error
      );

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
  // FECHA COMPLETA
  // ==========================================

  const formatLongDate = (date) => {

    if (!date) {
      return "—";
    }

    try {

      const cleanDate =
        String(date).substring(0, 10);

      const [
        year,
        month,
        day
      ] = cleanDate.split("-");


      const localDate = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );


      return localDate.toLocaleDateString(
        "es-CR",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        }
      );

    } catch {

      return "—";

    }

  };


  // ==========================================
  // HORA
  // ==========================================

  const formatTime = (time) => {

    if (!time) {
      return "—";
    }

    try {

      const [
        hours,
        minutes
      ] = String(time)
        .substring(0, 5)
        .split(":")
        .map(Number);


      const date = new Date();

      date.setHours(
        hours,
        minutes,
        0,
        0
      );


      return date.toLocaleTimeString(
        "es-CR",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }
      );

    } catch {

      return "—";

    }

  };

  // ==========================================
// DURACIÓN DE LA CITA
// ==========================================

const formatDuration = (startTime, endTime) => {

  if (!startTime || !endTime) {
    return "—";
  }

  try {

    const startParts = String(startTime)
      .substring(0, 8)
      .split(":")
      .map(Number);

    const endParts = String(endTime)
      .substring(0, 8)
      .split(":")
      .map(Number);


    const startMinutes =
      startParts[0] * 60 +
      startParts[1] +
      (startParts[2] || 0) / 60;


    const endMinutes =
      endParts[0] * 60 +
      endParts[1] +
      (endParts[2] || 0) / 60;


    let duration =
      endMinutes - startMinutes;


    if (duration < 0) {
      duration += 24 * 60;
    }


    duration = Math.round(duration);


    if (duration <= 0) {
      return "—";
    }


    if (duration < 60) {
      return `${duration} min`;
    }


    const hours =
      Math.floor(duration / 60);

    const minutes =
      duration % 60;


    if (minutes === 0) {

      return hours === 1
        ? "1 hora"
        : `${hours} horas`;

    }


    return `${hours} h ${minutes} min`;

  } catch {

    return "—";

  }

};


  // ==========================================
  // FECHA Y HORA DE LA CITA
  // ==========================================

  const getAppointmentDateTime = (
    appointment
  ) => {

    if (
      !appointment?.appointment_date ||
      !appointment?.start_time
    ) {

      return null;

    }


    try {

      const cleanDate =
        String(
          appointment.appointment_date
        ).substring(0, 10);


      const [
        year,
        month,
        day
      ] = cleanDate.split("-");


      const [
        hours,
        minutes,
        seconds = 0
      ] = String(
        appointment.start_time
      )
        .substring(0, 8)
        .split(":")
        .map(Number);


      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        Number(seconds)
      );

    } catch {

      return null;

    }

  };


  // ==========================================
  // OBTENER CITAS DEL CLIENTE
  // ==========================================

  const getClientAppointments = (
    clientId
  ) => {

    return appointments
      .filter(
        (appointment) =>
          Number(appointment.user_id) ===
          Number(clientId)
      )
      .sort((a, b) => {

        const dateA =
          getAppointmentDateTime(a);

        const dateB =
          getAppointmentDateTime(b);


        if (!dateA && !dateB) {
          return 0;
        }

        if (!dateA) {
          return 1;
        }

        if (!dateB) {
          return -1;
        }

        return dateA - dateB;

      });

  };


  // ==========================================
  // INFORMACIÓN DE CITAS DEL CLIENTE
  // ==========================================

  const getClientAppointmentInfo = (
    clientId
  ) => {

    const clientAppointments =
      getClientAppointments(clientId);


    const now = new Date();


    const previousAppointments =
      clientAppointments.filter(
        (appointment) => {

          const appointmentDate =
            getAppointmentDateTime(
              appointment
            );


          return (
            appointmentDate &&
            appointmentDate < now
          );

        }
      );


    const futureAppointments =
      clientAppointments.filter(
        (appointment) => {

          const appointmentDate =
            getAppointmentDateTime(
              appointment
            );


          return (
            appointmentDate &&
            appointmentDate >= now &&
            appointment.status !== "CANCELLED" &&
            appointment.status !== "COMPLETED"
          );

        }
      );


    const lastAppointment =
      previousAppointments.length > 0
        ? previousAppointments[
            previousAppointments.length - 1
          ]
        : null;


    const nextAppointment =
      futureAppointments.length > 0
        ? futureAppointments[0]
        : null;


    return {
      total: clientAppointments.length,
      lastAppointment,
      nextAppointment
    };

  };


  // ==========================================
  // ESTADO DE LA CITA
  // ==========================================

  const getAppointmentStatus = (
    status
  ) => {

    switch (status) {

      case "PENDING":

        return {
          label: "Pendiente",
          className:
            "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
        };


      case "CONFIRMED":

        return {
          label: "Confirmada",
          className:
            "bg-green-500/10 border-green-500/30 text-green-400"
        };


      case "COMPLETED":

        return {
          label: "Completada",
          className:
            "bg-blue-500/10 border-blue-500/30 text-blue-400"
        };


      case "CANCELLED":

        return {
          label: "Cancelada",
          className:
            "bg-red-500/10 border-red-500/30 text-red-400"
        };


      default:

        return {
          label: status || "Desconocido",
          className:
            "bg-gray-500/10 border-gray-500/30 text-gray-400"
        };

    }

  };


  // ==========================================
  // ABRIR DETALLE DEL CLIENTE
  // ==========================================

  const openClientDetails = (client) => {

    setSelectedClient(client);

  };


  // ==========================================
  // CERRAR DETALLE
  // ==========================================

  const closeClientDetails = () => {

    setSelectedClient(null);

  };


  // ==========================================
  // INFORMACIÓN DEL CLIENTE SELECCIONADO
  // ==========================================

  const selectedClientInfo =
    selectedClient
      ? getClientAppointmentInfo(
          selectedClient.id
        )
      : null;


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
                onClick={() =>
                  openClientDetails(client)
                }
                className="grid grid-cols-12 gap-4 items-center px-6 py-5 border-b border-gray-700 last:border-b-0 hover:bg-[#242424] transition cursor-pointer"
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


      {/* ==========================================
          MODAL DETALLE DEL CLIENTE
      ========================================== */}

      {selectedClient && (

        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {

              closeClientDetails();

            }

          }}
        >

          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#202020] border border-gray-700 rounded-2xl shadow-2xl">


            {/* HEADER */}

            <div className="sticky top-0 z-10 bg-[#202020] border-b border-gray-800 px-6 py-5 flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/30 flex items-center justify-center text-[#B8860B] text-xl font-bold">

                  {getInitial(selectedClient)}

                </div>


                <div>

                  <p className="text-xs text-[#B8860B] uppercase tracking-wider font-semibold">
                    Detalle del cliente
                  </p>

                  <h2 className="text-xl font-bold text-white mt-1">

                    {selectedClient.first_name}{" "}
                    {selectedClient.last_name}

                  </h2>

                </div>

              </div>


              <button
                type="button"
                onClick={closeClientDetails}
                className="w-10 h-10 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition text-xl"
              >
                ×
              </button>

            </div>


            {/* CONTENIDO */}

            <div className="p-6 space-y-6">


              {/* ==========================================
                  INFORMACIÓN PERSONAL
              ========================================== */}

              <div>

                <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">
                  Información personal
                </h3>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                  {/* NOMBRE */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Nombre completo
                    </p>

                    <p className="text-white font-medium mt-2">

                      {selectedClient.first_name}{" "}
                      {selectedClient.last_name}

                    </p>

                  </div>


                  {/* CORREO */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Correo electrónico
                    </p>

                    <p className="text-gray-300 font-medium mt-2 break-all">

                      {selectedClient.email ||
                        "Sin correo"}

                    </p>

                  </div>


                  {/* TELÉFONO */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Teléfono
                    </p>

                    <p className="text-gray-300 font-medium mt-2">

                      {selectedClient.phone ||
                        "Sin teléfono"}

                    </p>

                  </div>


                  {/* FECHA REGISTRO */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Fecha de registro
                    </p>

                    <p className="text-gray-300 font-medium mt-2 capitalize">

                      {formatLongDate(
                        selectedClient.created_at
                      )}

                    </p>

                  </div>


                  {/* ESTADO */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Estado de la cuenta
                    </p>


                    <div className="mt-2">

                      {selectedClient.is_active === 1 ? (

                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-900/20 border border-green-700/50 text-green-400 text-sm font-medium">

                          <span className="w-2 h-2 rounded-full bg-green-400" />

                          Activo

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/20 border border-red-700/50 text-red-400 text-sm font-medium">

                          <span className="w-2 h-2 rounded-full bg-red-400" />

                          Inactivo

                        </span>

                      )}

                    </div>

                  </div>


                  {/* TOTAL CITAS */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Cantidad total de citas
                    </p>

                    <p className="text-3xl text-[#B8860B] font-bold mt-2">

                      {selectedClientInfo?.total || 0}

                    </p>

                  </div>

                </div>

              </div>


              {/* ==========================================
                  ÚLTIMA Y PRÓXIMA CITA
              ========================================== */}

              <div>

                <h3 className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-4">
                  Actividad de citas
                </h3>


                <div className="space-y-4">


                  {/* ÚLTIMA CITA */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-5">

                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Última cita
                    </p>


                    {selectedClientInfo?.lastAppointment ? (

                      <>

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-3">

                          <div>

                            <h4 className="text-lg font-semibold text-white">

                              {
                                selectedClientInfo.lastAppointment
                                  .service_name ||
                                "Servicio"
                              }

                            </h4>

                          </div>


                          {(() => {

                            const status =
                              getAppointmentStatus(
                                selectedClientInfo
                                  .lastAppointment
                                  .status
                              );


                            return (

                              <span className={`
                                inline-flex
                                items-center
                                px-3
                                py-1.5
                                rounded-lg
                                border
                                text-xs
                                font-semibold
                                ${status.className}
                              `}>
                                {status.label}
                              </span>

                            );

                          })()}

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">


                          <div>

                            <p className="text-xs text-gray-500">
                              Fecha
                            </p>

                            <p className="text-gray-300 mt-1 capitalize">

                              {formatLongDate(
                                selectedClientInfo
                                  .lastAppointment
                                  .appointment_date
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Hora
                            </p>

                            <p className="text-gray-300 mt-1">

                              {formatTime(
                                selectedClientInfo
                                  .lastAppointment
                                  .start_time
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Barbero
                            </p>

                            <p className="text-gray-300 mt-1">

                              {
                                selectedClientInfo
                                  .lastAppointment
                                  .barber_first_name &&
                                selectedClientInfo
                                  .lastAppointment
                                  .barber_last_name

                                  ? `${selectedClientInfo.lastAppointment.barber_first_name} ${selectedClientInfo.lastAppointment.barber_last_name}`

                                  : "Sin barbero asignado"
                              }

                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Duración
                            </p>

                            <p className="text-gray-300 mt-1">

                              {formatDuration(
                             selectedClientInfo
                             .lastAppointment
                             .start_time,

                            selectedClientInfo
                            .lastAppointment
                             .end_time
                            )}

                            </p>

                          </div>

                        </div>

                      </>

                    ) : (

                      <p className="text-gray-500 mt-3">
                        Este cliente todavía no tiene citas anteriores.
                      </p>

                    )}

                  </div>


                  {/* PRÓXIMA CITA */}

                  <div className="bg-[#181818] border border-gray-800 rounded-xl p-5">

                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Próxima cita
                    </p>


                    {selectedClientInfo?.nextAppointment ? (

                      <>

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-3">

                          <div>

                            <h4 className="text-lg font-semibold text-white">

                              {
                                selectedClientInfo
                                  .nextAppointment
                                  .service_name ||
                                "Servicio"
                              }

                            </h4>

                          </div>


                          {(() => {

                            const status =
                              getAppointmentStatus(
                                selectedClientInfo
                                  .nextAppointment
                                  .status
                              );


                            return (

                              <span className={`
                                inline-flex
                                items-center
                                px-3
                                py-1.5
                                rounded-lg
                                border
                                text-xs
                                font-semibold
                                ${status.className}
                              `}>
                                {status.label}
                              </span>

                            );

                          })()}

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">


                          <div>

                            <p className="text-xs text-gray-500">
                              Fecha
                            </p>

                            <p className="text-gray-300 mt-1 capitalize">

                              {formatLongDate(
                                selectedClientInfo
                                  .nextAppointment
                                  .appointment_date
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Hora
                            </p>

                            <p className="text-gray-300 mt-1">

                              {formatTime(
                                selectedClientInfo
                                  .nextAppointment
                                  .start_time
                              )}

                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Barbero
                            </p>

                            <p className="text-gray-300 mt-1">

                              {
                                selectedClientInfo
                                  .nextAppointment
                                  .barber_first_name &&
                                selectedClientInfo
                                  .nextAppointment
                                  .barber_last_name

                                  ? `${selectedClientInfo.nextAppointment.barber_first_name} ${selectedClientInfo.nextAppointment.barber_last_name}`

                                  : "Sin barbero asignado"
                              }

                            </p>

                          </div>


                          <div>

                            <p className="text-xs text-gray-500">
                              Duración
                            </p>

                            <p className="text-gray-300 mt-1">

                               {formatDuration(
                             selectedClientInfo
                              .nextAppointment
                             .start_time,

                              selectedClientInfo
                             .nextAppointment
                            .end_time
                              )}

                            </p>

                          </div>

                        </div>

                      </>

                    ) : (

                      <p className="text-gray-500 mt-3">
                        Este cliente no tiene próximas citas.
                      </p>

                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* FOOTER */}

            <div className="px-6 py-4 border-t border-gray-800 flex justify-end">

              <button
                type="button"
                onClick={closeClientDetails}
                className="px-5 py-3 rounded-xl bg-[#B8860B] text-black font-semibold hover:bg-[#d09b16] transition"
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminClients;