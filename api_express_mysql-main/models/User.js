const { pool } = require('../config/database');

class User {
    constructor(data) {
        this.id = data.id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.role = data.role;
        this.profile_image = data.profile_image;
        this.is_active = data.is_active;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // ✅ Obtener todos los usuarios
    static async findAll() {
        const [rows] = await pool.query(
            `SELECT 
                id,
                first_name,
                last_name,
                email,
                phone,
                role,
                profile_image,
                is_active,
                created_at,
                updated_at
            FROM users
            ORDER BY created_at DESC`
        );

        return rows;
    }

    // ✅ Buscar usuario por ID
    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                role,
                profile_image,
                is_active,
                created_at,
                updated_at
            FROM users
            WHERE id = ?`,
            [id]
        );

        return rows[0] || null;
    }

    // ✅ Buscar usuario por email
    static async findByEmail(email) {
        const [rows] = await pool.query(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                role,
                profile_image,
                is_active,
                created_at,
                updated_at
            FROM users
            WHERE email = ?`,
            [email]
        );

        return rows[0] || null;
    }

    // ✅ Buscar usuario con contraseña (para login)
    static async findByEmailWithPassword(email) {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        return rows[0] || null;
    }

    // ✅ Crear usuario
    static async create({
        first_name,
        last_name,
        email,
        phone,
        password
    }) {
        const [result] = await pool.query(
            `INSERT INTO users (
                first_name,
                last_name,
                email,
                phone,
                password
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                first_name,
                last_name,
                email,
                phone,
                password
            ]
        );

        return this.findById(result.insertId);
    }

    // ✅ Actualizar usuario
    static async updateUser(
        id,
        {
            first_name,
            last_name,
            email,
            phone
        }
    ) {
        const sql = `
            UPDATE users
            SET
                first_name = ?,
                last_name = ?,
                email = ?,
                phone = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

        await pool.query(
            sql,
            [
                first_name,
                last_name,
                email,
                phone,
                id
            ]
        );

        return this.findById(id);
    }
}

module.exports = User;