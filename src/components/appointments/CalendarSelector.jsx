
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
  // Obtener la fecha actual según la zona horaria de Costa Rica
  const getCostaRicaToday = () => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Costa_Rica",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = Number(parts.find((p) => p.type === "year").value);
    const month = Number(parts.find((p) => p.type === "month").value) - 1;
    const day = Number(parts.find((p) => p.type === "day").value);

    return new Date(year, month, day);
  };

  const today = getCostaRicaToday();

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

        // Formatear la fecha sin convertirla a UTC
        const appointmentDate = [
          selectedDate.getFullYear(),
          String(selectedDate.getMonth() + 1).padStart(2, "0"),
          String(selectedDate.getDate()).padStart(2, "0"),
        ].join("-");

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
    <section className="mt-7 md:mt-12 min-w-0">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-white">
        Selecciona una fecha
      </h2>

      <p className="text-center text-sm md:text-base text-gray-400 mt-3 md:mt-4 max-w-2xl mx-auto px-2">
        Elige el día en el que deseas reservar tu cita.
      </p>

      <div className="mt-7 md:mt-12 bg-[#202020] rounded-2xl p-4 sm:p-6 lg:p-10 border border-gray-700 min-w-0">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-5 md:mb-8">
          Información de la reserva
        </h3>

        <div className="space-y-3 md:space-y-4 text-gray-300 mb-7 md:mb-10 break-words">
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

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-7 lg:gap-10 min-w-0">
          <div className="min-w-0">
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

          <div className="min-w-0">
            <TimeSelector
              availableSlots={availableSlots}
              loading={loadingSlots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-7 md:mt-12 px-2">
        <button
          disabled={!selectedDate || !selectedSlot}
          onClick={() =>
            onNext({
              date: selectedDate,
              slot: selectedSlot,
            })
          }
          className={`
            w-full sm:w-auto
            px-10 py-3 md:py-4
            rounded-xl
            font-semibold
            transition-all duration-300
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
