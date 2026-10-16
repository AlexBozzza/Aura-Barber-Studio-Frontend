
function StepIndicator({ step = 1 }) {
  const steps = [
    "Servicio",
    "Barbero",
    "Fecha",
    "Confirmar",
  ];

  return (
    <section className="bg-[#181818] py-5 md:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">

        <p className="text-center text-gray-400">
          Paso {step} de 4
        </p>

        {/* Indicador de pasos */}
        <div className="flex justify-center items-center mt-6 w-full">

          {steps.map((title, index) => {
            const currentStep = index + 1;
            const active = currentStep === step;

            return (
              <div
                key={title}
                className="flex items-center flex-1 min-w-0"
              >
                {/* Número */}
                <div
                  className={`
                    w-9 h-9 md:w-10 md:h-10
                    shrink-0
                    rounded-full
                    flex items-center justify-center
                    text-sm md:text-base
                    font-semibold
                    transition-all duration-300
                    ${
                      active
                        ? "bg-[#B8860B] text-white"
                        : "bg-gray-700 text-gray-300"
                    }
                  `}
                >
                  {currentStep}
                </div>

                {/* Línea entre pasos */}
                {currentStep < 4 && (
                  <div className="flex-1 min-w-2 h-1 bg-gray-600 mx-1.5 md:mx-4" />
                )}
              </div>
            );
          })}

        </div>

        {/* Nombres de los pasos */}
        <div className="grid grid-cols-4 mt-4 text-center gap-0">

          {steps.map((title, index) => (
            <p
              key={title}
              className={`
                min-w-0
                text-xs sm:text-sm md:text-base
                break-words
                ${
                  index + 1 === step
                    ? "text-[#B8860B] font-semibold"
                    : "text-gray-400"
                }
              `}
            >
              {title}
            </p>
          ))}

        </div>

      </div>
    </section>
  );
}

export default StepIndicator;
