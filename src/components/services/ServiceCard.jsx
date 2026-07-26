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
          src={service.imagen}
          alt={service.nombre}
          className="w-44 h-44 object-cover"
        />

        {/* Información */}

        <div className="flex-1 p-8 flex flex-col justify-center">

          <h3 className="text-3xl font-semibold text-white">
            {service.nombre}
          </h3>

          <p className="text-[#B8860B] font-semibold mt-2">
            {service.precio} • {service.duracion}
          </p>

          <p className="text-gray-400 mt-5 leading-7">
            {service.descripcion}
          </p>

        </div>

        {/* Parte derecha */}

        <div className="flex items-center px-8">

          {mode === "services" ? (

            <div className="text-right">

              <p className="text-gray-400 text-sm mb-2">
                Ver detalles
              </p>

              <FaChevronRight
                size={24}
                className="text-white ml-auto"
              />

            </div>

          ) : (

            <div className="text-right">

              {selected ? (

                <div className="flex items-center justify-end gap-2 text-[#B8860B] font-semibold">

                  <span className="text-2xl">
                    ✓
                  </span>

                  <p>
                    Seleccionado
                  </p>

                </div>

              ) : (

                <>

                  <p className="text-[#B8860B] text-sm mb-2">
                    Seleccionar
                  </p>

                  <FaChevronRight
                    size={24}
                    className="text-[#B8860B] ml-auto"
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