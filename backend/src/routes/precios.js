const express = require('express');
const router = express.Router();
const controller = require('../controllers/precios');

router.get('/', controller.getPrecios);

module.exports = router;
