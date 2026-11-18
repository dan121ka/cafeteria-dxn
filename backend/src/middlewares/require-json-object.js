function requireJsonObject(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (req.is('application/json') && (typeof req.body !== 'object' || Array.isArray(req.body) || req.body === null)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un objeto JSON válido' });
    }
  }
  next();
}

module.exports = requireJsonObject;
