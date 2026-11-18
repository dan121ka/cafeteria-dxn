const express = require('express');
const router = express.Router();
const controller = require('../controllers/galeria');

router.get('/', controller.getGaleria);

module.exports = router;
