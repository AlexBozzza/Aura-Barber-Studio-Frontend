import { useEffect, useState } from "react";
import ServiceCard from "../services/ServiceCard";
import { getActiveServices } from "../../services/serviceService";

function ServicesList() {
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
        }));

        setServices(formattedServices);

      } catch (error) {
        console.error("Error cargando servicios:", error);
      }
    };

    loadServices();
  }, []);

  return (
    <section className="bg-[#161616] py-24">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-center text-5xl font-bold text-white">
          Nuestros Servicios
        </h2>

        <p className="text-center text-gray-400 mt-6 max-w-3xl mx-auto leading-8">
          Descubre nuestros servicios diseñados para ofrecer una experiencia
          de barbería premium, con atención personalizada y productos de la
          más alta calidad.
        </p>

        <div className="mt-16 space-y-8">

          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default ServicesList;