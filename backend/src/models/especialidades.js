const pool = require('../config/database');

const Especialidades = {
  async getAll(categoria = null) {
    let sql = 'SELECT * FROM especialidades WHERE disponible = 1';
    const params = [];
    if (categoria) {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }
    sql += ' ORDER BY orden ASC, id ASC';
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async getDestacados() {
    const [rows] = await pool.query('SELECT * FROM especialidades WHERE disponible = 1 AND destacado = 1 ORDER BY orden ASC');
    return rows;
  },

  async getCategorias() {
    const [rows] = await pool.query('SELECT DISTINCT categoria FROM especialidades WHERE disponible = 1 ORDER BY categoria ASC');
    return rows.map(r => r.categoria);
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM especialidades WHERE id = ?', [id]);
    return rows[0] || null;
  }
};

module.exports = Especialidades;
