const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const openaiWsRoutes = require('../routes/openaiWsRoutes');

dotenv.config();

const WSS_PORT = process.env.WSS_PORT || 5002;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

const serverOptions = {
  key: fs.readFileSync(SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(SSL_CERT_PATH, 'utf8'),
};

const httpsServer = https.createServer(serverOptions);
const wss = new WebSocket.Server({ server: httpsServer });

const clients = new Map();

wss.on('connection', (ws, req) => {
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

httpsServer.listen(WSS_PORT, () => {
  console.log(`Secure WebSocket server is listening on port ${WSS_PORT}`);
});
