import { useState } from "react";

import StepIndicator from "./StepIndicator";
import ServiceSelector from "./ServiceSelector";
import BarberSelector from "./BarberSelector";

function AppointmentWizard() {
  const [step, setStep] = useState(1);

  return (
    <section className="bg-[#111111] py-20">
      <div className="max-w-7xl mx-auto px-5">
        <StepIndicator step={step} />

        {step === 1 && (
          <ServiceSelector
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <BarberSelector
            onNext={() => setStep(3)}
          />
        )}
      </div>
    </section>
  );
}

export default AppointmentWizard;