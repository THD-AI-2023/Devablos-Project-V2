import React from 'react';
import Chat from './components/Chat';
import './App.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WS_URL = process.env.REACT_APP_WS_URL || `ws://${window.location.hostname}/ws`;

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
    <div className="App">
      <header className="App-header">
        <h1>Chat with our Bot</h1>
      </header>
      <Chat />
    </div>
  );
}

export default App;
