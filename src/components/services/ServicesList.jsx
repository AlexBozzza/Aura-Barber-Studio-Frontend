import ServiceCard from "../services/ServiceCard";

import navaja from "../../assets/images/services/protocolo-navaja.jpg";
import legado from "../../assets/images/services/legado-oro.jpg";
import duque from "../../assets/images/services/protocolo-duque.jpg";
import consulado from "../../assets/images/services/gran-consulado.jpg";

function ServicesList() {
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