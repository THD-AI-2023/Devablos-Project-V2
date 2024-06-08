import React, { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import './App.css';

const WS_URL = process.env.REACT_APP_WS_URL || `ws://${window.location.hostname}/ws`;

function App() {
  const [socketUrl, setSocketUrl] = useState(WS_URL);
  const { sendMessage, lastMessage, readyState, reconnect } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onOpen: () => console.log('WebSocket connection established.'),
    onError: (error) => console.error('WebSocket error:', error),
    onMessage: (message) => console.log('WebSocket message received:', message)
  });

  const clearHistory = () => {
    localStorage.removeItem('chatHistory');
    window.location.reload();
  };

  const getStatus = () => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return '🔄 Connecting';
      case ReadyState.OPEN:
        return '🟢 Connected';
      case ReadyState.CLOSING:
      case ReadyState.CLOSED:
      default:
        return '🔴 Fallback to HTTPS';
    }
  };

  return (
    <div className="App">
      <Navbar status={getStatus()} onReconnect={reconnect} onClearHistory={clearHistory} />
      <Chat sendMessage={sendMessage} lastMessage={lastMessage} />
    </div>
  );
}

export default App;
