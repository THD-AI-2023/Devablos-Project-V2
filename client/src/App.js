import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import './App.css';

const WS_URL = process.env.REACT_APP_WS_URL || `ws://${window.location.hostname}:5001/ws`;
const HTTPS_URL = process.env.REACT_APP_SERVER_URL || `http://${window.location.hostname}:5000`;

function App() {
  const [socketUrl, setSocketUrl] = useState(WS_URL);

  // TODO: add WSS -> WS fallback
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
  const [isConnected, setIsConnected] = useState(false);

  const { sendMessage, lastMessage, readyState, reconnect } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onOpen: () => {
      setIsConnected(true);
      if (sessionId) {
        sendMessage(JSON.stringify({ action: 'validateSession', data: sessionId }));
      } else {
        sendMessage(JSON.stringify({ action: 'createSession' }));
      }
    },
    onClose: () => {
      setIsConnected(false);
    },
    onMessage: (message) => {
      const parsedData = JSON.parse(message.data);
      if (parsedData.action === 'sessionValidated') {
        if (!parsedData.valid) {
          const newSessionId = parsedData.sessionId;
          setSessionId(newSessionId);
          localStorage.setItem('sessionId', newSessionId);
        } 
      } else {
        console.log('WebSocket message received:', message);
      }
    },
    onError: (error) => console.error('WebSocket error:', error)
  });

  const clearThread = () => {
    if (isConnected && sessionId) {
      sendMessage(JSON.stringify({ action: 'clearThread', data: { sessionId } }));
    }
  };
  
    const sendMessageHandler = async (message) => {
    if (isConnected) {
      sendMessage(JSON.stringify({
        action: 'chatResponse',
        data: {
          message: message, //string can be given to assistant sendMessage and addToThread function
          sessionId: sessionId,
        },
      }));
    } else {
      // Fallback to HTTPS
      try {
        const response = await fetch(`${HTTPS_URL}/api/openai/assistant/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message, //string can be given to assistant sendMessage and addToThread function
            sessionId: sessionId,
          }),
        });
        
        const data = await response.json();
      } catch (error) {
        console.error('HTTPS request error:', error);
      }
    }
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

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsedData = JSON.parse(lastMessage.data);
        if (parsedData.choices && parsedData.choices.length > 0) {
          const newMessage = { role: 'assistant', content: parsedData.choices[0].message.content };
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage];
            localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  return (
    <div className="App">
      <Navbar status={getStatus()} onReconnect={reconnect} onClearHistory={clearHistory} />
      <Chat sendMessage={sendMessageHandler} lastMessage={lastMessage} messages={messages} />
    </div>
  );
}

export default App;
