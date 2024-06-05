import React from 'react';
import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WSS_URL = process.env.REACT_APP_WSS_URL || `wss://${window.location.hostname}/ws`;

console.log('WebSocket URL:', WSS_URL);

function App() {
  const { readyState } = useWebSocket(WSS_URL, {
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
