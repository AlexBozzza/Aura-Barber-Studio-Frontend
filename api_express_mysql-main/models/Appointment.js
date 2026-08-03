/**
 * Modelo Appointment
 * @description Maneja todas las consultas SQL de citas
 */

const { pool } = require("../config/database");

class Appointment {

  // ✅ Crear nueva cita
  static async create(data) {

    const {
      user_id,
      barber_id,
      service_id,
      appointment_date,
      start_time,
      end_time,
      status = "PENDING",
      notes = null
    } = data;

    const [result] = await pool.execute(
      `INSERT INTO appointments
      (
        user_id,
        barber_id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        status,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        barber_id,
        service_id,
        appointment_date,
        start_time,
        end_time,
        status,
        notes
      ]
    );

    return this.findById(result.insertId);
  }


  // ✅ Buscar cita por ID
  static async findById(id) {

    const [rows] = await pool.execute(
      `SELECT
          a.*,
          u.first_name,
          u.last_name,
          b.user_id AS barber_user_id,
          s.name AS service_name,
          s.duration,
          s.price
      FROM appointments a
      INNER JOIN users u
          ON a.user_id = u.id
      INNER JOIN barbers b
          ON a.barber_id = b.id
      INNER JOIN services s
          ON a.service_id = s.id
      WHERE a.id = ?`,
      [id]
    );

    return rows[0] || null;
  }


  // ✅ Obtener todas las citas
  static async findAll() {

    const [rows] = await pool.execute(
      `SELECT
          a.*,
          u.first_name,
          u.last_name,
          s.name AS service_name
      FROM appointments a
      INNER JOIN users u
          ON a.user_id = u.id
      INNER JOIN services s
          ON a.service_id = s.id
      ORDER BY appointment_date DESC, start_time ASC`
    );

    return rows;
  }


  // ✅ Obtener citas por fecha
  static async findByDate(appointment_date) {

    const [rows] = await pool.execute(
      `SELECT *
      FROM appointments
      WHERE appointment_date = ?
      ORDER BY start_time ASC`,
      [appointment_date]
    );

    return rows;
  }


  // ✅ Obtener citas de un barbero en una fecha
  static async findByBarberAndDate(barber_id, appointment_date) {

    const [rows] = await pool.execute(
      `SELECT *
      FROM appointments
      WHERE barber_id = ?
      AND appointment_date = ?
      ORDER BY start_time ASC`,
      [barber_id, appointment_date]
    );

    return rows;
  }


  // ✅ Obtener citas de un usuario
  static async findByUser(user_id) {

    const [rows] = await pool.execute(
      `SELECT *
      FROM appointments
      WHERE user_id = ?
      ORDER BY appointment_date DESC`,
      [user_id]
    );

    return rows;
  }


  // ✅ Verificar disponibilidad del horario
  static async isTimeAvailable(
    barber_id,
    appointment_date,
    start_time,
    end_time
  ) {

    const [rows] = await pool.execute(
      `SELECT id
      FROM appointments
      WHERE barber_id = ?
      AND appointment_date = ?
      AND status IN ('PENDING','CONFIRMED')
      AND (
            start_time < ?
        AND end_time > ?
      )
      LIMIT 1`,
      [
        barber_id,
        appointment_date,
        end_time,
        start_time
      ]
    );

    return rows.length === 0;
  }


  // ✅ Obtener duración del servicio
  static async getServiceDuration(service_id) {

    const [rows] = await pool.execute(
      `SELECT duration
      FROM services
      WHERE id = ?`,
      [service_id]
    );

    return rows[0] || null;
  }

  // ✅ Obtener duración de un servicio
static async getServiceDuration(service_id) {

  const [rows] = await pool.execute(
    `SELECT
        id,
        duration,
        price,
        name
     FROM services
     WHERE id = ?`,
    [service_id]
  );

  return rows[0] || null;

}

  // ✅ Cambiar estado
  static async updateStatus(id, status) {

    await pool.execute(
      `UPDATE appointments
      SET status = ?
      WHERE id = ?`,
      [
        status,
        id
      ]
    );

    return this.findById(id);
  }


  // ✅ Eliminar cita
  static async delete(id) {

    const [result] = await pool.execute(
      `DELETE FROM appointments
      WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }

}

module.exports = Appointment;