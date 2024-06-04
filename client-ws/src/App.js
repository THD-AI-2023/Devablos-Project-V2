import React from 'react';
import './App.css';
import useWebSocket from 'react-use-websocket';

const WS_URL = `ws://${process.env.CODESPACE_NAME}-${process.env.PORT || '5001'}.app.github.dev`;

function App() {
  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  });

  return (
    <div>Hello WebSockets!</div>
  );
}

export default App;
