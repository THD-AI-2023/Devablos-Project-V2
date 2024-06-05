import React from 'react';
import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = `wss://localhost:5002`;

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
    <div>Hello Secure WebSockets!</div>
  );
}

export default App;
