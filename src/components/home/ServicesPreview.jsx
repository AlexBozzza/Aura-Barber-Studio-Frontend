import { Link } from "react-router-dom";

function ServicesPreview() {

  const services = [

    {
      nombre: "Protocolo de la Navaja",
      precio: "₡5.000",
      duracion: "30 min"
    },

    {
      nombre: "Protocolo del Duque",
      precio: "₡7.000",
      duracion: "30 min"
    },

    {
      nombre: "Gran Consulado",
      precio: "₡10.000",
      duracion: "1 hora"
    }

  ];

  return (

    <section className="bg-[#111111] py-24">

      <div className="max-w-7xl mx-auto px-5">

        <h2 className="text-center text-4xl font-bold text-white">

          Nuestros Servicios

        </h2>

        <p className="text-center text-gray-400 mt-4">

          Descubre algunos de nuestros protocolos más solicitados.

        </p>


        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {services.map((service, index) => (

            <div
              key={index}
              className="bg-[#1E1E1E] rounded-xl p-8 text-center border border-transparent hover:border-[#B8860B] hover:-translate-y-2 transition-all duration-300"
            >

              <h3 className="text-2xl font-semibold text-white">

                {service.nombre}

              </h3>

              <p className="text-[#B8860B] text-xl mt-5 font-semibold">

                {service.precio}

              </p>

              <p className="text-gray-400 mt-2">

                {service.duracion}

              </p>

            </div>

          ))}

        </div>


        <div className="flex justify-center mt-14">

          <Link
            to="/services"
            className="border border-[#B8860B] px-8 py-3 rounded-md text-white hover:bg-[#B8860B] transition"
          >

            Ver todos los servicios

          </Link>

        </div>

      </div>

    </section>

  );

}

export default ServicesPreview;