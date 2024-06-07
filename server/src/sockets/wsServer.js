const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const clients = require('../utils/connection');
const openaiWsRoutes = require('../routes/openaiWsRoutes');

dotenv.config();

const WS_PORT = process.env.WS_PORT || 5001;

const server = new WebSocket.Server({ port: WS_PORT });

server.on('connection', (ws, req) => {
  const id = uuidv4();
  clients.set(id, ws);

  console.log(`Client connected: ${id}`);
  ws.send(JSON.stringify({ message: 'Welcome!', id }));

  ws.on('message', async (message) => {
    try {
      await openaiWsRoutes.handleWebSocket(ws, req, message);
    } catch (error) {
      console.error(`Error handling message from ${id}:`, error);
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`Client disconnected: ${id}`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error from ${id}:`, error);
  });
});

console.log(`WebSocket server is listening on port ${WS_PORT}`);
