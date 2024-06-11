const express = require('express');
const {
    sendMessageHandler
} = require('../controllers/assistantController');

const router = express.Router();

router.post('/', sendMessageHandler);

module.exports = router;
