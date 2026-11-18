const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatbot');

router.post('/', controller.prompt);

module.exports = router;
