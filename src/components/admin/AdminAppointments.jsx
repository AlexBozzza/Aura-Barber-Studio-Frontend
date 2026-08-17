import { useEffect, useMemo, useState } from "react";

import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../../services/appointmentService";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";


function AdminAppointments() {

  // ==========================================
  // FECHA DE HOY
  // ==========================================

  const getToday = () => {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  };


  const [appointments, setAppointments] =
    useState([]);

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // OBTENER CITAS
  // ==========================================

  const loadAppointments = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getAppointments();

      setAppointments(data);

    } catch (error) {

      console.error(
        "Error obteniendo citas:",
        error
      );

      setError(
        error.response?.data?.message ||
        "No fue posible obtener las citas."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadAppointments();

  }, []);


  // ==========================================
  // CAMBIAR ESTADO
  // ==========================================

  const handleStatusChange = async (
    id,
    status
  ) => {

    try {

      await updateAppointmentStatus(
        id,
        status
      );

      await loadAppointments();

    } catch (error) {

      console.error(
        "Error actualizando estado:",
        error
      );

      alert(
        error.response?.data?.message ||
        "No fue posible actualizar el estado."
      );

    }

  };


  // ==========================================
  // ELIMINAR CITA
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "¿Estás seguro de que deseas eliminar esta cita?"
      );

    if (!confirmDelete) return;


    try {

      await deleteAppointment(id);

      await loadAppointments();

    } catch (error) {

      console.error(
        "Error eliminando cita:",
        error
      );

      alert(
        error.response?.data?.message ||
        "No fue posible eliminar la cita."
      );

    }

  };


  // ==========================================
  // FORMATEAR FECHA
  // ==========================================

  const formatDate = (date) => {

    if (!date) return "—";

    try {

      const cleanDate =
        date.substring(0, 10);

      const [
        year,
        month,
        day
      ] = cleanDate.split("-");


      const localDate =
        new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        );


      return localDate.toLocaleDateString(
        "es-CR",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {

      return "—";

    }

  };


  // ==========================================
  // FECHA SELECCIONADA EN TEXTO
  // ==========================================

  const formatSelectedDate = () => {

    if (!selectedDate) return "";

    const [
      year,
      month,
      day
    ] = selectedDate.split("-");


    const date =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );


    return date.toLocaleDateString(
      "es-CR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // CITAS DE LA FECHA SELECCIONADA
  // ==========================================

  const filteredAppointments =
    useMemo(() => {

      return appointments
        .filter(
          (appointment) =>
            appointment.appointment_date
              ?.substring(0, 10) ===
            selectedDate
        )
        .sort((a, b) => {

          return (
            a.start_time.localeCompare(
              b.start_time
            )
          );

        });

    }, [
      appointments,
      selectedDate
    ]);


  // ==========================================
  // ESTADÍSTICAS DEL DÍA
  // ==========================================

  const pendingAppointments =
    filteredAppointments.filter(
      (appointment) =>
        appointment.status === "PENDING"
    ).length;


  const confirmedAppointments =
    filteredAppointments.filter(
      (appointment) =>
        appointment.status === "CONFIRMED"
    ).length;


  const completedAppointments =
    filteredAppointments.filter(
      (appointment) =>
        appointment.status === "COMPLETED"
    ).length;


  const cancelledAppointments =
    filteredAppointments.filter(
      (appointment) =>
        appointment.status === "CANCELLED"
    ).length;


  // ==========================================
  // ESTADO
  // ==========================================

  const getStatusStyle = (status) => {

    switch (status) {

      case "PENDING":

        return `
          bg-yellow-500/10
          text-yellow-400
          border-yellow-500/30
        `;


      case "CONFIRMED":

        return `
          bg-green-500/10
          text-green-400
          border-green-500/30
        `;


      case "COMPLETED":

        return `
          bg-blue-500/10
          text-blue-400
          border-blue-500/30
        `;


      case "CANCELLED":

        return `
          bg-red-500/10
          text-red-400
          border-red-500/30
        `;


      default:

        return `
          bg-gray-500/10
          text-gray-400
          border-gray-500/30
        `;

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-[#111111]
        flex
        items-center
        justify-center
      ">

        <div className="text-center">

          <div className="
            w-10
            h-10
            border-4
            border-gray-700
            border-t-[#B8860B]
            rounded-full
            animate-spin
            mx-auto
          " />

          <p className="
            text-gray-400
            mt-4
          ">
            Cargando agenda...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // INTERFAZ
  // ==========================================

  return (

    <div className="
      min-h-screen
      bg-[#111111]
      text-white
      flex
    ">


      {/* SIDEBAR */}

      <AdminSidebar />


      {/* CONTENIDO */}

      <div className="
        flex-1
        min-w-0
      ">


        {/* HEADER */}

        <AdminHeader />


        <main className="
          p-6
          lg:p-8
        ">


          {/* ==========================================
              CABECERA
          ========================================== */}

          <div className="
            flex
            flex-col
            xl:flex-row
            xl:items-end
            xl:justify-between
            gap-6
            mb-8
          ">


            <div>

              <p className="
                text-[#B8860B]
                text-sm
                font-semibold
                uppercase
                tracking-wider
                mb-2
              ">
                Administración
              </p>


              <h1 className="
                text-3xl
                lg:text-4xl
                font-bold
              ">
                Agenda de citas
              </h1>


              <p className="
                text-gray-400
                mt-2
              ">
                Consulta y administra las reservas
                de tus clientes.
              </p>

            </div>


            {/* ==========================================
                SELECTOR DE FECHA
            ========================================== */}

            <div className="
              flex
              flex-col
              sm:flex-row
              gap-3
            ">


              <div>

                <label className="
                  block
                  text-xs
                  text-gray-500
                  uppercase
                  tracking-wider
                  mb-2
                ">
                  Ver agenda del día
                </label>


                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                  className="
                    bg-[#202020]
                    border
                    border-gray-700
                    rounded-xl
                    px-4
                    py-3
                    text-white
                    focus:outline-none
                    focus:border-[#B8860B]
                    cursor-pointer
                  "
                />

              </div>


              <button
                onClick={() =>
                  setSelectedDate(
                    getToday()
                  )
                }
                className="
                  self-end
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#202020]
                  text-gray-300
                  hover:border-[#B8860B]
                  hover:text-[#B8860B]
                  transition
                "
              >
                Hoy
              </button>


              <button
                onClick={loadAppointments}
                disabled={loading}
                className="
                  self-end
                  px-5
                  py-3
                  rounded-xl
                  border
                  border-gray-700
                  bg-[#202020]
                  text-gray-300
                  hover:border-[#B8860B]
                  hover:text-[#B8860B]
                  transition
                "
              >
                ↻ Actualizar
              </button>

            </div>

          </div>


          {/* ==========================================
              FECHA ACTUAL
          ========================================== */}

          <div className="
            mb-8
            bg-[#202020]
            border
            border-gray-800
            rounded-2xl
            px-6
            py-5
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
          ">

            <div>

              <p className="
                text-gray-500
                text-sm
              ">
                Agenda seleccionada
              </p>


              <h2 className="
                text-xl
                font-semibold
                mt-1
                capitalize
              ">
                📅 {formatSelectedDate()}
              </h2>

            </div>


            <div className="
              text-gray-400
              text-sm
            ">

              {filteredAppointments.length}

              {" "}

              {filteredAppointments.length === 1
                ? "cita"
                : "citas"}

              {" "}programadas

            </div>

          </div>


          {/* ==========================================
              ERROR
          ========================================== */}

          {error && (

            <div className="
              bg-red-500/10
              border
              border-red-500/30
              text-red-400
              rounded-xl
              p-4
              mb-8
            ">
              {error}
            </div>

          )}


          {/* ==========================================
              ESTADÍSTICAS DEL DÍA
          ========================================== */}

          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
            mb-8
          ">


            <div className="
              bg-[#202020]
              border
              border-gray-800
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400 text-sm">
                Total del día
              </p>

              <p className="
                text-3xl
                font-bold
                text-[#B8860B]
                mt-3
              ">
                {filteredAppointments.length}
              </p>

            </div>


            <div className="
              bg-[#202020]
              border
              border-gray-800
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400 text-sm">
                Pendientes
              </p>

              <p className="
                text-3xl
                font-bold
                text-yellow-400
                mt-3
              ">
                {pendingAppointments}
              </p>

            </div>


            <div className="
              bg-[#202020]
              border
              border-gray-800
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400 text-sm">
                Confirmadas
              </p>

              <p className="
                text-3xl
                font-bold
                text-green-400
                mt-3
              ">
                {confirmedAppointments}
              </p>

            </div>


            <div className="
              bg-[#202020]
              border
              border-gray-800
              rounded-2xl
              p-6
            ">

              <p className="text-gray-400 text-sm">
                Completadas
              </p>

              <p className="
                text-3xl
                font-bold
                text-blue-400
                mt-3
              ">
                {completedAppointments}
              </p>

            </div>

          </div>


          {/* ==========================================
              TABLA
          ========================================== */}

          <div className="
            bg-[#202020]
            border
            border-gray-800
            rounded-2xl
            overflow-hidden
          ">


            <div className="
              px-6
              py-5
              border-b
              border-gray-800
            ">

              <h2 className="
                text-lg
                font-semibold
              ">
                Reservas del día
              </h2>

              <p className="
                text-gray-500
                text-sm
                mt-1
              ">
                Citas ordenadas según la hora.
              </p>

            </div>


            {filteredAppointments.length === 0 ? (

              <div className="
                p-16
                text-center
              ">

                <div className="
                  text-5xl
                  mb-5
                ">
                  📅
                </div>


                <h2 className="
                  text-xl
                  font-semibold
                ">
                  No hay citas para este día
                </h2>


                <p className="
                  text-gray-500
                  mt-2
                ">
                  No existen reservas registradas
                  para la fecha seleccionada.
                </p>

              </div>

            ) : (

              <div className="
                overflow-x-auto
              ">

                <table className="
                  w-full
                  min-w-[1100px]
                ">


                  <thead>

                    <tr className="
                      border-b
                      border-gray-800
                      bg-[#181818]
                    ">

                      <th className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      ">
                        Hora
                      </th>


                      <th className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      ">
                        Cliente
                      </th>


                      <th className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      ">
                        Servicio
                      </th>


                      <th className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      ">
                        Barbero
                      </th>


                      <th className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      ">
                        Estado
                      </th>


                      <th className="
                        px-6
                        py-4
                        text-left
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-500
                      ">
                        Acción
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredAppointments.map(
                      (appointment) => (

                        <tr
                          key={appointment.id}
                          className="
                            border-b
                            border-gray-800
                            last:border-b-0
                            hover:bg-[#252525]
                            transition
                          "
                        >


                          {/* HORA */}

                          <td className="
                            px-6
                            py-5
                          ">

                            <span className="
                              inline-flex
                              items-center
                              px-3
                              py-2
                              rounded-lg
                              bg-[#111111]
                              border
                              border-gray-800
                              text-white
                              font-bold
                            ">

                              {appointment.start_time
                                ?.substring(0, 5) ||
                                "—"}

                            </span>

                          </td>


                          {/* CLIENTE */}

                          <td className="
                            px-6
                            py-5
                          ">

                            <div className="
                              flex
                              items-center
                              gap-3
                            ">

                              <div className="
                                w-10
                                h-10
                                rounded-full
                                bg-[#B8860B]/20
                                text-[#B8860B]
                                flex
                                items-center
                                justify-center
                                font-bold
                              ">

                                {(
                                  appointment.first_name ||
                                  appointment.user_name ||
                                  "?"
                                )
                                  .charAt(0)
                                  .toUpperCase()}

                              </div>


                              <div>

                                <p className="
                                  text-white
                                  font-semibold
                                ">

                                  {appointment.first_name &&
                                  appointment.last_name

                                    ? `${appointment.first_name} ${appointment.last_name}`

                                    : appointment.user_name ||
                                      "Cliente"}

                                </p>


                                {appointment.email && (

                                  <p className="
                                    text-gray-500
                                    text-sm
                                    mt-1
                                  ">

                                    {appointment.email}

                                  </p>

                                )}

                              </div>

                            </div>

                          </td>


                          {/* SERVICIO */}

                          <td className="
                            px-6
                            py-5
                          ">

                            <p className="
                              text-gray-200
                              font-medium
                            ">

                              {appointment.service_name ||
                                "—"}

                            </p>

                          </td>


                          {/* BARBERO */}

                          <td className="
                            px-6
                            py-5
                          ">

                            <p className="
                              text-gray-300
                              font-medium
                            ">

                              {appointment.barber_name ||
                                "—"}

                            </p>

                          </td>


                          {/* ESTADO */}

                          <td className="
                            px-6
                            py-5
                          ">

                            <select
                              value={
                                appointment.status
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  appointment.id,
                                  e.target.value
                                )
                              }
                              className={`
                                border
                                rounded-lg
                                px-3
                                py-2
                                text-sm
                                font-semibold
                                bg-transparent
                                focus:outline-none
                                cursor-pointer
                                ${getStatusStyle(
                                  appointment.status
                                )}
                              `}
                            >

                              <option
                                value="PENDING"
                                className="
                                  bg-[#202020]
                                  text-yellow-400
                                "
                              >
                                Pendiente
                              </option>


                              <option
                                value="CONFIRMED"
                                className="
                                  bg-[#202020]
                                  text-green-400
                                "
                              >
                                Confirmada
                              </option>


                              <option
                                value="COMPLETED"
                                className="
                                  bg-[#202020]
                                  text-blue-400
                                "
                              >
                                Completada
                              </option>


                              <option
                                value="CANCELLED"
                                className="
                                  bg-[#202020]
                                  text-red-400
                                "
                              >
                                Cancelada
                              </option>

                            </select>

                          </td>


                          {/* ACCIÓN */}

                          <td className="
                            px-6
                            py-5
                          ">

                            <button
                              onClick={() =>
                                handleDelete(
                                  appointment.id
                                )
                              }
                              className="
                                px-3
                                py-2
                                rounded-lg
                                text-red-400
                                hover:text-red-300
                                hover:bg-red-500/10
                                transition
                              "
                            >
                              Eliminar
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </main>

      </div>

    </div>

  );

}


export default AdminAppointments;