const pool = require('../config/database');

const Contactos = {
  async create(data) {
    const { nombre, email, telefono, asunto, mensaje } = data;
    const [result] = await pool.query(
      'INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, telefono || null, asunto || 'Consulta general', mensaje]
    );
    return { id: result.insertId, ...data, fecha_creacion: new Date() };
  },

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM contactos ORDER BY fecha_creacion DESC');
    return rows;
  }
};

module.exports = Contactos;
