
import { FaChevronRight } from "react-icons/fa";

function ServiceCard({
  service,
  mode = "services",
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
          src={service.imagen}
          alt={service.nombre}
          className="w-full h-52 object-cover md:w-44 md:h-44 md:shrink-0"
        />

        {/* Información */}
        <div className="flex-1 min-w-0 p-5 md:p-8 flex flex-col justify-center">

          <h3 className="text-2xl md:text-3xl font-semibold text-white break-words">
            {service.nombre}
          </h3>

          <p className="text-[#B8860B] font-semibold mt-2 break-words">
            {service.precio} • {service.duracion}
          </p>

          <p className="text-gray-400 mt-4 md:mt-5 leading-7 break-words">
            {service.descripcion}
          </p>

        </div>

        {/* Parte derecha */}
        <div className="flex items-center justify-end px-5 pb-5 md:pb-0 md:px-8 md:shrink-0">

          {mode === "services" ? (

            <div className="flex items-center gap-3 md:block md:text-right">

              <p className="text-gray-400 text-sm md:mb-2">
                Ver detalles
              </p>

              <FaChevronRight
                size={20}
                className="text-white"
              />

            </div>

          ) : (

            <div className="flex items-center gap-3 md:block md:text-right">

              {selected ? (

                <div className="flex items-center justify-end gap-2 text-[#B8860B] font-semibold">

                  <span className="text-2xl">✓</span>

                  <p>Seleccionado</p>

                </div>

              ) : (

                <>
                  <p className="text-[#B8860B] text-sm md:mb-2">
                    Seleccionar
                  </p>

                  <FaChevronRight
                    size={20}
                    className="text-[#B8860B]"
                  />
                </>

              )}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default ServiceCard;
