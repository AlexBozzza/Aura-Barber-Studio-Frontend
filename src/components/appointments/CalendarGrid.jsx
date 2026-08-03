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

  const today = new Date();

  // Primer día del mes
  const firstDay = new Date(year, month, 1);

  // Último día del mes
  const lastDay = new Date(year, month + 1, 0);

  // Total de días
  const totalDays = lastDay.getDate();

  // Convertimos domingo=0 a lunes=0
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

    <div>

      {/* Días de la semana */}

      <div className="grid grid-cols-7 gap-3 mb-4">

        {days.map((day) => (

          <div
            key={day}
            className="text-center text-gray-400 font-semibold"
          >
            {day}
          </div>

        ))}

      </div>

      {/* Días */}

      <div className="grid grid-cols-7 gap-3">

        {cells.map((day, index) => {

          if (!day) {
            return (
              <div
                key={index}
                className="h-14"
              />
            );
          }

          const currentDate = new Date(
            year,
            month,
            day
          );

          const isToday =
            currentDate.toDateString() ===
            today.toDateString();

          const isPast =
            currentDate <
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );

          const isSelected =
            selectedDate &&
            currentDate.toDateString() ===
            selectedDate.toDateString();

          return (

            <button
              key={day}
              disabled={isPast}
              onClick={() =>
                setSelectedDate(currentDate)
              }
              className={`
                h-14
                rounded-xl
                font-semibold
                transition-all
                duration-300

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