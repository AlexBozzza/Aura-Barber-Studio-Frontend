
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";

function Hero() {
  return (
    <section
      className="relative h-screen min-h-[600px] lg:min-h-0 bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white max-w-full break-words">
          AuraBarberStudio
        </h1>

        <p className="mt-5 text-base sm:text-lg lg:text-xl text-gray-300">
          Experiencia premium en cada corte
        </p>

        <Link
          to="/appointments"
          className="mt-8 lg:mt-10 bg-yellow-600 hover:bg-yellow-500 px-6 lg:px-8 py-3 lg:py-4 rounded-md text-white text-base lg:text-lg transition"
        >
          Reservar cita
        </Link>
      </div>
    </section>
  );
}

export default Hero;
