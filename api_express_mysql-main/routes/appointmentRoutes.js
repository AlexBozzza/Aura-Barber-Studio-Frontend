/**
 * Rutas de Citas
 */

const express = require("express");
const router = express.Router();

const AppointmentController = require("../controllers/appointmentController");

// ✅ Obtener horarios disponibles
router.get(
  "/available-slots",
  AppointmentController.getAvailableSlots
);

// ✅ Obtener todas las citas
router.get(
  "/",
  AppointmentController.getAppointments
);

// ✅ Obtener citas por fecha
router.get(
  "/date",
  AppointmentController.getAppointmentsByDate
);

// ✅ Obtener agenda de un barbero
router.get(
  "/barber",
  AppointmentController.getBarberAppointments
);

// ✅ Obtener cita por ID
router.get(
  "/:id",
  AppointmentController.getAppointmentById
);

// ✅ Crear cita
router.post(
  "/",
  AppointmentController.createAppointment
);

// ✅ Cambiar estado de la cita
router.patch(
  "/:id/status",
  AppointmentController.updateStatus
);

// ✅ Eliminar cita
router.delete(
  "/:id",
  AppointmentController.deleteAppointment
);

module.exports = router;