
import { FaCheckCircle } from "react-icons/fa";

function BarberCard({
  barber,
  selected = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full min-w-0 max-w-full
        bg-[#202020]
        rounded-2xl
        overflow-hidden
        transition-all
        duration-500
        cursor-pointer
        hover:scale-[1.01]
        ${
          selected
            ? "border-2 border-[#B8860B] shadow-[0_0_20px_rgba(184,134,11,0.25)]"
            : "border border-gray-700 hover:border-[#B8860B]"
        }
      `}
    >
      <div className="flex flex-col md:flex-row min-w-0">

        {/* Imagen */}
        <img
          src={barber.imagen}
          alt={barber.nombre}
          className="w-full h-64 object-cover md:w-56 md:h-72 md:shrink-0"
        />

        {/* Información */}
        <div className="flex-1 min-w-0 p-5 md:p-10 flex flex-col justify-center">

          <h2 className="text-2xl md:text-3xl font-bold text-white break-words">
            {barber.nombre}
          </h2>

          <p className="text-[#B8860B] text-lg mt-2">
            {barber.cargo}
          </p>

          <p className="text-gray-400 mt-4">
            {barber.experiencia}
          </p>

          {/* Especialidades */}
          <div className="mt-6 md:mt-8 space-y-3">

            {barber.especialidades.map((especialidad) => (
              <div
                key={especialidad}
                className="flex items-start gap-3 text-gray-300 min-w-0"
              >
                <FaCheckCircle className="text-[#B8860B] mt-1 shrink-0" />

                <span className="min-w-0 break-words">
                  {especialidad}
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center justify-center px-5 pb-5 md:pb-0 md:px-10 md:shrink-0">

          {selected ? (
            <div className="flex items-center gap-2 text-[#B8860B] font-semibold">
              <span className="text-2xl">✓</span>
              <p>Seleccionado</p>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
              <p className="text-green-400 font-semibold whitespace-nowrap">
                🟢 Disponible
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default BarberCard;
