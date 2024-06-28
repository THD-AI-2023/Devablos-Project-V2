const express = require('express');
const {
    sendMessageHandler,
    create_userHandler,
    removeThreadHandler,
} = require('../controllers/assistantController');

const router = express.Router();

router.get('/user', create_userHandler);
router.post('/sendMessage', sendMessageHandler);
router.post('/removeThread', removeThreadHandler);

module.exports = router;
