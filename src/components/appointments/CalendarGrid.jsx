
function CalendarGrid({
  month,
  year,
  selectedDate,
  setSelectedDate,
}) {
  const days = [
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom",
  ];

  // Obtener la fecha actual de Costa Rica
  const costaRicaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Costa_Rica",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const todayYear = Number(
    costaRicaDate.find((part) => part.type === "year").value
  );

  const todayMonth =
    Number(costaRicaDate.find((part) => part.type === "month").value) - 1;

  const todayDay = Number(
    costaRicaDate.find((part) => part.type === "day").value
  );

  // Fecha de hoy representada como fecha local, sin hora
  const today = new Date(todayYear, todayMonth, todayDay);

  // Primer día del mes
  const firstDay = new Date(year, month, 1);

  // Último día del mes
  const lastDay = new Date(year, month + 1, 0);

  const totalDays = lastDay.getDate();

  // Convertir domingo=0 a lunes=0
  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const cells = [];

  // Espacios vacíos antes del día 1
  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }

  // Agregar días
  for (let day = 1; day <= totalDays; day++) {
    cells.push(day);
  }

  return (
    <div className="w-full min-w-0">

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 mb-3 md:mb-4">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm lg:text-base text-gray-400 font-semibold"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
        {cells.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="h-10 sm:h-12 lg:h-14"
              />
            );
          }

          const currentDate = new Date(year, month, day);

          const isToday =
            year === todayYear &&
            month === todayMonth &&
            day === todayDay;

          const isPast = currentDate < today;

          const isSelected =
            selectedDate &&
            currentDate.getFullYear() === selectedDate.getFullYear() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getDate() === selectedDate.getDate();

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              aria-pressed={Boolean(isSelected)}
              onClick={() => setSelectedDate(currentDate)}
              className={`
                w-full min-w-0
                h-10 sm:h-12 lg:h-14
                rounded-lg lg:rounded-xl
                text-sm sm:text-base
                font-semibold
                transition-all duration-300
                ${
                  isSelected
                    ? "bg-[#B8860B] text-white"
                    : isToday
                    ? "border-2 border-[#B8860B] text-white"
                    : isPast
                    ? "bg-[#181818] text-gray-600 cursor-not-allowed"
                    : "bg-[#202020] text-white hover:bg-[#2A2A2A] hover:border-[#B8860B] border border-gray-700"
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

    </div>
  );
}

export default CalendarGrid;
