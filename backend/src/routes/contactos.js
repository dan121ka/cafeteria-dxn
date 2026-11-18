const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactos');

router.post('/', controller.createContacto);
router.get('/', controller.getContactos);

module.exports = router;
