import api from "./api";

// ==========================================
// OBTENER HORARIOS DISPONIBLES
// ==========================================

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


// ==========================================
// CREAR CITA
// ==========================================

export const createAppointment = async (appointment) => {

  const response = await api.post(
    "/appointments",
    appointment
  );

  return response.data.data;
};


// ==========================================
// OBTENER TODAS LAS CITAS
// ==========================================

export const getAppointments = async () => {

  const response = await api.get(
    "/appointments"
  );

  return response.data.data;
};


// ==========================================
// ACTUALIZAR ESTADO DE UNA CITA
// ==========================================

export const updateAppointmentStatus = async (
  appointmentId,
  status
) => {

  const response = await api.patch(
    `/appointments/${appointmentId}/status`,
    {
      status,
    }
  );

  return response.data.data;
};


// ==========================================
// ELIMINAR CITA
// ==========================================

export const deleteAppointment = async (
  appointmentId
) => {

  const response = await api.delete(
    `/appointments/${appointmentId}`
  );

  return response.data;
};