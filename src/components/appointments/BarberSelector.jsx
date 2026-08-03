import { useEffect, useState } from "react";
import BarberCard from "./BarberCard";
import { getAvailableBarbers } from "../../services/barberService";

function BarberSelector({
  onNext,
  selectedBarber,
  setSelectedBarber,
  service,
}) {

  const [barbers, setBarbers] = useState([]);

  useEffect(() => {

    const loadBarbers = async () => {

      try {

        const data = await getAvailableBarbers();

        let formattedBarbers = data.map((barber) => ({
          id: barber.id,
          nombre: `${barber.first_name} ${barber.last_name}`,
          cargo: "Barbero Profesional",
          experiencia: `${barber.experience_years} años de experiencia`,
          imagen: barber.image,
          especialidades: barber.services.map((s) => s.name),
          services: barber.services
        }));

        // Mostrar únicamente los barberos que realizan
        // el servicio seleccionado
        if (service) {

          formattedBarbers = formattedBarbers.filter((barber) =>
            barber.services.some((s) => s.id === service.id)
          );

        }

        setBarbers(formattedBarbers);

      } catch (error) {

        console.error("Error cargando barberos:", error);

      }

    };

    loadBarbers();

  }, [service]);

  return (

    <section className="mt-12">

      <h2 className="text-center text-4xl font-bold text-white">
        Selecciona tu barbero
      </h2>

      <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
        Conoce al profesional que realizará tu servicio y te acompañará durante
        toda la experiencia en Aura Barber Studio.
      </p>

      <div className="mt-10 space-y-8">

        {barbers.map((barber) => (

          <BarberCard
            key={barber.id}
            barber={barber}
            selected={selectedBarber?.id === barber.id}
            onClick={() => setSelectedBarber(barber)}
          />

        ))}

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