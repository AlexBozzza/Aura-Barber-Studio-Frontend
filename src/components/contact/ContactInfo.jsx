
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope
} from "react-icons/fa";

function ContactInfo() {
  return (
    <section className="bg-[#111111] py-12 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">

        {/* Ubicación */}
        <div className="min-w-0">
          <div className="bg-yellow-600 w-16 h-16 rounded-md flex justify-center items-center mx-auto">
            <FaMapMarkerAlt size={28} className="text-white" />
          </div>

          <h2 className="text-white text-2xl md:text-3xl font-bold mt-6 md:mt-8">
            UBICACIÓN
          </h2>

          <div className="text-gray-400 mt-5 md:mt-8 leading-7">
            <p>Costado noroeste de</p>
            <p>Pollo Macho</p>
            <p>Alajuela Centro</p>
          </div>

          {/* Botón para abrir Google Maps */}
          <a
            href="https://www.google.com/maps?ll=10.015075,-84.207797&z=15&t=m&hl=es-AR&gl=US&mapclient=embed&cid=14195062347311821857"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-500 transition duration-300"
          >
            <FaMapMarkerAlt size={18} />
            Cómo llegar
          </a>
        </div>

        {/* Teléfono */}
        <div className="min-w-0">
          <div className="bg-yellow-600 w-16 h-16 rounded-md flex justify-center items-center mx-auto">
            <FaPhoneAlt size={24} className="text-white" />
          </div>

          <h2 className="text-white text-2xl md:text-3xl font-bold mt-6 md:mt-8">
            LLÁMANOS
          </h2>

          <div className="text-gray-400 mt-5 md:mt-8 leading-7">
            <p>Costa Rica</p>
            <a
              href="tel:+50660036788"
              className="hover:text-yellow-500 transition"
            >
              +506 6003-6788
            </a>
          </div>
        </div>

        {/* Correo y redes */}
        <div className="min-w-0">
          <div className="bg-yellow-600 w-16 h-16 rounded-md flex justify-center items-center mx-auto">
            <FaEnvelope size={24} className="text-white" />
          </div>

          <h2 className="text-white text-2xl md:text-3xl font-bold mt-6 md:mt-8">
            ESCRÍBENOS
          </h2>

          <a
            href="mailto:andreyjvl1999@gmail.com"
            className="block text-gray-400 mt-5 md:mt-8 break-words hover:text-yellow-500 transition"
          >
            andreyjvl1999@gmail.com
          </a>

          <div className="flex justify-center gap-8 mt-6 md:mt-8">
            <a
              href="https://instagram.com/andrey_thebarber12"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram
                size={35}
                className="text-white hover:text-yellow-500 transition"
              />
            </a>

            <a
              href="https://wa.me/50660036788"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp
                size={35}
                className="text-white hover:text-yellow-500 transition"
              />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ContactInfo;
