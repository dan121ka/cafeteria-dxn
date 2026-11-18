const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Probar conexión a MySQL
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a MySQL XAMPP (Base de datos: ' + (process.env.DB_NAME || 'cafeteria_dxn') + ')');
    connection.release();

    app.listen(PORT, () => {
      console.log(`☕ DXN CoffeeHouse API corriendo en http://localhost:${PORT}`);
      console.log(`📡 Endpoints disponibles:`);
      console.log(`   - http://localhost:${PORT}/api/configuracion`);
      console.log(`   - http://localhost:${PORT}/api/servicios`);
      console.log(`   - http://localhost:${PORT}/api/especialidades`);
      console.log(`   - http://localhost:${PORT}/api/nosotros`);
      console.log(`   - http://localhost:${PORT}/api/precios`);
      console.log(`   - http://localhost:${PORT}/api/galeria`);
      console.log(`   - http://localhost:${PORT}/api/contactos`);
      console.log(`   - http://localhost:${PORT}/api/chatbot`);
    });
  } catch (error) {
    console.error('❌ Error fatal al conectar con la base de datos:', error.message);
    process.exit(1);
  }
}

start();
