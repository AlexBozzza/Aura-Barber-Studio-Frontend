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
      <div className="flex">

        {/* Imagen */}

        <img
          src={barber.imagen}
          alt={barber.nombre}
          className="w-56 h-72 object-cover"
        />

        {/* Información */}

        <div className="flex-1 p-10 flex flex-col justify-center">

          <h2 className="text-3xl font-bold text-white">
            {barber.nombre}
          </h2>

          <p className="text-[#B8860B] text-lg mt-2">
            {barber.cargo}
          </p>

          <p className="text-gray-400 mt-4">
            {barber.experiencia}
          </p>

          <div className="mt-8 space-y-3">

            {barber.especialidades.map((especialidad) => (

              <div
                key={especialidad}
                className="flex items-center gap-3 text-gray-300"
              >

                <FaCheckCircle className="text-[#B8860B]" />

                <span>
                  {especialidad}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* Estado */}

        <div className="flex items-center justify-center px-10">

          {selected ? (

            <div className="text-center">

              <div className="flex items-center gap-2 text-[#B8860B] font-semibold">

                <span className="text-2xl">
                  ✓
                </span>

                <p>
                  Seleccionado
                </p>

              </div>

            </div>

          ) : (

           <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
            <p className="text-green-400 font-semibold">
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