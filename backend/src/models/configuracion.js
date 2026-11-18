const pool = require('../config/database');

const Configuracion = {
  async getAll() {
    const [rows] = await pool.query('SELECT clave, valor, tipo, descripcion FROM configuracion');
    // Convertir a un objeto clave-valor para fácil consumo en frontend
    const configMap = {};
    for (const row of rows) {
      configMap[row.clave] = row.valor;
    }
    return { list: rows, map: configMap };
  },

  async getByClave(clave) {
    const [rows] = await pool.query('SELECT * FROM configuracion WHERE clave = ?', [clave]);
    return rows[0] || null;
  },

  async update(clave, valor) {
    const [result] = await pool.query('UPDATE configuracion SET valor = ? WHERE clave = ?', [valor, clave]);
    return result.affectedRows > 0;
  }
};

module.exports = Configuracion;
