const https = require('https');
const http = require('http');
const fs = require('fs');
const app = require('./app');

// Read SSL key and certificate
function getSSLCredentials() {
  let privateKey, certificate;

  if (process.env.SSL_KEY_CONTENT && process.env.SSL_CERT_CONTENT) {
      // Use environment variables
      privateKey = process.env.SSL_KEY_CONTENT;
      certificate = process.env.SSL_CERT_CONTENT;
  } else {
      // Fallback to file paths
      privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
      certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
  }

  return { key: privateKey, cert: certificate };
}

const credentials = getSSLCredentials();

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

// Normalize a port into a number, string, or false
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Error handler for HTTP server
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

// Event listener for HTTP server "listening" event
const onListening = () => {
  const addr = httpsServer.address();
  const bind = typeof addr === 'string' ? 'Pipe ' + addr : 'Port ' + addr.port;
  console.log('Listening on ' + bind);
};

// Listen on provided port, on all network interfaces
httpsServer.listen(port);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);

// HTTP server for redirection
const httpPort = 80;
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { "Location": `https://${req.headers['host']}${req.url}` });
  res.end();
});

httpServer.listen(httpPort, () => {
  console.log(`HTTP Server listening on port ${httpPort} and redirecting to HTTPS`);
});
