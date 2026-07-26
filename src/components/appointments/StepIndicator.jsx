function StepIndicator({ step = 1 }) {
  const steps = [
    "Servicio",
    "Barbero",
    "Fecha",
    "Confirmar",
  ];

  return (
    <section className="bg-[#181818] py-8">

      <div className="max-w-4xl mx-auto">

        <p className="text-center text-gray-400">
          Paso {step} de 4
        </p>

        <div className="flex justify-center items-center gap-4 mt-6">

          {steps.map((title, index) => {

            const currentStep = index + 1;
            const active = currentStep === step;

            return (
              <div
                key={title}
                className="flex items-center"
              >

                <div
                  className={`
                    w-10
                    h-10
                    rounded-full
                    flex
                    items-center
                    justify-center
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      active
                        ? "bg-[#B8860B] text-white"
                        : "bg-gray-700 text-gray-300"
                    }
                  `}
                >
                  {currentStep}
                </div>

                {currentStep < 4 && (
                  <div className="w-20 h-1 bg-gray-600 mx-4" />
                )}

              </div>
            );

          })}

        </div>

        <div className="flex justify-center gap-12 mt-4">

          {steps.map((title, index) => (

            <p
              key={title}
              className={`${
                index + 1 === step
                  ? "text-[#B8860B] font-semibold"
                  : "text-gray-400"
              }`}
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