/**
 * Controlador de Citas
 */

const Appointment = require("../models/Appointment");

class AppointmentController {

  // ✅ Crear cita
  static async createAppointment(req, res) {

    try {

      const {
        user_id,
        barber_id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        notes
      } = req.body;

      // Validaciones básicas
      if (
        !user_id ||
        !barber_id ||
        !service_id ||
        !appointment_date ||
        !start_time ||
        !end_time
      ) {
        return res.status(400).json({
          success: false,
          message: "Datos incompletos"
        });
      }

      // Verificar disponibilidad
      const available = await Appointment.isTimeAvailable(
        barber_id,
        appointment_date,
        start_time,
        end_time
      );

      if (!available) {
        return res.status(409).json({
          success: false,
          message: "El horario seleccionado ya está ocupado"
        });
      }

      const appointment = await Appointment.create({
        user_id,
        barber_id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        notes
      });

      res.status(201).json({
        success: true,
        message: "Cita creada correctamente",
        data: appointment
      });

    } catch (error) {

      console.error("Error creando cita:", error);

      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });

    }

  }


  // ✅ Obtener todas
  static async getAppointments(req, res) {

    try {

      const appointments = await Appointment.findAll();

      res.json({
        success: true,
        data: appointments
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Error obteniendo citas"
      });

    }

  }


  // ✅ Obtener por ID
  static async getAppointmentById(req, res) {

    try {

      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Cita no encontrada"
        });
      }

      res.json({
        success: true,
        data: appointment
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Error obteniendo cita"
      });

    }

  }


  // ✅ Obtener por fecha
  static async getAppointmentsByDate(req, res) {

    try {

      const { appointment_date } = req.query;

      const appointments =
        await Appointment.findByDate(appointment_date);

      res.json({
        success: true,
        data: appointments
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Error obteniendo citas"
      });

    }

  }


  // ✅ Obtener agenda de un barbero
  static async getBarberAppointments(req, res) {

    try {

      const { barber_id, appointment_date } = req.query;

      const appointments =
        await Appointment.findByBarberAndDate(
          barber_id,
          appointment_date
        );

      res.json({
        success: true,
        data: appointments
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Error obteniendo agenda"
      });

    }

  }

// ✅ Obtener horarios disponibles
static async getAvailableSlots(req, res) {

  try {

    console.log("🔥 ENTRÓ A GET AVAILABLE SLOTS");

    const {
      barber_id,
      service_id,
      appointment_date
    } = req.query;

    if (
      !barber_id ||
      !service_id ||
      !appointment_date
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan parámetros"
      });
    }

    // Obtener duración del servicio
    const service =
      await Appointment.getServiceDuration(service_id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Servicio no encontrado"
      });
    }

    const duration = Number(service.duration);

    console.log("Servicio:", service);
    console.log("Duración:", duration);
    console.log("Fecha recibida:", appointment_date);

    // Obtener citas del barbero
    const appointments =
      await Appointment.findByBarberAndDate(
        barber_id,
        appointment_date
      );

    const availableSlots = [];

    const openingMinutes = 10 * 60; // 10:00
    const lunchStart = 13 * 60;     // 13:00
    const lunchEnd = 14 * 60;       // 14:00
    const closingMinutes = 19 * 60; // 19:00

    // Fecha de hoy en formato local YYYY-MM-DD
    const now = new Date();

    const today =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    console.log("Hoy:", today);

    for (
      let minutes = openingMinutes;
      minutes <= closingMinutes - duration;
      minutes += 15
    ) {

      const endMinutes = minutes + duration;

      // No cruzar el almuerzo
      if (
        minutes < lunchEnd &&
        endMinutes > lunchStart
      ) {
        continue;
      }

      // No salir después del cierre
      if (endMinutes > closingMinutes) {
        continue;
      }

      // Si la reserva es para hoy,
      // ocultar horarios ya pasados
      if (appointment_date === today) {

        const currentMinutes =
          now.getHours() * 60 +
          now.getMinutes();

        if (minutes <= currentMinutes + 30) {
          continue;
        }

      }

      const startHour = String(
        Math.floor(minutes / 60)
      ).padStart(2, "0");

      const startMinute = String(
        minutes % 60
      ).padStart(2, "0");

      const endHour = String(
        Math.floor(endMinutes / 60)
      ).padStart(2, "0");

      const endMinute = String(
        endMinutes % 60
      ).padStart(2, "0");

      const startTime =
        `${startHour}:${startMinute}:00`;

      const endTime =
        `${endHour}:${endMinute}:00`;

      let occupied = false;

      for (const appointment of appointments) {

        if (
          startTime < appointment.end_time &&
          endTime > appointment.start_time
        ) {
          occupied = true;
          break;
        }

      }

      if (!occupied) {

        availableSlots.push({
          start_time: startTime,
          end_time: endTime
        });

      }

    }

    console.log("Horarios disponibles:", availableSlots);

    res.json({
      success: true,
      data: availableSlots
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error obteniendo horarios disponibles"
    });

  }

}


  // ✅ Cambiar estado
  static async updateStatus(req, res) {

    try {

      const { id } = req.params;
      const { status } = req.body;

      const appointment =
        await Appointment.updateStatus(id, status);

      res.json({
        success: true,
        message: "Estado actualizado correctamente",
        data: appointment
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Error actualizando estado"
      });

    }

  }


  // ✅ Eliminar cita
  static async deleteAppointment(req, res) {

    try {

      await Appointment.delete(req.params.id);

      res.json({
        success: true,
        message: "Cita eliminada correctamente"
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message: "Error eliminando cita"
      });

    }

  }

}

module.exports = AppointmentController;