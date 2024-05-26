const express = require('express');
const {
    singleResponseHandler,
    chatResponseHandler,
    createBatchHandler,
    retrieveBatchHandler,
    cancelBatchHandler,
    listBatchesHandler,
    streamResponseHandler
} = require('../controllers/openaiController');

const router = express.Router();

router.post('/single', singleResponseHandler);

router.post('/chat', chatResponseHandler);

router.post('/batch', batchResponseHandler);

router.post('/streaming', streamResponseHandler);

router.post('/batch', createBatchHandler);

router.get('/batch/:batchId', retrieveBatchHandler);

router.post('/batch/:batchId/cancel', cancelBatchHandler);

router.get('/batch', listBatchesHandler);

module.exports = router;
