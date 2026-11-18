const Galeria = require('../models/galeria');

async function getGaleria(req, res, next) {
  try {
    const data = await Galeria.getAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getGaleria };
