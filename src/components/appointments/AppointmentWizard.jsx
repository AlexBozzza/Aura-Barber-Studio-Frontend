
import { useState } from "react";

import StepIndicator from "./StepIndicator";
import ServiceSelector from "./ServiceSelector";
import BarberSelector from "./BarberSelector";
import CalendarSelector from "./CalendarSelector";
import ConfirmAppointment from "./ConfirmAppointment";

function AppointmentWizard() {
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <section className="bg-[#111111] py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-5">

        <StepIndicator step={step} />

        {step === 1 && (
          <ServiceSelector
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <BarberSelector
            service={selectedService}
            selectedBarber={selectedBarber}
            setSelectedBarber={setSelectedBarber}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <CalendarSelector
            service={selectedService}
            barber={selectedBarber}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            onNext={({ date, slot }) => {
              setSelectedDate(date);
              setSelectedSlot(slot);
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <ConfirmAppointment
            service={selectedService}
            barber={selectedBarber}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
          />
        )}

      </div>
    </section>
  );
}

export default AppointmentWizard;
