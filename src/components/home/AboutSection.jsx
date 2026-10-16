import { Link } from "react-router-dom";

function AboutSection() {

  return (

    <section className="bg-black py-28">

      <div className="max-w-4xl mx-auto px-5 text-center">

        <h2 className="text-4xl font-bold text-white">

          Sobre Aura Barber Studio

        </h2>

        <p className="text-gray-400 mt-8 leading-8 max-w-2xl mx-auto">

          En Aura Barber Studio creemos que un corte de cabello va mucho más allá
          de un simple servicio. Nos enfocamos en brindar una experiencia premium,
          atención personalizada y productos de alta calidad para que cada visita
          sea única y refleje tu estilo.

        </p>

        <Link
          to="/contact"
          className="inline-block mt-10 bg-[#B8860B] hover:bg-[#DAA520] px-8 py-4 rounded-md text-white transition duration-300"
        >

          Ver nuestra ubicación

        </Link>

      </div>

    </section>

  );

}

export default AboutSection;