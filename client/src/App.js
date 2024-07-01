import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import './App.css';

const HTTPS_URL = process.env.REACT_APP_SERVER_URL || `https://${window.location.hostname}:5000`;

function App() {
  const [socketUrl, setSocketUrl] = useState(HTTPS_URL);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }];
  });
  const [isConnected, setIsConnected] = useState(false);

  const validateOrCreateSession = useCallback(() => {
    if (sessionId) {
      console.log('Validating existing session:', sessionId);
      sendMessage(JSON.stringify({ action: 'validateSession', data: { sessionId } }));
    } else {
      console.log('Creating new session');
      sendMessage(JSON.stringify({ action: 'createSession' }));
    }
  }, [sessionId]);

  const handleOpen = useCallback(() => {
    console.log('WebSocket connected');
    setIsConnected(true);
  }, []);

  const handleClose = useCallback(() => {
    console.log('WebSocket disconnected');
    setIsConnected(false);
    setSocketUrl(HTTPS_URL);
  }, []);

  const handleError = useCallback(
    (error) => {
      console.error('WebSocket error:', error);
      setSocketUrl(HTTPS_URL);
    },
    []
  );

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

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
    onMessage: handleMessage,
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 20,
    reconnectInterval: 3000,
  });

  const clearHistory = useCallback(() => {
    localStorage.removeItem('chatHistory');
    setMessages([{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }]);

    if (isConnected) {
      sendMessage(JSON.stringify({ action: 'deleteSession', data: { sessionId } }));
      localStorage.removeItem('sessionId');
      setSessionId(null);
    }
  }, [isConnected, sendMessage, sessionId]);

  const sendMessageHandler = async (message) => {
    const newMessage = { role: 'user', content: message };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));

    if (isConnected) {
      sendMessage(
        JSON.stringify({
          action: 'sendMessage',
          data: {
            sessionId,
            user_message: message,
          },
        })
      );
    } else {
      console.error('WebSocket is not connected. Unable to send message.');
    }
  };

  const getStatus = () => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return '🔄 Connecting';
      case ReadyState.OPEN:
        return '🟢 Connected';
      case ReadyState.CLOSING:
        return '🟠 Closing';
      case ReadyState.CLOSED:
        return '🔴 Closed';
      default:
        return '⚪ Unknown';
    }
  };

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      if (sessionId) {
        validateOrCreateSession();
      } else {
        sendMessage(JSON.stringify({ action: 'createSession' }));
      }
    }
  }, [readyState, sessionId, validateOrCreateSession, sendMessage]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="App">
      <Navbar status={getStatus()} onReconnect={() => setSocketUrl(HTTPS_URL)} onClearHistory={clearHistory} />
      <Chat sendMessage={sendMessageHandler} lastMessage={lastMessage} messages={messages} />
    </div>
  );
}

export default App;
