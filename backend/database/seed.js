const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  try {
    console.log('🌱 Ejecutando seed en MySQL...');
    const sql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
    await connection.query(sql);
    console.log('✅ Base de datos cafeteria_dxn creada y poblada exitosamente.');
  } catch (err) {
    console.error('❌ Error al poblar la base de datos:', err);
  } finally {
    await connection.end();
  }
}

seed();
