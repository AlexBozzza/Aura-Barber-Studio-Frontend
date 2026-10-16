
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function CalendarHeader({
  month,
  year,
  onPrevious,
  onNext,
}) {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return (
    <div className="flex items-center justify-between gap-2 mb-6 md:mb-10 w-full min-w-0">

      {/* Mes anterior */}
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Mes anterior"
        className="
          w-10 h-10 md:w-12 md:h-12
          shrink-0
          rounded-full
          border border-gray-700
          text-white
          hover:bg-[#B8860B]
          transition
        "
      >
        <FaChevronLeft className="mx-auto" />
      </button>

      {/* Mes y año */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center whitespace-nowrap">
        {months[month]} {year}
      </h2>

      {/* Mes siguiente */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Mes siguiente"
        className="
          w-10 h-10 md:w-12 md:h-12
          shrink-0
          rounded-full
          border border-gray-700
          text-white
          hover:bg-[#B8860B]
          transition
        "
      >
        <FaChevronRight className="mx-auto" />
      </button>

    </div>
  );
}

export default CalendarHeader;
