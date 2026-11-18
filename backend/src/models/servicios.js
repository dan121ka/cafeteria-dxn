const pool = require('../config/database');

const Servicios = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM servicios WHERE activo = 1 ORDER BY orden ASC, id ASC');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM servicios WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(data) {
    const { titulo, subtitulo, descripcion, icono, imagen, orden } = data;
    const [result] = await pool.query(
      'INSERT INTO servicios (titulo, subtitulo, descripcion, icono, imagen, orden) VALUES (?, ?, ?, ?, ?, ?)',
      [titulo, subtitulo, descripcion, icono || 'bi-cup-hot', imagen, orden || 0]
    );
    return { id: result.insertId, ...data };
  }
};

module.exports = Servicios;
