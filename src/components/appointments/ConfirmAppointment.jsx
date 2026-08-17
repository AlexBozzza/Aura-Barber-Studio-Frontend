import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createAppointment } from "../../services/appointmentService";

function ConfirmAppointment({
  service,
  barber,
  selectedDate,
  selectedSlot,
}) {

  const navigate = useNavigate();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  // ==========================================
  // FECHA FORMATEADA
  // ==========================================

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("es-CR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";


  // ==========================================
  // CONFIRMAR CITA
  // ==========================================

  const handleConfirmAppointment = async () => {

    try {

      setLoading(true);


      await createAppointment({

        barber_id: barber.id,

        service_id: service.id,

        appointment_date:
          selectedDate.toISOString().split("T")[0],

        start_time:
          selectedSlot.start_time,

        end_time:
          selectedSlot.end_time,

        notes,

      });


      // Cita creada correctamente

      setSuccess(true);


    } catch (error) {

      console.error(
        "Error creando cita:",
        error
      );


      // ==========================================
      // USUARIO NO AUTENTICADO
      // ==========================================

      if (error.response?.status === 401) {

        navigate("/login", {
          state: {
            fromReservation: true,
          },
        });

        return;

      }


      // ==========================================
      // OTROS ERRORES
      // ==========================================

      alert(
        error.response?.data?.message ||
        "No fue posible crear la cita."
      );


    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // RESERVA CONFIRMADA
  // ==========================================

  if (success) {

    return (

      <section className="mt-20">

        <div className="
          max-w-2xl
          mx-auto
          bg-[#202020]
          border
          border-gray-700
          rounded-2xl
          p-12
          text-center
        ">

          <div className="text-7xl mb-6">
            ✅
          </div>


          <h2 className="
            text-4xl
            font-bold
            text-white
          ">
            ¡Reserva Confirmada!
          </h2>


          <p className="
            text-gray-400
            mt-4
          ">
            Tu cita fue registrada correctamente.
          </p>


          <div className="
            mt-10
            space-y-4
            text-left
          ">

            {/* SERVICIO */}

            <div className="flex justify-between">

              <span className="text-gray-400">
                Servicio
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {service.nombre}
              </span>

            </div>


            {/* BARBERO */}

            <div className="flex justify-between">

              <span className="text-gray-400">
                Barbero
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {barber.nombre}
              </span>

            </div>


            {/* FECHA */}

            <div className="flex justify-between">

              <span className="text-gray-400">
                Fecha
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {formattedDate}
              </span>

            </div>


            {/* HORA */}

            <div className="flex justify-between">

              <span className="text-gray-400">
                Hora
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {selectedSlot.start_time.substring(0, 5)}
              </span>

            </div>

          </div>

        </div>

      </section>

    );

  }


  // ==========================================
  // CONFIRMACIÓN
  // ==========================================

  return (

    <section className="mt-12">

      <h2 className="
        text-center
        text-4xl
        font-bold
        text-white
      ">
        Confirmar Reserva
      </h2>


      <p className="
        text-center
        text-gray-400
        mt-4
      ">
        Revisa la información antes de confirmar tu cita.
      </p>


      <div className="
        max-w-3xl
        mx-auto
        mt-12
      ">

        <div className="
          bg-[#202020]
          rounded-2xl
          border
          border-gray-700
          p-10
        ">

          <div className="space-y-6">


            {/* SERVICIO */}

            <div className="
              flex
              justify-between
              border-b
              border-gray-700
              pb-4
            ">

              <span className="text-gray-400">
                ✂ Servicio
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {service?.nombre}
              </span>

            </div>


            {/* BARBERO */}

            <div className="
              flex
              justify-between
              border-b
              border-gray-700
              pb-4
            ">

              <span className="text-gray-400">
                👤 Barbero
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {barber?.nombre}
              </span>

            </div>


            {/* FECHA */}

            <div className="
              flex
              justify-between
              border-b
              border-gray-700
              pb-4
            ">

              <span className="text-gray-400">
                📅 Fecha
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {formattedDate}
              </span>

            </div>


            {/* HORA */}

            <div className="
              flex
              justify-between
              border-b
              border-gray-700
              pb-4
            ">

              <span className="text-gray-400">
                🕒 Hora
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {selectedSlot?.start_time.substring(0, 5)}
              </span>

            </div>


            {/* DURACIÓN */}

            <div className="
              flex
              justify-between
              border-b
              border-gray-700
              pb-4
            ">

              <span className="text-gray-400">
                ⏱ Duración
              </span>

              <span className="
                text-white
                font-semibold
              ">
                {service?.duracion}
              </span>

            </div>


            {/* PRECIO */}

            <div className="
              flex
              justify-between
            ">

              <span className="text-gray-400">
                💰 Precio
              </span>

              <span className="
                text-[#B8860B]
                font-bold
                text-xl
              ">
                {service?.precio}
              </span>

            </div>

          </div>


          {/* NOTAS */}

          <div className="mt-10">

            <label className="
              block
              text-white
              mb-3
              font-semibold
            ">
              Notas para el barbero (Opcional)
            </label>


            <textarea
              rows={4}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Ej. Solo tijera, no muy corto..."
              className="
                w-full
                bg-[#111111]
                border
                border-gray-700
                rounded-xl
                p-4
                text-white
                resize-none
                focus:outline-none
                focus:border-[#B8860B]
              "
            />

          </div>


          {/* BOTÓN */}

          <button
            onClick={handleConfirmAppointment}
            disabled={loading}
            className="
              w-full
              mt-10
              py-4
              rounded-xl
              bg-[#B8860B]
              hover:bg-[#DAA520]
              transition-all
              duration-300
              text-white
              font-bold
              text-lg
              disabled:opacity-50
            "
          >

            {loading
              ? "Creando reserva..."
              : "Confirmar Reserva"
            }

          </button>

        </div>

      </div>

    </section>

  );

}

export default ConfirmAppointment;