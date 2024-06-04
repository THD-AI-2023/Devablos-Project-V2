const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const WS_PORT = process.env.WS_PORT || 5001;
const clients = new Map();

const server = new WebSocket.Server({ port: WS_PORT });

server.on('connection', (ws) => {
  const id = uuidv4();
  clients.set(id, ws);

  console.log(`Client connected: ${id}`);
  ws.send(JSON.stringify({ message: 'Welcome!', id }));

  ws.on('message', (message) => {
    console.log(`Received message from ${id}: ${message}`);
    // Handle incoming messages here
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
