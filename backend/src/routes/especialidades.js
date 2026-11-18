const express = require('express');
const router = express.Router();
const controller = require('../controllers/especialidades');

router.get('/', controller.getEspecialidades);
router.get('/categorias', controller.getCategorias);
router.get('/:id', controller.getEspecialidadById);

module.exports = router;
