const express = require('express');
const router = express.Router();
const controller = require('../controllers/nosotros');

router.get('/', controller.getNosotros);
router.get('/:seccion', controller.getNosotrosBySeccion);

module.exports = router;
