import { useState } from "react";
import ServiceCard from "../services/ServiceCard";

import navaja from "../../assets/images/services/protocolo-navaja.jpg";
import legado from "../../assets/images/services/legado-oro.jpg";
import duque from "../../assets/images/services/protocolo-duque.jpg";
import consulado from "../../assets/images/services/gran-consulado.jpg";

function ServiceSelector() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      nombre: "Protocolo de la Navaja",
      precio: "₡5.000",
      duracion: "30 minutos",
      descripcion:
        "Recorte y perfilado de barba, aceites y bálsamos de alta calidad.",
      imagen: navaja,
    },
    {
      id: 2,
      nombre: "Legado de Oro",
      precio: "₡5.000",
      duracion: "30 minutos",
      descripcion:
        "Corte de niño al gusto, lavado de cabello y peinado con productos de alta calidad.",
      imagen: legado,
    },
    {
      id: 3,
      nombre: "Protocolo del Duque",
      precio: "₡7.000",
      duracion: "30 minutos",
      descripcion:
        "Incluye un corte clásico, lavado de cabello y peinado con productos premium.",
      imagen: duque,
    },
    {
      id: 4,
      nombre: "Gran Consulado",
      precio: "₡10.000",
      duracion: "1 hora",
      descripcion:
        "Incluye corte de cabello, perfilado y retoque de barba, lavado y peinado premium.",
      imagen: consulado,
    },
  ];

  return (
    <section className="mt-12">

      <h2 className="text-center text-4xl font-bold text-white">
        Selecciona un servicio
      </h2>

      <p className="text-center text-gray-400 mt-4">
        Elige el servicio que deseas reservar.
      </p>

      <div className="mt-12 space-y-8">

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

      <div className="flex flex-col items-center mt-12">

        {selectedService && (

          <div className="text-center mb-6">

            <p className="text-gray-400 text-sm">
              Servicio seleccionado
            </p>

            <h3 className="text-2xl font-semibold text-white mt-2">
              {selectedService.nombre}
            </h3>

            <p className="text-[#B8860B] mt-2">
              {selectedService.precio} • {selectedService.duracion}
            </p>

          </div>

        )}

        <button
          disabled={!selectedService}
          className={`
            px-10
            py-4
            rounded-xl
            font-semibold
            transition-all
            duration-300

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