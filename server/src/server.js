const http = require('http');
const app = require('./app');
const socketIo = require('socket.io');

// Get port from environment and store in Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
const io = socketIo(server);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Normalize a port into a number, string, or false
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

// Event listener for HTTP server "error" event
function onError(error) {
  if (error.syscall !== 'listen') throw error;
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
}

// Event listener for HTTP server "listening" event
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'Pipe ' + addr : 'Port ' + addr.port;
  console.log('Listening on ' + bind);
}

// Listen on provided port, on all network interfaces
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
