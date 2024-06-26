const express = require('express');
const {
    sendMessageHandler,
    create_userHandler,
} = require('../controllers/assistantController');

const router = express.Router();

router.get('/user', create_userHandler);
router.post('/sendMessage', sendMessageHandler);

module.exports = router;
