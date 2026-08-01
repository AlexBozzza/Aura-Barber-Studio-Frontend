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