const {
  retrieveModelsHandler,
  singleResponseHandler,
  chatResponseHandler,
  streamResponseWs,
} = require('../controllers/openaiController');
const clients = require('../utils/connection');

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
    const sessionId = parsedMsg.data.sessionId;

    if (!clients.has(sessionId)) {
      console.error('Session not found:', sessionId);
      ws.send(JSON.stringify({ error: 'Session not found' }));
      return;
    }

    let { chatHistory } = clients.get(sessionId);

    console.log(`Handling WebSocket action: ${parsedMsg.action}`);

    switch (parsedMsg.action) {
      case 'retrieveModels':
        await retrieveModelsHandler({ body: parsedMsg.data }, res, () => {});
        break;
      case 'singleResponse':
        await singleResponseHandler({ body: parsedMsg.data }, res, () => {});
        break;
      case 'chatResponse':
        chatHistory.push(...parsedMsg.data.messages);
        clients.set(sessionId, { ws, chatHistory });
        await chatResponseHandler({ body: parsedMsg.data }, res, () => {});
        break;
      case 'streamResponse':
        const { model, prompt } = parsedMsg.data;
        chatHistory.push({ role: 'user', content: prompt });
        clients.set(sessionId, { ws, chatHistory });
        await streamResponseWs(model, prompt, ws);
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
