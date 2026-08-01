import { useState } from "react";
import BarberCard from "./BarberCard";

import barberImage from "../../assets/images/barbers/andrey.jpg";

function BarberSelector({ onNext }) {
  const [selectedBarber, setSelectedBarber] = useState(null);

  const barber = {
    id: 1,
    nombre: "Andrey Vargas",
    cargo: "Barbero Profesional",
    experiencia: "Más de 10 años de experiencia",
    imagen: barberImage,
    especialidades: [
      "Cortes clásicos",
      "Fade",
      "Perfilado de barba",
      "Estilos modernos",
    ],
  };

  return (
    <section className="mt-12">
      <h2 className="text-center text-4xl font-bold text-white">
        Selecciona tu barbero
      </h2>

      <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
        Conoce al profesional que realizará tu servicio y te acompañará durante
        toda la experiencia en Aura Barber Studio.
      </p>

      <div className="mt-10">
        <BarberCard
          barber={barber}
          selected={selectedBarber?.id === barber.id}
          onClick={() => setSelectedBarber(barber)}
        />
      </div>

      <div className="flex flex-col items-center mt-8">
        {selectedBarber && (
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              Barbero seleccionado
            </p>

            <h3 className="text-2xl font-semibold text-white mt-2">
              {selectedBarber.nombre}
            </h3>

            <p className="text-[#B8860B] mt-2">
              {selectedBarber.cargo}
            </p>
          </div>
        )}

        <button
          onClick={onNext}
          disabled={!selectedBarber}
          className={`
            px-10
            py-4
            rounded-xl
            font-semibold
            transition-all
            duration-300
            shadow-lg

            ${
              selectedBarber
                ? "bg-[#B8860B] hover:bg-[#DAA520] hover:scale-105 text-white"
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

export default BarberSelector;