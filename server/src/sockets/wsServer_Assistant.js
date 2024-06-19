const WebSocket = require('ws');
const https = require('https');
const dotenv = require('dotenv');
const clients = require('../utils/connection');
const assistantServices = require('../services/assistantService');
const fs = require('fs');

dotenv.config();

const WSS_PORT = process.env.WSS_PORT || 5002;

// Load SSL key and certificate
const serverConfig = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8'),
};

// Create HTTPS server
const server = https.createServer(serverConfig);

// Pass HTTPS server to WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log("New client connected!");

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

        case 'sendMessage':
          if (!clients.has(sessionId)) {
            console.error('Session not found:', sessionId);
            ws.send(JSON.stringify({ error: 'Session not found' }));
            return;
          }

          let assistant = clients.get(sessionId).assistant;

          console.log(`Handling WebSocket action: ${action}`);

          // You need to implement sendMessage function
          const newThread = await assistantServices.sendMessage(sessionId, data.message);

          const user = {
            assistant: assistant,
            thread: newThread[1],
          };

          clients.set(sessionId, user);
          ws.send(JSON.stringify({ action: 'assistantMessage', message: newThread[0] }));
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
      console.log("Client disconnected.");
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

server.listen(WSS_PORT, () => {
  console.log(`WebSocket server is listening on port ${WSS_PORT}`);
});