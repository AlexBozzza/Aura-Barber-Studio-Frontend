import api from "./api";

export const getAvailableSlots = async (
  barberId,
  serviceId,
  appointmentDate
) => {

  const response = await api.get(
    "/appointments/available-slots",
    {
      params: {
        barber_id: barberId,
        service_id: serviceId,
        appointment_date: appointmentDate,
      },
    }
  );

  return response.data.data;

};

export const createAppointment = async (appointment) => {

  const response = await api.post(
    "/appointments",
    appointment
  );

  return response.data.data;

};