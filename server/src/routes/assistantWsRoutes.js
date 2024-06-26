const {
  sendMessage,
  create_user,
} = require('../services/assistantService');
const clients = require('../utils/connection');

async function handleWebSocket(ws, req) {
  ws.on('message', async (msg) => {
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
      const { action, data } = parsedMsg;
      const sessionId = data.sessionId;

      switch (action) {
        case 'sendMessage':
          if (!clients.has(sessionId)) {
            console.error('Session not found:', sessionId);
            ws.send(JSON.stringify({ error: 'Session not found' }));
            return;
          }

          let assistant= clients.get(sessionId).assistant;

          console.log(`Handling WebSocket action: ${action}`);

          const newThread = await sendMessage();

          const user = {
            assistant,
            thread: newThread,
          };

          clients.set(sessionId, user);
          break;

        case 'clearThread':
          if (clients.has(sessionId)) {
            assistantServices.removeThread(sessionId);
          }
          break;

        default:
          ws.send(JSON.stringify({ error: 'Unknown action' }));
          break;
      }
    } catch (error) {
      console.error(`Error processing message:`, error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
}

module.exports = { handleWebSocket };
