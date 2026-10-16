
function TimeSelector({
  availableSlots,
  loading,
  selectedSlot,
  setSelectedSlot,
}) {
  const cardClass =
    "bg-[#202020] rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700 h-full min-w-0";

  const titleClass =
    "text-xl md:text-2xl font-semibold text-white mb-6 md:mb-8";

  const slotGridClass =
    "grid grid-cols-4 gap-2 sm:gap-3";

  const getSlotButtonClass = (slot) => `
    min-w-0 h-11 sm:h-12
    rounded-lg
    border
    text-xs sm:text-sm
    font-semibold
    transition-all duration-300
    ${
      selectedSlot?.start_time === slot.start_time
        ? "bg-[#B8860B] border-[#B8860B] text-white shadow-lg"
        : "bg-[#111111] border-gray-700 text-white hover:border-[#B8860B] hover:bg-[#2A2A2A]"
    }
  `;

  if (loading) {
    return (
      <div className={cardClass}>
        <h3 className={titleClass}>Horarios disponibles</h3>
        <p className="text-gray-400">Cargando horarios...</p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <div className={cardClass}>
        <h3 className={titleClass}>Horarios disponibles</h3>
        <p className="text-gray-500">
          Selecciona una fecha para ver los horarios.
        </p>
      </div>
    );
  }

  const morningSlots = availableSlots.filter(
    (slot) => Number(slot.start_time.substring(0, 2)) < 13
  );

  const afternoonSlots = availableSlots.filter(
    (slot) => Number(slot.start_time.substring(0, 2)) >= 14
  );

  return (
    <div className={cardClass}>
      <h3 className={titleClass}>Horarios disponibles</h3>

      {/* Mañana */}
      <div className={slotGridClass}>
        {morningSlots.map((slot) => (
          <button
            key={slot.start_time}
            type="button"
            onClick={() => setSelectedSlot(slot)}
            aria-pressed={selectedSlot?.start_time === slot.start_time}
            className={getSlotButtonClass(slot)}
          >
            {slot.start_time.substring(0, 5)}
          </button>
        ))}
      </div>

      {/* Almuerzo */}
      <div className="my-6 sm:my-8">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex-1 h-px bg-gray-700" />

          <div className="text-center shrink-0">
            <p className="text-[#B8860B] font-semibold text-sm sm:text-base">
              🍽 Almuerzo
            </p>

            <p className="text-xs text-gray-500">
              1:00 PM - 2:00 PM
            </p>
          </div>

          <div className="flex-1 h-px bg-gray-700" />
        </div>
      </div>

      {/* Tarde */}
      <div className={slotGridClass}>
        {afternoonSlots.map((slot) => (
          <button
            key={slot.start_time}
            type="button"
            onClick={() => setSelectedSlot(slot)}
            aria-pressed={selectedSlot?.start_time === slot.start_time}
            className={getSlotButtonClass(slot)}
          >
            {slot.start_time.substring(0, 5)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TimeSelector;
