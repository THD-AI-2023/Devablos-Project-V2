const WebSocket = require('ws');
const https = require('https');
const http = require('http');
const dotenv = require('dotenv');
const clients = require('../utils/connection');
const assistantServices = require('../services/assistantService');

dotenv.config();

const WS_PORT = process.env.WS_PORT || 5001;

// Create and pass HTTP server
const httpServer = http.createServer();
const ws = new WebSocket.Server({ server: httpServer });

function handleConnection(ws, req) {
  console.log("New client connected!");
  let sessionId, user_message;

  ws.on('message', async (message) => {
    try {
      const parsedMsg = JSON.parse(message);
      const { action, data } = parsedMsg;

      switch (action) {
        case 'validateSession':
          ({ sessionId } = data);
          if (clients.has(sessionId)) {
            ws.send(JSON.stringify({ action: 'sessionValidated', valid: true, sessionId }));
          } else {
            sessionId = await assistantServices.create_user();
            ws.send(JSON.stringify({ action: 'sessionValidated', valid: false, sessionId }));
          }
          break;

        case 'createSession':
          sessionId = await assistantServices.create_user();
          ws.send(JSON.stringify({ action: 'sessionValidated', valid: false, sessionId }));
          break;

        case 'sendMessage':
          ({ sessionId, user_message } = data);
          if (!clients.has(sessionId)) {
            console.error('Session not found:', sessionId);
            ws.send(JSON.stringify({ error: 'Session not found' }));
            return;
          }
          let assistant = clients.get(sessionId).assistant;
          const assistant_message = await assistantServices.sendMessage(sessionId, user_message);
          ws.send(JSON.stringify({ action: 'assistantMessage', assistant_message }));
          break;

        case 'deleteSession':
          ({ sessionId } = data);
          console.log(sessionId);
          if (clients.has(sessionId)) {
            assistantServices.deleteSession(sessionId);
          }
          break;

        default:
          if (!data || !data.sessionId) {
            ws.send(JSON.stringify({ error: 'No sessionId provided' }));
            return;
          }
          break;
      }
    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.on('close', () => {
    if (sessionId && clients.has(sessionId)) {
      clients.delete(sessionId);
      console.log(`Client disconnected. Session ${sessionId} removed.`);
    } else {
      console.log("Client disconnected.");
    }
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error:`, error);
  });

  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ message: 'Session is being kept alive.' }));
    }
  }, 14 * 60 * 1000); // 14 minutes to send a keep-alive message
}

ws.on('connection', handleConnection);

httpServer.listen(WS_PORT, () => {
  console.log(`WS server is listening on port ${WS_PORT}`);
});
