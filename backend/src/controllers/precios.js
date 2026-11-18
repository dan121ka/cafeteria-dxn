const Precios = require('../models/precios');

async function getPrecios(req, res, next) {
  try {
    const data = await Precios.getAll();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { getPrecios };
