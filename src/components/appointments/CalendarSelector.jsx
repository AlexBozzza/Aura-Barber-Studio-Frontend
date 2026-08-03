import { useEffect, useState } from "react";

import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import TimeSelector from "./TimeSelector";

import { getAvailableSlots } from "../../services/appointmentService";

function CalendarSelector({
  service,
  barber,
  onNext,
}) {

  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(null);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {

    if (!selectedDate || !service || !barber) return;

    const loadSlots = async () => {

      try {

        setLoadingSlots(true);

        const appointmentDate =
          selectedDate.toISOString().split("T")[0];

        const slots = await getAvailableSlots(
          barber.id,
          service.id,
          appointmentDate
        );

        setAvailableSlots(slots);

      } catch (error) {

        console.error("Error obteniendo horarios:", error);
        setAvailableSlots([]);

      } finally {

        setLoadingSlots(false);

      }

    };

    loadSlots();

  }, [selectedDate, service, barber]);

  return (

    <section className="mt-12">

      <h2 className="text-center text-4xl font-bold text-white">
        Selecciona una fecha
      </h2>

      <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
        Elige el día en el que deseas reservar tu cita.
      </p>

      <div className="mt-12 bg-[#202020] rounded-2xl p-10 border border-gray-700">

        <h3 className="text-2xl font-semibold text-white mb-8">
          Información de la reserva
        </h3>

        <div className="space-y-4 text-gray-300 mb-10">

          <p>
            <span className="text-[#B8860B] font-semibold">
              Servicio:
            </span>{" "}
            {service?.nombre}
          </p>

          <p>
            <span className="text-[#B8860B] font-semibold">
              Barbero:
            </span>{" "}
            {barber?.nombre}
          </p>

        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10">

          <div>

            <CalendarHeader
              month={month}
              year={year}
              onPrevious={() => {

                if (month === 0) {

                  setMonth(11);
                  setYear(year - 1);

                } else {

                  setMonth(month - 1);

                }

              }}
              onNext={() => {

                if (month === 11) {

                  setMonth(0);
                  setYear(year + 1);

                } else {

                  setMonth(month + 1);

                }

              }}
            />

            <CalendarGrid
              month={month}
              year={year}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

          </div>

          <TimeSelector
            availableSlots={availableSlots}
            loading={loadingSlots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />

        </div>

      </div>

      <div className="flex justify-center mt-12">

        <button
          disabled={!selectedDate || !selectedSlot}
          onClick={() =>
            onNext({
              date: selectedDate,
              slot: selectedSlot,
            })
          }
          className={`
            px-10
            py-4
            rounded-xl
            font-semibold
            transition-all
            duration-300

            ${
              selectedDate && selectedSlot
                ? "bg-[#B8860B] hover:bg-[#DAA520] text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Continuar
        </button>

      </div>

    </section>

  );

}

export default CalendarSelector;