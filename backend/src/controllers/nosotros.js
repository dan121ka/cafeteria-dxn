const Nosotros = require('../models/nosotros');

async function getNosotros(req, res, next) {
  try {
    const data = await Nosotros.getAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getNosotrosBySeccion(req, res, next) {
  try {
    const data = await Nosotros.getBySeccion(req.params.seccion);
    if (!data) {
      return res.status(404).json({ error: 'Sección no encontrada' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getNosotros, getNosotrosBySeccion };
