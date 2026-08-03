function TimeSelector({
  availableSlots,
 loading,
  selectedSlot,
  setSelectedSlot,
}) {

  if (loading) {
    return (
      <div className="bg-[#202020] rounded-2xl p-8 border border-gray-700 h-full">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Horarios disponibles
        </h3>

        <p className="text-gray-400">
          Cargando horarios...
        </p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className="bg-[#202020] rounded-2xl p-8 border border-gray-700 h-full">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Horarios disponibles
        </h3>

        <p className="text-gray-500">
          Selecciona una fecha para ver los horarios.
        </p>
      </div>
    );
  }

  const morningSlots = availableSlots.filter(
    slot => Number(slot.start_time.substring(0, 2)) < 13
  );

  const afternoonSlots = availableSlots.filter(
    slot => Number(slot.start_time.substring(0, 2)) >= 14
  );

  return (

    <div className="bg-[#202020] rounded-2xl p-8 border border-gray-700 h-full">

      <h3 className="text-2xl font-semibold text-white mb-8">
        Horarios disponibles
      </h3>

      {/* Mañana */}

      <div className="grid grid-cols-4 gap-3">

        {morningSlots.map((slot) => (

          <button
            key={slot.start_time}
            onClick={() => setSelectedSlot(slot)}
            className={`
              h-12
              rounded-lg
              border
              text-sm
              font-semibold
              transition-all
              duration-300

              ${
                selectedSlot?.start_time === slot.start_time
                  ? "bg-[#B8860B] border-[#B8860B] text-white shadow-lg"
                  : "bg-[#111111] border-gray-700 text-white hover:border-[#B8860B] hover:bg-[#2A2A2A]"
              }
            `}
          >
            {slot.start_time.substring(0, 5)}
          </button>

        ))}

      </div>

      {/* Almuerzo */}

      <div className="my-8">

        <div className="flex items-center gap-4">

          <div className="flex-1 h-px bg-gray-700"></div>

          <div className="text-center">

            <p className="text-[#B8860B] font-semibold">
              🍽 Almuerzo
            </p>

            <p className="text-xs text-gray-500">
              1:00 PM - 2:00 PM
            </p>

          </div>

          <div className="flex-1 h-px bg-gray-700"></div>

        </div>

      </div>

      {/* Tarde */}

      <div className="grid grid-cols-4 gap-3">

        {afternoonSlots.map((slot) => (

          <button
            key={slot.start_time}
            onClick={() => setSelectedSlot(slot)}
            className={`
              h-12
              rounded-lg
              border
              text-sm
              font-semibold
              transition-all
              duration-300

              ${
                selectedSlot?.start_time === slot.start_time
                  ? "bg-[#B8860B] border-[#B8860B] text-white shadow-lg"
                  : "bg-[#111111] border-gray-700 text-white hover:border-[#B8860B] hover:bg-[#2A2A2A]"
              }
            `}
          >
            {slot.start_time.substring(0, 5)}
          </button>

        ))}

      </div>

    </div>

  );

}

export default TimeSelector;