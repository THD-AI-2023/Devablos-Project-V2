const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const clients = require('../utils/connection');
const assistanceRoutes = require('../routes/assistantRoutes');
const assistantServices = require('../services/assistantService');

dotenv.config();

const WS_PORT = process.env.WS_PORT || 5001;

const server = new WebSocket.Server({ port: WS_PORT });

server.on('connection', (ws, req) => {
  ws.on('message', async (message) => {
    try {
      const parsedMsg = JSON.parse(message);
      const { action, data = {} } = parsedMsg;
      const { sessionId } = data;

      switch (action) {
        case 'validateSession':
          if (clients.has(sessionId)) {
            ws.send(JSON.stringify({ action: 'sessionValidated', valid: true }));
          } else {
            const newSessionId = await assistantServices.create_user();
            ws.send(JSON.stringify({ action: 'sessionValidated', valid: false, sessionId: newSessionId }));
          }
          break;

        case 'createSession':
          const newSessionId = await assistantServices.create_user();
          ws.send(JSON.stringify({ action: 'sessionValidated', sessionId: newSessionId }));
          break;

        case 'clearThread':
          if (clients.has(sessionId)) {
            assistantServices.removeThread(sessionId);
          }
          break;

        default:
          if (!sessionId) {
            ws.send(JSON.stringify({ error: 'No sessionId provided' }));
            return;
          }
          if (!clients.has(sessionId)) {
            clients.set(sessionId, { ws, chatHistory: messages });
          } else {
            const clientData = clients.get(sessionId);
            clientData.ws = ws;
            clientData.chatHistory = messages;
            clients.set(sessionId, clientData);
          }
          await assistanceRoutes.handleWebSocket(ws, req, message);
      }
    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.on('close', () => {
    clients.forEach((clientData, sessionId) => {
      if (clientData.ws === ws) {
        clients.delete(sessionId);
      }
    });
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error:`, error);
  });

  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: 'Session is being kept alive.' }));
    }
  }, 14 * 60 * 1000); // 14 minutes to send a keep-alive message
});

console.log(`WebSocket server is listening on port ${WS_PORT}`);
