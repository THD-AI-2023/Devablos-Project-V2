const WebSocket = require('ws');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const clients = require('../utils/connection');
const openaiWsRoutes = require('../routes/openaiWsRoutes');
const fs = require('fs');

dotenv.config();

const WSS_PORT = process.env.WSS_PORT || 5001;

const serverConfig = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8'),
};

const server = https.createServer(serverConfig);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  ws.on('message', async (message) => {
    try {
      const parsedMsg = JSON.parse(message);
      const { action, data = {} } = parsedMsg;
      const { sessionId, messages = [] } = data;

      switch (action) {
        case 'validateSession':
          if (clients.has(sessionId)) {
            ws.send(JSON.stringify({ action: 'sessionValidated', valid: true, messages: clients.get(sessionId).chatHistory }));
          } else {
            const newSessionId = uuidv4();
            clients.set(newSessionId, { ws, chatHistory: messages });
            ws.send(JSON.stringify({ action: 'sessionValidated', valid: false, sessionId: newSessionId, messages }));
          }
          break;
        case 'createSession':
          const newSessionId = uuidv4();
          clients.set(newSessionId, { ws, chatHistory: messages });
          ws.send(JSON.stringify({ action: 'sessionValidated', sessionId: newSessionId, messages }));
          break;
        case 'clearHistory':
          if (clients.has(sessionId)) {
            const clientData = clients.get(sessionId);
            clientData.chatHistory = [];
            clients.set(sessionId, clientData);
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
          await openaiWsRoutes.handleWebSocket(ws, req, message);
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

server.listen(WSS_PORT, () => {
  console.log(`WebSocket server is listening on port ${WSS_PORT}`);
});
