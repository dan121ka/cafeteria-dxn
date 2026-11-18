const Especialidades = require('../models/especialidades');

async function getEspecialidades(req, res, next) {
  try {
    const { categoria, destacados } = req.query;
    if (destacados === 'true') {
      const data = await Especialidades.getDestacados();
      return res.json(data);
    }
    const data = await Especialidades.getAll(categoria || null);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getCategorias(req, res, next) {
  try {
    const categorias = await Especialidades.getCategorias();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
}

async function getEspecialidadById(req, res, next) {
  try {
    const item = await Especialidades.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Producto o especialidad no encontrado' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
}

module.exports = { getEspecialidades, getCategorias, getEspecialidadById };
