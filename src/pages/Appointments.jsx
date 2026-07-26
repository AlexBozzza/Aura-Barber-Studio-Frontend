import MainLayout from "../layouts/MainLayout";

import AppointmentHero from "../components/appointments/AppointmentHero";
import AppointmentWizard from "../components/appointments/AppointmentWizard";

function Appointments() {
  return (
    <MainLayout>
      <AppointmentHero />
      <AppointmentWizard />
    </MainLayout>
  );
}

export default Appointments;