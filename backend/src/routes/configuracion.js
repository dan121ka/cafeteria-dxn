const express = require('express');
const router = express.Router();
const controller = require('../controllers/configuracion');

router.get('/', controller.getConfiguracion);
router.put('/:clave', controller.updateConfiguracion);

module.exports = router;
