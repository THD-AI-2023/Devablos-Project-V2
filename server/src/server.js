const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const express = require('express');
const dotenv = require('dotenv');
const clients = require('./utils/connection');
const assistantServices = require('./services/assistantService');
const app = require('./app');

dotenv.config();

// Read SSL key and certificate
const credentials = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8')
};

// Create HTTPS server
const server = https.createServer(credentials, app);

// Normalize a port into a number, string, or false
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Error handler for server
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Event listener for server "listening" event
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'Pipe ' + addr : 'Port ' + addr.port;
  console.log('Listening on ' + bind);
};

// Listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// WebSocket server
const wss = new WebSocket.Server({ server });

// Define the handleConnection function
const handleConnection = (ws, req) => {
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
};

// Use the handleConnection function for WebSocket connections
wss.on('connection', handleConnection);
