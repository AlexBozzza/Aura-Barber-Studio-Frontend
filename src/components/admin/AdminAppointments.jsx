import { useEffect, useMemo, useState } from "react";

import {
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "../../services/appointmentService";


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


  // ==========================================
  // ESTADOS
  // ==========================================

  const [appointments, setAppointments] =
    useState([]);

  const [selectedDate, setSelectedDate] =
    useState(getToday());

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [appointmentToDelete, setAppointmentToDelete] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);


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


  // ==========================================
  // CARGAR AL INICIAR
  // ==========================================

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
  // ABRIR MODAL DE ELIMINACIÓN
  // ==========================================

  const openDeleteModal = (appointment) => {

    setAppointmentToDelete(appointment);

    setDeleteModalOpen(true);

  };


  // ==========================================
  // CERRAR MODAL DE ELIMINACIÓN
  // ==========================================

  const closeDeleteModal = () => {

    if (deleting) return;

    setDeleteModalOpen(false);

    setAppointmentToDelete(null);

  };


  // ==========================================
  // CONFIRMAR ELIMINACIÓN
  // ==========================================

  const handleDelete = async () => {

    if (!appointmentToDelete) return;

    try {

      setDeleting(true);

      await deleteAppointment(
        appointmentToDelete.id
      );

      setDeleteModalOpen(false);

      setAppointmentToDelete(null);

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

    } finally {

      setDeleting(false);

    }

  };


  // ==========================================
  // CAMBIAR DÍA
  // ==========================================

  const changeDate = (days) => {

    if (!selectedDate) return;

    const [
      year,
      month,
      day
    ] = selectedDate.split("-").map(Number);

    const date = new Date(
      year,
      month - 1,
      day
    );

    date.setDate(
      date.getDate() + days
    );

    const newYear =
      date.getFullYear();

    const newMonth =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const newDay =
      String(
        date.getDate()
      ).padStart(2, "0");

    setSelectedDate(
      `${newYear}-${newMonth}-${newDay}`
    );

  };


  // ==========================================
  // DÍA ANTERIOR
  // ==========================================

  const goToPreviousDay = () => {

    changeDate(-1);

  };


  // ==========================================
  // DÍA SIGUIENTE
  // ==========================================

  const goToNextDay = () => {

    changeDate(1);

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
            (a.start_time || "").localeCompare(
              b.start_time || ""
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
  // NOMBRE DEL BARBERO
  // ==========================================

  const getBarberName = (appointment) => {

    const firstName =
      appointment.barber_first_name || "";

    const lastName =
      appointment.barber_last_name || "";

    const fullName =
      `${firstName} ${lastName}`.trim();

    return fullName || "Sin barbero asignado";

  };


  // ==========================================
  // DURACIÓN DE LA CITA
  // ==========================================
  //
  // Se calcula utilizando:
  // start_time → hora de inicio
  // end_time   → hora de finalización
  //
  // Así no dependemos de que el backend
  // envíe service_duration.
  //
  // ==========================================

  const formatDuration = (
    startTime,
    endTime
  ) => {

    if (!startTime || !endTime) {
      return "—";
    }

    try {

      const startParts =
        startTime
          .substring(0, 8)
          .split(":")
          .map(Number);

      const endParts =
        endTime
          .substring(0, 8)
          .split(":")
          .map(Number);

      const startMinutes =
        (startParts[0] * 60) +
        startParts[1] +
        (startParts[2] / 60);

      const endMinutes =
        (endParts[0] * 60) +
        endParts[1] +
        (endParts[2] / 60);

      let duration =
        endMinutes - startMinutes;

      // Por seguridad, por si una cita
      // cruza medianoche.
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
        text-white
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
      text-white
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
            CONTROLES DE FECHA
        ========================================== */}

        <div className="
          flex
          flex-col
          gap-3
        ">

          <label className="
            text-xs
            text-gray-500
            uppercase
            tracking-wider
          ">
            Ver agenda del día
          </label>


          <div className="
            flex
            flex-wrap
            gap-2
          ">


            {/* DÍA ANTERIOR */}

            <button
              onClick={goToPreviousDay}
              className="
                px-4
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
              title="Día anterior"
            >
              ←
            </button>


            {/* FECHA */}

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


            {/* DÍA SIGUIENTE */}

            <button
              onClick={goToNextDay}
              className="
                px-4
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
              title="Día siguiente"
            >
              →
            </button>


            {/* HOY */}

            <button
              onClick={() =>
                setSelectedDate(
                  getToday()
                )
              }
              className="
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


            {/* ACTUALIZAR */}

            <button
              onClick={loadAppointments}
              className="
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


        {/* TOTAL */}

        <div className="
          bg-[#202020]
          border
          border-gray-800
          rounded-2xl
          p-6
        ">

          <p className="
            text-gray-400
            text-sm
          ">
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


        {/* PENDIENTES */}

        <div className="
          bg-[#202020]
          border
          border-gray-800
          rounded-2xl
          p-6
        ">

          <p className="
            text-gray-400
            text-sm
          ">
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


        {/* CONFIRMADAS */}

        <div className="
          bg-[#202020]
          border
          border-gray-800
          rounded-2xl
          p-6
        ">

          <p className="
            text-gray-400
            text-sm
          ">
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


        {/* COMPLETADAS */}

        <div className="
          bg-[#202020]
          border
          border-gray-800
          rounded-2xl
          p-6
        ">

          <p className="
            text-gray-400
            text-sm
          ">
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


        {/* CABECERA TABLA */}

        <div className="
          px-6
          py-5
          border-b
          border-gray-800
        ">

          <div className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
          ">

            <div>

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


            {cancelledAppointments > 0 && (

              <span className="
                text-sm
                text-red-400
                bg-red-500/10
                border
                border-red-500/20
                px-3
                py-2
                rounded-lg
              ">
                {cancelledAppointments}{" "}
                {cancelledAppointments === 1
                  ? "cancelada"
                  : "canceladas"}
              </span>

            )}

          </div>

        </div>


        {/* ==========================================
            SIN CITAS
        ========================================== */}

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
              max-w-md
              mx-auto
            ">
              No existen reservas registradas
              para el{" "}
              <span className="text-gray-300">
                {formatSelectedDate()}
              </span>.
            </p>


            <div className="
              flex
              justify-center
              flex-wrap
              gap-3
              mt-6
            ">

              <button
                onClick={goToPreviousDay}
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-gray-700
                  text-gray-300
                  hover:border-[#B8860B]
                  hover:text-[#B8860B]
                  transition
                "
              >
                ← Día anterior
              </button>


              <button
                onClick={() =>
                  setSelectedDate(
                    getToday()
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-[#B8860B]
                  text-black
                  font-semibold
                  hover:bg-[#d09b16]
                  transition
                "
              >
                Ir a hoy
              </button>


              <button
                onClick={goToNextDay}
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-gray-700
                  text-gray-300
                  hover:border-[#B8860B]
                  hover:text-[#B8860B]
                  transition
                "
              >
                Día siguiente →
              </button>

            </div>

          </div>

        ) : (

          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[1250px]
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
                    Duración
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
                            shrink-0
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


                      {/* DURACIÓN */}

                      <td className="
                        px-6
                        py-5
                      ">

                        <span className="
                          text-gray-300
                          whitespace-nowrap
                        ">

                          ⏱{" "}
                          {formatDuration(
                            appointment.start_time,
                            appointment.end_time
                          )}

                        </span>

                      </td>


                     {/* BARBERO */}

                    <td className="
                    px-6
                    py-5
                    ">

                    <div className="
                    flex
                     items-center
                     gap-2
                    ">

                     <span>
                      💈
                     </span>

                    <p className="
                      text-gray-300
                     font-medium
                      whitespace-nowrap
                     ">

                    {getBarberName(
                     appointment
                      )}

                    </p>

                     </div>

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
                            openDeleteModal(
                              appointment
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


      {/* ==========================================
          MODAL DE CONFIRMACIÓN
      ========================================== */}

      {deleteModalOpen &&
        appointmentToDelete && (

          <div className="
            fixed
            inset-0
            z-[100]
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          ">

            <div className="
              w-full
              max-w-md
              bg-[#202020]
              border
              border-gray-700
              rounded-2xl
              shadow-2xl
              p-6
            ">

              <div className="
                flex
                items-start
                gap-4
              ">

                <div className="
                  w-12
                  h-12
                  rounded-full
                  bg-red-500/10
                  border
                  border-red-500/20
                  flex
                  items-center
                  justify-center
                  text-xl
                  shrink-0
                ">
                  ⚠️
                </div>


                <div>

                  <h2 className="
                    text-xl
                    font-semibold
                  ">
                    ¿Eliminar esta cita?
                  </h2>

                  <p className="
                    text-gray-400
                    text-sm
                    mt-1
                  ">
                    Esta acción no se puede deshacer.
                  </p>

                </div>

              </div>


              {/* INFORMACIÓN DE LA CITA */}

              <div className="
                mt-6
                bg-[#181818]
                border
                border-gray-800
                rounded-xl
                p-4
                space-y-3
              ">

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    uppercase
                  ">
                    Cliente
                  </p>

                  <p className="
                    text-white
                    font-semibold
                    mt-1
                  ">

                    {appointmentToDelete.first_name &&
                    appointmentToDelete.last_name

                      ? `${appointmentToDelete.first_name} ${appointmentToDelete.last_name}`

                      : appointmentToDelete.user_name ||
                        "Cliente"}

                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    uppercase
                  ">
                    Servicio
                  </p>

                  <p className="
                    text-gray-300
                    mt-1
                  ">
                    {appointmentToDelete.service_name ||
                      "—"}
                  </p>

                </div>


                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    uppercase
                  ">
                    Barbero
                  </p>

                  <p className="
                    text-gray-300
                    mt-1
                  ">
                    {getBarberName(
                      appointmentToDelete
                    )}
                  </p>

                </div>


                <div className="
                  grid
                  grid-cols-2
                  gap-4
                ">

                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      uppercase
                    ">
                      Fecha
                    </p>

                    <p className="
                      text-gray-300
                      mt-1
                    ">
                      {formatDate(
                        appointmentToDelete.appointment_date
                      )}
                    </p>

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      uppercase
                    ">
                      Hora
                    </p>

                    <p className="
                      text-gray-300
                      mt-1
                    ">
                      {appointmentToDelete.start_time
                        ?.substring(0, 5) ||
                        "—"}
                    </p>

                  </div>

                </div>

              </div>


              {/* BOTONES */}

              <div className="
                flex
                justify-end
                gap-3
                mt-6
              ">

                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    border
                    border-gray-700
                    text-gray-300
                    hover:border-gray-500
                    hover:text-white
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  Cancelar
                </button>


                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="
                    px-5
                    py-3
                    rounded-xl
                    bg-red-600
                    text-white
                    font-semibold
                    hover:bg-red-700
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  {deleting
                    ? "Eliminando..."
                    : "Eliminar cita"}

                </button>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}


export default AdminAppointments;