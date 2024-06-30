const WebSocket = require('ws');
const https = require('https');
const dotenv = require('dotenv');
const clients = require('../utils/connection');
const assistantServices = require('../services/assistantService');
const fs = require('fs');

dotenv.config();

const WSS_PORT = process.env.WSS_PORT || 5002;

const serverConfig = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8'),
};

// Create and pass HTTPS server
const httpsServer = https.createServer(serverConfig);
const wss = new WebSocket.Server({ server: httpsServer });

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
          ws.send(JSON.stringify({ action: 'sessionValidated', valid: true, sessionId }));
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

wss.on('connection', handleConnection);

httpsServer.listen(WSS_PORT, () => {
  console.log(`WSS server is listening on port ${WSS_PORT}`);
});
