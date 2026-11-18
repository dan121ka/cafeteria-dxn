const Contactos = require('../models/contactos');

async function createContacto(req, res, next) {
  try {
    const { nombre, email, telefono, asunto, mensaje } = req.body;
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Nombre, email y mensaje son campos obligatorios' });
    }

    const nuevo = await Contactos.create({ nombre, email, telefono, asunto, mensaje });
    res.status(201).json({
      message: '¡Gracias por contactarnos! Tu mensaje ha sido recibido por el equipo de DXN CoffeeHouse.',
      data: nuevo
    });
  } catch (error) {
    next(error);
  }
}

async function getContactos(req, res, next) {
  try {
    const lista = await Contactos.getAll();
    res.json(lista);
  } catch (error) {
    next(error);
  }
}

module.exports = { createContacto, getContactos };
