const express = require('express');
const { singleResponseHandler, batchResponseHandler, streamResponseHandler } = require('../controllers/openaiController');

const router = express.Router();

router.post('/single', singleResponseHandler);

router.post('/batch', batchResponseHandler);

router.post('/streaming', streamResponseHandler);

module.exports = router;
