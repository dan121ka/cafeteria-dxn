const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatbot');

router.post('/', controller.prompt);
router.get('/status', controller.status);
router.get('/', controller.status);

module.exports = router;
