const express = require('express');
const {
    retrieveModelsHandler,
    singleResponseHandler,
    chatResponseHandler,
    createBatchHandler,
    retrieveBatchHandler,
    cancelBatchHandler,
    listBatchesHandler,
    streamResponseHandler
} = require('../controllers/openaiController');

const router = express.Router();

router.get('/', retrieveModelsHandler);

router.post('/single', singleResponseHandler);

router.post('/chat', chatResponseHandler);

router.post('/streaming', streamResponseHandler);

router.post('/batch', createBatchHandler);

router.get('/batch/:batchId', retrieveBatchHandler);

router.post('/batch/:batchId/cancel', cancelBatchHandler);

router.get('/batch', listBatchesHandler);

module.exports = router;
