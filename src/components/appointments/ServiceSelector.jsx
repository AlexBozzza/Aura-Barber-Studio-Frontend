
import { useEffect, useState } from "react";
import ServiceCard from "../services/ServiceCard";
import { getActiveServices } from "../../services/serviceService";

function ServiceSelector({
  onNext,
  selectedService,
  setSelectedService,
}) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getActiveServices();

        const formattedServices = data.map((service) => ({
          id: service.id,
          nombre: service.name,
          precio: `₡${Number(service.price).toLocaleString("es-CR")}`,
          duracion: `${service.duration} minutos`,
          descripcion: service.description,
          imagen: service.image,
          duration: service.duration,
          price: service.price,
        }));

        setServices(formattedServices);
      } catch (error) {
        console.error("Error cargando servicios:", error);
      }
    };

    loadServices();
  }, []);

  return (
    <section className="mt-8 md:mt-12">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-white">
        Selecciona un servicio
      </h2>

      <p className="text-center text-sm md:text-base text-gray-400 mt-3 md:mt-4 px-2">
        Elige el servicio que deseas reservar.
      </p>

      <div className="mt-7 md:mt-12 space-y-5 md:space-y-8">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            mode="booking"
            selected={selectedService?.id === service.id}
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center mt-8 md:mt-12 px-2">
        {selectedService && (
          <div className="text-center mb-6 max-w-full">
            <p className="text-gray-400 text-sm">
              Servicio seleccionado
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-white mt-2 break-words">
              {selectedService.nombre}
            </h3>

            <p className="text-[#B8860B] mt-2">
              {selectedService.precio} • {selectedService.duracion}
            </p>
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!selectedService}
          className={`
            w-full sm:w-auto
            px-10 py-3 md:py-4
            rounded-xl
            font-semibold
            transition-all duration-300
            ${
              selectedService
                ? "bg-[#B8860B] hover:bg-[#DAA520] text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Continuar
        </button>
      </div>
    </section>
  );
}

export default ServiceSelector;
