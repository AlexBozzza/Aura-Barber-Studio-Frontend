import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCut,
  FaUserTie,
  FaStickyNote,
  FaHome,
  FaHistory,
  FaCalendarCheck,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { getMyAppointments } from "../services/appointmentService";


function MyAppointments() {

  const navigate = useNavigate();

  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [filter, setFilter] = useState("ALL");


  // ==========================================================
  // OBTENER MIS CITAS
  // ==========================================================

  const loadAppointments = async () => {

    try {

      setLoading(true);

      setError("");

      const data =
        await getMyAppointments();

      setAppointments(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Error obteniendo mis citas:",
        err
      );

      setError(
        err.response?.data?.message ||
        "No se pudieron cargar tus citas."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // CARGAR AL ENTRAR
  // ==========================================================

  useEffect(() => {

    loadAppointments();

  }, []);


  // ==========================================================
  // CONVERTIR FECHA
  // ==========================================================

  const parseAppointmentDate = (appointment) => {

    if (!appointment?.appointment_date) {
      return null;
    }

    const dateString =
      String(
        appointment.appointment_date
      ).slice(0, 10);

    const [year, month, day] =
      dateString.split("-").map(Number);

    if (
      !year ||
      !month ||
      !day
    ) {
      return null;
    }

    return new Date(
      year,
      month - 1,
      day
    );

  };


  // ==========================================================
  // FORMATO DE FECHA
  // ==========================================================

  const formatDate = (appointment) => {

    const date =
      parseAppointmentDate(
        appointment
      );

    if (!date) {
      return "Fecha no disponible";
    }

    return new Intl.DateTimeFormat(
      "es-CR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(date);

  };


  // ==========================================================
  // FORMATO DE FECHA CORTA
  // ==========================================================

  const formatShortDate = (appointment) => {

    const date =
      parseAppointmentDate(
        appointment
      );

    if (!date) {
      return {
        day: "--",
        month: "---",
      };
    }

    return {
      day: String(
        date.getDate()
      ).padStart(2, "0"),

      month:
        new Intl.DateTimeFormat(
          "es-CR",
          {
            month: "short",
          }
        )
          .format(date)
          .replace(".", "")
          .toUpperCase(),
    };

  };


  // ==========================================================
  // FORMATO DE HORA
  // ==========================================================

  const formatTime = (time) => {

    if (!time) {
      return "--:--";
    }

    const parts =
      String(time)
        .slice(0, 5)
        .split(":");

    if (parts.length !== 2) {
      return String(time).slice(0, 5);
    }

    const hours =
      Number(parts[0]);

    const minutes =
      parts[1];

    const suffix =
      hours >= 12
        ? "PM"
        : "AM";

    const displayHour =
      hours % 12 || 12;

    return `${displayHour}:${minutes} ${suffix}`;

  };


  // ==========================================================
  // OBTENER FECHA/HORA DE INICIO
  // ==========================================================

  const getAppointmentDateTime = (
    appointment
  ) => {

    const date =
      parseAppointmentDate(
        appointment
      );

    if (!date) {
      return null;
    }

    const time =
      String(
        appointment.start_time || "00:00:00"
      ).slice(0, 5);

    const [hours, minutes] =
      time.split(":").map(Number);

    date.setHours(
      hours || 0,
      minutes || 0,
      0,
      0
    );

    return date;

  };


  // ==========================================================
  // DETERMINAR SI UNA CITA ES FUTURA
  // ==========================================================

  const isUpcoming = (appointment) => {

    const appointmentDate =
      getAppointmentDateTime(
        appointment
      );

    if (!appointmentDate) {
      return false;
    }

    return appointmentDate >= new Date();

  };


  // ==========================================================
  // ESTADO
  // ==========================================================

  const getStatusLabel = (status) => {

    const statuses = {

      PENDING:
        "Pendiente",

      CONFIRMED:
        "Confirmada",

      COMPLETED:
        "Completada",

      CANCELLED:
        "Cancelada",

    };

    return (
      statuses[status] ||
      status ||
      "Desconocido"
    );

  };


  // ==========================================================
  // ESTILO DEL ESTADO
  // ==========================================================

  const getStatusClasses = (status) => {

    const classes = {

      PENDING:
        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

      CONFIRMED:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",

      COMPLETED:
        "bg-green-500/10 text-green-400 border-green-500/20",

      CANCELLED:
        "bg-red-500/10 text-red-400 border-red-500/20",

    };

    return (
      classes[status] ||
      "bg-gray-500/10 text-gray-400 border-gray-500/20"
    );

  };


  // ==========================================================
  // CITAS ORDENADAS
  // ==========================================================

  const sortedAppointments =
    useMemo(() => {

      return [...appointments].sort(
        (a, b) => {

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

          return (
            dateA.getTime() -
            dateB.getTime()
          );

        }
      );

    }, [appointments]);


  // ==========================================================
  // PRÓXIMAS CITAS
  // ==========================================================

  const upcomingAppointments =
    useMemo(() => {

      return sortedAppointments.filter(
        (appointment) => {

          if (
            appointment.status ===
            "CANCELLED"
          ) {
            return false;
          }

          if (
            appointment.status ===
            "COMPLETED"
          ) {
            return false;
          }

          return isUpcoming(
            appointment
          );

        }
      );

    }, [sortedAppointments]);


  // ==========================================================
  // PRÓXIMA CITA
  // ==========================================================

  const nextAppointment =
    upcomingAppointments[0] || null;


  // ==========================================================
  // HISTORIAL
  // ==========================================================

  const historyAppointments =
    useMemo(() => {

      return sortedAppointments
        .filter(
          (appointment) =>
            !isUpcoming(
              appointment
            ) ||
            appointment.status ===
              "COMPLETED" ||
            appointment.status ===
              "CANCELLED"
        )
        .sort(
          (a, b) => {

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

            return (
              dateB.getTime() -
              dateA.getTime()
            );

          }
        );

    }, [sortedAppointments]);


  // ==========================================================
  // CITAS FILTRADAS
  // ==========================================================

  const filteredHistory =
    useMemo(() => {

      if (filter === "ALL") {
        return historyAppointments;
      }

      return historyAppointments.filter(
        (appointment) =>
          appointment.status ===
          filter
      );

    }, [
      historyAppointments,
      filter,
    ]);


  // ==========================================================
  // TARJETA DE CITA
  // ==========================================================

  const AppointmentCard = ({
    appointment,
    compact = false,
  }) => {

    const shortDate =
      formatShortDate(
        appointment
      );

    return (

      <div className="
        bg-[#202020]
        border
        border-gray-700
        rounded-2xl
        overflow-hidden
        hover:border-gray-600
        transition
      ">

        <div className="
          flex
          flex-col
          md:flex-row
        ">


          {/* ================================================
              FECHA
          ================================================= */}

          <div className="
            md:w-28
            shrink-0
            bg-[#181818]
            border-b
            md:border-b-0
            md:border-r
            border-gray-800
            flex
            md:flex-col
            items-center
            justify-center
            gap-2
            md:gap-0
            p-5
          ">

            <span className="
              text-3xl
              font-bold
              text-white
            ">
              {shortDate.day}
            </span>

            <span className="
              text-xs
              font-semibold
              tracking-widest
              text-[#B8860B]
            ">
              {shortDate.month}
            </span>

          </div>


          {/* ================================================
              INFORMACIÓN
          ================================================= */}

          <div className="flex-1 p-5 md:p-6">

            <div className="
              flex
              flex-col
              lg:flex-row
              lg:items-start
              lg:justify-between
              gap-4
            ">


              {/* SERVICIO */}

              <div>

                <p className="
                  text-xs
                  uppercase
                  tracking-widest
                  text-gray-500
                  mb-1
                ">
                  Servicio
                </p>

                <h3 className="
                  text-lg
                  font-bold
                  text-white
                ">
                  {appointment.service_name ||
                    "Servicio no disponible"}
                </h3>

              </div>


              {/* ESTADO */}

              <span
                className={`
                  self-start
                  inline-flex
                  items-center
                  px-3
                  py-1.5
                  rounded-full
                  border
                  text-xs
                  font-semibold
                  ${getStatusClasses(
                    appointment.status
                  )}
                `}
              >
                {getStatusLabel(
                  appointment.status
                )}
              </span>

            </div>


            {/* ==============================================
                DATOS
            ============================================== */}

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
              mt-5
              pt-5
              border-t
              border-gray-800
            ">


              {/* FECHA */}

              <div className="
                flex
                items-start
                gap-3
              ">

                <FaCalendarAlt className="
                  mt-1
                  text-[#B8860B]
                " />

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                  ">
                    Fecha
                  </p>

                  <p className="
                    text-sm
                    text-gray-300
                    capitalize
                  ">
                    {formatDate(
                      appointment
                    )}
                  </p>

                </div>

              </div>


              {/* HORA */}

              <div className="
                flex
                items-start
                gap-3
              ">

                <FaClock className="
                  mt-1
                  text-[#B8860B]
                " />

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                  ">
                    Horario
                  </p>

                  <p className="
                    text-sm
                    text-gray-300
                  ">
                    {formatTime(
                      appointment.start_time
                    )}
                    {" — "}
                    {formatTime(
                      appointment.end_time
                    )}
                  </p>

                </div>

              </div>


              {/* BARBERO */}

              <div className="
                flex
                items-start
                gap-3
              ">

                <FaUserTie className="
                  mt-1
                  text-[#B8860B]
                " />

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                  ">
                    Barbero
                  </p>

                  <p className="
                    text-sm
                    text-gray-300
                  ">
                    {appointment.barber_first_name ||
                      "No disponible"}

                    {" "}

                    {appointment.barber_last_name ||
                      ""}
                  </p>

                </div>

              </div>


              {/* DURACIÓN */}

              <div className="
                flex
                items-start
                gap-3
              ">

                <FaCut className="
                  mt-1
                  text-[#B8860B]
                " />

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                  ">
                    Duración
                  </p>

                  <p className="
                    text-sm
                    text-gray-300
                  ">
                    {appointment.service_duration
                      ? `${appointment.service_duration} min`
                      : "No disponible"}
                  </p>

                </div>

              </div>

            </div>


            {/* ==============================================
                NOTAS
            ============================================== */}

            {appointment.notes && (

              <div className="
                mt-5
                pt-5
                border-t
                border-gray-800
                flex
                items-start
                gap-3
              ">

                <FaStickyNote className="
                  mt-1
                  text-[#B8860B]
                  shrink-0
                " />

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    mb-1
                  ">
                    Notas de la cita
                  </p>

                  <p className="
                    text-sm
                    text-gray-400
                  ">
                    {appointment.notes}
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    );

  };


  // ==========================================================
  // LOADING
  // ==========================================================

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
            border-2
            border-gray-700
            border-t-[#B8860B]
            rounded-full
            animate-spin
            mx-auto
            mb-4
          " />

          <p className="text-gray-400">
            Cargando tus citas...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <div className="
        min-h-screen
        bg-[#111111]
        text-white
      ">

        <main className="
          max-w-5xl
          mx-auto
          px-6
          pt-32
          pb-20
        ">

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="
              inline-flex
              items-center
              gap-2
              text-gray-400
              hover:text-[#B8860B]
              transition
              mb-8
            "
          >

            <FaHome />

            Volver al inicio

          </button>


          <div className="
            bg-[#202020]
            border
            border-red-900/50
            rounded-2xl
            p-8
            text-center
          ">

            <FaExclamationCircle className="
              mx-auto
              text-red-400
              text-3xl
              mb-4
            " />

            <h2 className="
              text-xl
              font-bold
              mb-2
            ">
              No pudimos cargar tus citas
            </h2>

            <p className="
              text-gray-500
              mb-6
            ">
              {error}
            </p>

            <button
              type="button"
              onClick={loadAppointments}
              className="
                inline-flex
                items-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-[#B8860B]
                hover:bg-[#9f7408]
                text-white
                font-semibold
                transition
              "
            >

              <FaSyncAlt />

              Intentar nuevamente

            </button>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="
      min-h-screen
      bg-[#111111]
      text-white
    ">

      <main className="
        max-w-6xl
        mx-auto
        px-6
        pt-32
        pb-20
      ">


        {/* ====================================================
            ENCABEZADO
        ==================================================== */}

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-end
          md:justify-between
          gap-6
          mb-10
        ">


          <div>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="
                inline-flex
                items-center
                gap-2
                text-gray-400
                hover:text-[#B8860B]
                transition
                mb-5
              "
            >

              <FaHome />

              Volver al inicio

            </button>


            <div className="
              flex
              items-center
              gap-4
            ">

              <div className="
                w-14
                h-14
                rounded-full
                bg-[#B8860B]/10
                border
                border-[#B8860B]/30
                flex
                items-center
                justify-center
              ">

                <FaCalendarCheck className="
                  text-[#B8860B]
                  text-xl
                " />

              </div>


              <div>

                <h1 className="
                  text-3xl
                  font-bold
                ">
                  Mis citas
                </h1>

                <p className="
                  text-gray-400
                  mt-1
                ">
                  Consulta tus reservas y el historial de tus visitas.
                </p>

              </div>

            </div>

          </div>


          {/* REFRESCAR */}

          <button
            type="button"
            onClick={loadAppointments}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              border
              border-gray-700
              hover:border-[#B8860B]
              hover:text-[#B8860B]
              text-gray-300
              px-5
              py-3
              rounded-xl
              transition
            "
          >

            <FaSyncAlt />

            Actualizar

          </button>

        </div>


        {/* ====================================================
            PRÓXIMA CITA
        ==================================================== */}

        {nextAppointment && (

          <section className="mb-10">

            <div className="
              flex
              items-center
              gap-2
              mb-4
            ">

              <FaCalendarCheck className="
                text-[#B8860B]
              " />

              <h2 className="
                text-xl
                font-bold
              ">
                Próxima cita
              </h2>

            </div>


            <div className="
              bg-[#202020]
              border
              border-[#B8860B]/40
              rounded-2xl
              p-6
              md:p-8
              relative
              overflow-hidden
            ">

              {/* DECORACIÓN */}

              <div className="
                absolute
                -right-16
                -top-16
                w-40
                h-40
                rounded-full
                bg-[#B8860B]/5
              " />


              <div className="
                relative
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-8
              ">


                {/* FECHA */}

                <div className="
                  flex
                  items-center
                  gap-5
                ">

                  <div className="
                    w-20
                    h-20
                    rounded-2xl
                    bg-[#181818]
                    border
                    border-gray-700
                    flex
                    flex-col
                    items-center
                    justify-center
                  ">

                    <span className="
                      text-3xl
                      font-bold
                    ">
                      {
                        formatShortDate(
                          nextAppointment
                        ).day
                      }
                    </span>

                    <span className="
                      text-xs
                      font-semibold
                      tracking-widest
                      text-[#B8860B]
                    ">
                      {
                        formatShortDate(
                          nextAppointment
                        ).month
                      }
                    </span>

                  </div>


                  <div>

                    <p className="
                      text-gray-500
                      text-sm
                      capitalize
                    ">
                      {formatDate(
                        nextAppointment
                      )}
                    </p>

                    <h3 className="
                      text-2xl
                      font-bold
                      mt-1
                    ">
                      {nextAppointment.service_name}
                    </h3>

                  </div>

                </div>


                {/* DETALLES */}

                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-6
                ">


                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      mb-1
                    ">
                      Hora
                    </p>

                    <p className="
                      font-semibold
                    ">
                      {formatTime(
                        nextAppointment.start_time
                      )}

                      {" — "}

                      {formatTime(
                        nextAppointment.end_time
                      )}
                    </p>

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      mb-1
                    ">
                      Barbero
                    </p>

                    <p className="
                      font-semibold
                    ">
                      {nextAppointment.barber_first_name}

                      {" "}

                      {nextAppointment.barber_last_name}

                    </p>

                  </div>


                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      mb-1
                    ">
                      Duración
                    </p>

                    <p className="
                      font-semibold
                    ">
                      {nextAppointment.service_duration}
                      {" minutos"}
                    </p>

                  </div>

                </div>


                {/* ESTADO */}

                <span
                  className={`
                    self-start
                    lg:self-center
                    inline-flex
                    items-center
                    px-4
                    py-2
                    rounded-full
                    border
                    text-sm
                    font-semibold
                    ${getStatusClasses(
                      nextAppointment.status
                    )}
                  `}
                >
                  {getStatusLabel(
                    nextAppointment.status
                  )}
                </span>

              </div>

            </div>

          </section>

        )}


        {/* ====================================================
            PRÓXIMAS CITAS
        ==================================================== */}

        <section className="mb-10">

          <div className="
            flex
            items-center
            justify-between
            gap-4
            mb-5
          ">

            <div>

              <h2 className="
                text-xl
                font-bold
              ">
                Próximas citas
              </h2>

              <p className="
                text-gray-500
                text-sm
                mt-1
              ">
                Tus reservas pendientes o confirmadas.
              </p>

            </div>

            <span className="
              text-sm
              text-gray-500
            ">
              {upcomingAppointments.length}
              {" "}
              {upcomingAppointments.length === 1
                ? "cita"
                : "citas"}
            </span>

          </div>


          {upcomingAppointments.length === 0 ? (

            <div className="
              bg-[#202020]
              border
              border-gray-700
              rounded-2xl
              p-10
              text-center
            ">

              <FaCalendarAlt className="
                mx-auto
                text-gray-700
                text-3xl
                mb-4
              " />

              <h3 className="
                text-lg
                font-semibold
                text-gray-300
              ">
                No tienes próximas citas
              </h3>

              <p className="
                text-gray-500
                mt-2
                mb-6
              ">
                ¿Quieres reservar una nueva cita?
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/appointments")
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-[#B8860B]
                  hover:bg-[#9f7408]
                  px-6
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >

                <FaCalendarCheck />

                Reservar cita

              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {upcomingAppointments
                .slice(1)
                .map(
                  (appointment) => (

                    <AppointmentCard
                      key={
                        appointment.id
                      }
                      appointment={
                        appointment
                      }
                    />

                  )
                )}

              {/* Si solamente hay una próxima cita,
                  mostramos un pequeño mensaje porque
                  ya está destacada arriba. */}

              {upcomingAppointments.length === 1 && (

                <div className="
                  text-center
                  py-4
                  text-gray-600
                  text-sm
                ">
                  Tu próxima cita está destacada arriba.
                </div>

              )}

            </div>

          )}

        </section>


        {/* ====================================================
            HISTORIAL
        ==================================================== */}

        <section>

          <div className="
            flex
            flex-col
            md:flex-row
            md:items-end
            md:justify-between
            gap-4
            mb-5
          ">

            <div>

              <div className="
                flex
                items-center
                gap-2
              ">

                <FaHistory className="
                  text-[#B8860B]
                " />

                <h2 className="
                  text-xl
                  font-bold
                ">
                  Historial de citas
                </h2>

              </div>

              <p className="
                text-gray-500
                text-sm
                mt-1
              ">
                Consulta las citas que has realizado anteriormente.
              </p>

            </div>


            {/* FILTROS */}

            <div className="
              flex
              flex-wrap
              gap-2
            ">

              {[
                {
                  value: "ALL",
                  label: "Todas",
                },
                {
                  value: "COMPLETED",
                  label: "Completadas",
                },
                {
                  value: "CANCELLED",
                  label: "Canceladas",
                },
                {
                  value: "PENDING",
                  label: "Pendientes",
                },
                {
                  value: "CONFIRMED",
                  label: "Confirmadas",
                },
              ].map(
                (option) => (

                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      setFilter(
                        option.value
                      )
                    }
                    className={`
                      px-4
                      py-2
                      rounded-lg
                      text-xs
                      font-semibold
                      border
                      transition
                      ${
                        filter ===
                        option.value
                          ? "bg-[#B8860B] border-[#B8860B] text-white"
                          : "bg-[#202020] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                      }
                    `}
                  >

                    {option.label}

                  </button>

                )
              )}

            </div>

          </div>


          {filteredHistory.length === 0 ? (

            <div className="
              bg-[#202020]
              border
              border-gray-700
              rounded-2xl
              p-10
              text-center
            ">

              <FaHistory className="
                mx-auto
                text-gray-700
                text-3xl
                mb-4
              " />

              <p className="
                text-gray-500
              ">
                No hay citas para mostrar con este filtro.
              </p>

            </div>

          ) : (

            <div className="
              space-y-4
            ">

              {filteredHistory.map(
                (appointment) => (

                  <AppointmentCard
                    key={
                      appointment.id
                    }
                    appointment={
                      appointment
                    }
                  />

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>

  );

}


export default MyAppointments;