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

    <div className="flex items-center justify-between mb-10">

      <button
        onClick={onPrevious}
        className="
          w-12
          h-12
          rounded-full
          border
          border-gray-700
          text-white
          hover:bg-[#B8860B]
          transition
        "
      >
        <FaChevronLeft className="mx-auto" />
      </button>

      <h2 className="text-3xl font-bold text-white">
        {months[month]} {year}
      </h2>

      <button
        onClick={onNext}
        className="
          w-12
          h-12
          rounded-full
          border
          border-gray-700
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