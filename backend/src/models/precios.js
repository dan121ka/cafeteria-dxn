const pool = require('../config/database');

const Precios = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM precios ORDER BY orden ASC, id ASC');
    return rows.map(r => ({
      ...r,
      caracteristicas: typeof r.caracteristicas === 'string' ? JSON.parse(r.caracteristicas) : r.caracteristicas
    }));
  }
};

module.exports = Precios;
