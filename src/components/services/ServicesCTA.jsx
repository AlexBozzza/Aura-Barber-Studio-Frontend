import { Link } from "react-router-dom";

function ServicesCTA() {

  return (

    <section className="bg-[#111111] py-24">

      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-5xl font-bold text-white">

          ¿Listo para un nuevo look?

        </h2>

        <p className="text-gray-400 mt-6">

          Reserva tu cita y vive la experiencia
          Aura Barber Studio.

        </p>

        <Link to="/appointments">

          <button className="mt-10 bg-yellow-600 hover:bg-yellow-500 transition px-10 py-4 rounded-md text-white text-lg">

            Reservar ahora

          </button>

        </Link>

      </div>

    </section>

  );

}

export default ServicesCTA;