function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(status).json({
    error: message,
    status,
  });
}

module.exports = errorHandler;
