const pool = require('../config/database');

const Nosotros = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM nosotros ORDER BY orden ASC, id ASC');
    return rows;
  },

  async getBySeccion(seccion) {
    const [rows] = await pool.query('SELECT * FROM nosotros WHERE seccion = ?', [seccion]);
    return rows[0] || null;
  }
};

module.exports = Nosotros;
