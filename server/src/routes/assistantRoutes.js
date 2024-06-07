const express = require('express');
const {
    sendMessageHandler
} = require('../controllers/assistantController');

const router = express.Router();

router.post('/sendMessage', sendMessageHandler);

module.exports = router;
