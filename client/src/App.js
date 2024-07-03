import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import './App.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'https://localhost:5000';

const App = () => {
  const [useWebSocketProtocol, setUseWebSocketProtocol] = useState(true);
  const [socketUrl, setSocketUrl] = useState(`${SERVER_URL.replace(/^http/, 'ws')}`);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }];
  });
  const [isConnected, setIsConnected] = useState(false);

  const {
    sendMessage: sendWebSocketMessage,
    lastMessage,
    readyState,
  } = useWebSocket(socketUrl, {
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
    onError: (error) => console.error('WebSocket error:', error),
    onMessage: (message) => handleMessage(message),
    shouldReconnect: () => true,
    reconnectAttempts: 20,
    reconnectInterval: 3000,
  });

  const validateOrCreateSession = useCallback(() => {
    if (sessionId) {
      console.log('Validating existing session:', sessionId);
      sendWebSocketMessage(JSON.stringify({ action: 'validateSession', data: { sessionId } }));
    } else {
      console.log('Creating new session');
      sendWebSocketMessage(JSON.stringify({ action: 'createSession' }));
    }
  }, [sessionId, sendWebSocketMessage]);

  const handleMessage = useCallback(
    (message) => {
      try {
        const parsedData = JSON.parse(message.data);
        console.log('Received WebSocket message:', parsedData);

        switch (parsedData.action) {
          case 'sessionValidated':
            setSessionId(parsedData.sessionId);
            localStorage.setItem('sessionId', parsedData.sessionId);
            break;

          case 'assistantMessage':
            const returnedMessage = parsedData.assistant_message;
            const newMessage = { role: 'assistant', content: returnedMessage };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            break;

          case 'chatHistory':
            setMessages(parsedData.messages);
            localStorage.setItem('chatHistory', JSON.stringify(parsedData.messages));
            break;

          default:
            console.log('Unknown WebSocket message received:', parsedData);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    },
    [sessionId]
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem('chatHistory');
    setMessages([{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }]);

    if (isConnected) {
      sendWebSocketMessage(JSON.stringify({ action: 'deleteSession', data: { sessionId } }));
      localStorage.removeItem('sessionId');
      setSessionId(null);
    }
  }, [isConnected, sendWebSocketMessage, sessionId]);

  const sendMessageHandler = async (message) => {
    const newMessage = { role: 'user', content: message };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    if (useWebSocketProtocol && isConnected) {
      sendWebSocketMessage(
        JSON.stringify({
          action: 'sendMessage',
          data: {
            sessionId,
            user_message: message,
          },
        })
      );
    } else {
      try {
        const response = await fetch(`${SERVER_URL}/api/openai/assistant/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            sessionID: sessionId,
            prompt: message,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response from server:', errorData);
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        const returnedMessage = data.assistant_message || data;
        const newAssistantMessage = { role: 'assistant', content: returnedMessage };
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const getStatus = () => {
    const protocolIndicator = currentProtocol === 'WSS' ? '🌐' : '🔒';
    switch (readyState) {
      case ReadyState.CONNECTING:
        return `${protocolIndicator} 🔄 Connecting`;
      case ReadyState.OPEN:
        return `${protocolIndicator} 🟢 Connected`;
      case ReadyState.CLOSING:
        return `${protocolIndicator} 🟠 Closing`;
      case ReadyState.CLOSED:
        return currentProtocol === 'HTTPS' ? '🔒 🟢 HTTPS' : `${protocolIndicator} 🔴 Closed`;
      default:
        return `${protocolIndicator} ⚪ Unknown`;
    }
  };

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      validateOrCreateSession();
    }
  }, [readyState, validateOrCreateSession]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const toggleProtocol = () => {
    setUseWebSocketProtocol((prev) => !prev);
  };

  // In App.js
return (
  <div className="App">
    <Navbar 
      status={getStatus()} 
      onReconnect={() => setSocketUrl(`${SERVER_URL.replace(/^http/, 'ws')}`)} 
      onClearHistory={clearHistory}
      useWebSocketProtocol={useWebSocketProtocol}
      onToggleProtocol={toggleProtocol}
    />
    {/* Remove this button */}
    {/* <button onClick={toggleProtocol}>
      Toggle Protocol (Current: {useWebSocketProtocol ? 'WebSocket' : 'HTTPS'})
    </button> */}
    <Chat sendMessage={sendMessageHandler} lastMessage={lastMessage} messages={messages} />
  </div>
);
};

export default App;
