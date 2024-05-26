const socketio = require('socket.io');

module.exports = function (server) {
  const io = socketio(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (message) => {
      console.log('Message received: ', message);
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
