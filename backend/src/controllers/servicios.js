const Servicios = require('../models/servicios');

async function getServicios(req, res, next) {
  try {
    const servicios = await Servicios.getAll();
    res.json(servicios);
  } catch (error) {
    next(error);
  }
}

async function getServicioById(req, res, next) {
  try {
    const servicio = await Servicios.getById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    next(error);
  }
}

module.exports = { getServicios, getServicioById };
