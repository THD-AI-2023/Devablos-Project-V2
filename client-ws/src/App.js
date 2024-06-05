import React from 'react';
import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = `ws://localhost:5001`;

console.log('WebSocket URL:', WS_URL);

function App() {
  const { readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  console.log('WebSocket state:', ReadyState[readyState]);

  return (
    <div>Hello WebSockets!</div>
  );
}

export default App;
