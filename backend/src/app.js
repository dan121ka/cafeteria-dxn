const path = require('path');
const express = require('express');
const cors = require('./middlewares/cors');
const errorHandler = require('./middlewares/error-handler');
const requireJsonObject = require('./middlewares/require-json-object');

const configuracionRoutes = require('./routes/configuracion');
const serviciosRoutes = require('./routes/servicios');
const especialidadesRoutes = require('./routes/especialidades');
const nosotrosRoutes = require('./routes/nosotros');
const preciosRoutes = require('./routes/precios');
const galeriaRoutes = require('./routes/galeria');
const contactosRoutes = require('./routes/contactos');
const chatbotRoutes = require('./routes/chatbot');

const app = express();

app.disable('x-powered-by');
app.use(cors);

// Archivos estáticos públicos (videos y recursos multimedia locales)
app.use(express.static(path.join(__dirname, '../public')));
app.use('/videos', express.static(path.join(__dirname, '../public/videos')));

app.use(express.json({ limit: '1mb' }));
app.use(requireJsonObject);

// Ruta de estado
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'DXN CoffeeHouse Backend API', timestamp: new Date() });
});

// Rutas de la API (Todo editable desde la BD MySQL)
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/nosotros', nosotrosRoutes);
app.use('/api/precios', preciosRoutes);
app.use('/api/galeria', galeriaRoutes);
app.use('/api/contactos', contactosRoutes);

// Chatbot Ollama + Gemma3 / Barista DXN
app.use('/api/chatbot', chatbotRoutes);
app.use('/ollama-prompt', chatbotRoutes); // Compatibilidad con el formato de muestra

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en la API' });
});

app.use(errorHandler);

module.exports = app;
