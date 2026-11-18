const Configuracion = require('../models/configuracion');

async function getConfiguracion(req, res, next) {
  try {
    const data = await Configuracion.getAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function updateConfiguracion(req, res, next) {
  try {
    const { clave } = req.params;
    const { valor } = req.body;
    if (valor === undefined) {
      return res.status(400).json({ error: 'El valor es requerido' });
    }
    const updated = await Configuracion.update(clave, valor);
    if (!updated) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    res.json({ message: 'Configuración actualizada exitosamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getConfiguracion, updateConfiguracion };
