const pool = require('../config/database');

const Galeria = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM galeria ORDER BY orden ASC, id ASC');
    return rows;
  }
};

module.exports = Galeria;
