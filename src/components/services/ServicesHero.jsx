import heroImage from "../../assets/hero.png";

function ServicesHero() {
  return (
    <section
      className="relative h-[60vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">

        <h1 className="text-6xl font-bold text-white">
          Servicios
        </h1>

        <p className="mt-4 text-xl text-gray-300">
          Calidad • Estilo • Experiencia
        </p>

      </div>
    </section>
  );
}

export default ServicesHero;