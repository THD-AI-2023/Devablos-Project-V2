const {
  retrieveModelsHandler,
  singleResponseHandler,
  chatResponseHandler,
  createBatchHandler,
  retrieveBatchHandler,
  cancelBatchHandler,
  listBatchesHandler,
  streamResponseHandler,
} = require('../controllers/openaiController');

async function handleWebSocket(ws, req, msg) {
  const res = {
    json: (response) => {
      ws.send(JSON.stringify(response));
    },
    status: (code) => {
      return {
        json: (response) => {
          ws.send(JSON.stringify({ status: code, ...response }));
        },
      };
    },
  };

  try {
    const parsedMsg = JSON.parse(msg);
    switch (parsedMsg.action) {
      case 'retrieveModels': // {"action":"retrieveModels","data":{}}
        await retrieveModelsHandler({ body: parsedMsg.data }, res, () => {});
        break;
      case 'singleResponse': // {"action": "singleResponse", "data": {"model": "gpt-3.5-turbo-instruct", "prompt": "What is the capital of the United States?", "max_tokens": 64}}
        await singleResponseHandler({ body: parsedMsg.data }, res, () => {});
        break;
      case 'chatResponse': // {"action":"chatResponse","data":{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are Devabot ✨, a funny helpful assistant."},{"role":"user","content":"Hello there!"}]}}
        await chatResponseHandler({ body: parsedMsg.data }, res, () => {});
        break;
      case 'createBatch':
        await createBatchHandler({ body: parsedMsg.data }, res, () => {});
        break;
      case 'retrieveBatch':
        await retrieveBatchHandler({ params: parsedMsg.data }, res, () => {});
        break;
      case 'cancelBatch':
        await cancelBatchHandler({ params: parsedMsg.data }, res, () => {});
        break;
      case 'listBatches':
        await listBatchesHandler({ query: parsedMsg.data }, res, () => {});
        break;
      case 'streamResponse': // {"action":"streamResponse","data":{"model":"gpt-3.5-turbo","prompt":"What is the capital of the United States?"}}
        await streamResponseHandler({ body: parsedMsg.data }, res, () => {});
        break;
      default:
        ws.send(JSON.stringify({ error: 'Unknown action' }));
    }
  } catch (error) {
    console.error(`Error processing message:`, error);
    ws.send(JSON.stringify({ error: error.message }));
  }
}

module.exports = { handleWebSocket };
