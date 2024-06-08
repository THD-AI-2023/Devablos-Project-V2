const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const clients = require('../utils/connection');
const openaiWsRoutes = require('../routes/openaiWsRoutes');

dotenv.config();

const WS_PORT = process.env.WS_PORT || 5001;

const server = new WebSocket.Server({ port: WS_PORT });

server.on('connection', (ws, req) => {
  ws.on('message', async (message) => {
    try {
      const parsedMsg = JSON.parse(message);
      const { sessionId } = parsedMsg.data;

      if (!sessionId) {
        console.error('No sessionId provided in message:', message);
        ws.send(JSON.stringify({ error: 'No sessionId provided' }));
        return;
      }

      if (!clients.has(sessionId)) {
        clients.set(sessionId, { ws, chatHistory: [] });
      } else {
        const clientData = clients.get(sessionId);
        clientData.ws = ws;
        clients.set(sessionId, clientData);
      }

      console.log(`Client connected: ${sessionId}`);

      await openaiWsRoutes.handleWebSocket(ws, req, message);
    } catch (error) {
      console.error(`Error handling message:`, error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.on('close', () => {
    clients.forEach((clientData, sessionId) => {
      if (clientData.ws === ws) {
        clients.delete(sessionId);
        console.log(`Client disconnected: ${sessionId}`);
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
