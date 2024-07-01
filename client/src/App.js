import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import './App.css';

const WSS_URL = process.env.REACT_APP_WSS_URL || `wss://${window.location.hostname}:5002`;
const WS_URL = process.env.REACT_APP_WS_URL || `ws://${window.location.hostname}:5001`;

function App() {
  const [socketUrl, setSocketUrl] = useState(WSS_URL);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }];
  });
  const [isConnected, setIsConnected] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);

  const validateOrCreateSession = useCallback(() => {
    if (sessionId) {
      console.log('Validating existing session:', sessionId);
      sendMessage(JSON.stringify({ action: 'validateSession', data: { sessionId: sessionId } }));
    } else {
      console.log('Creating new session');
      sendMessage(JSON.stringify({ action: 'createSession' }));
    }
  }, [sessionId]);

  const handleOpen = useCallback(() => {
    console.log('WebSocket connected');
    setIsConnected(true);
  });

  const handleClose = useCallback(() => {
    console.log('WebSocket disconnected');
    setIsConnected(false);
    if (!fallbackAttempted) {
      console.log('Attempting fallback to WS');
      setSocketUrl(WS_URL);
      setFallbackAttempted(true);
    }
  }, [fallbackAttempted]);

  const handleError = useCallback(
    (error) => {
      console.error('WebSocket error:', error);
      if (!fallbackAttempted) {
        console.log('Error occurred, attempting fallback to WS');
        setSocketUrl(WS_URL);
        setFallbackAttempted(true);
      }
    },
    [fallbackAttempted]
  );

  const handleMessage = useCallback(
    (message) => {
      try {
        const parsedData = JSON.parse(message.data);
        console.log('Received WebSocket message:', parsedData);
  
        switch (parsedData.action) {
          case 'sessionValidated':
            if (parsedData.valid) {
              console.log('Session validated:', parsedData.sessionId);
            } else {
              console.log('Session invalid, creating new session');
            }
            // Always update the sessionId, whether it's validated or new
            setSessionId(parsedData.sessionId);
            localStorage.setItem('sessionId', parsedData.sessionId);
          break;

          case 'assistantMessage':
            const returned_message = parsedData.assistant_message;
            const newMessage = { role: 'assistant', content: returned_message };
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, newMessage];
              return updatedMessages;
            });
            break;
  
          case 'chatHistory':
            console.log('Received chat history');
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
    [sessionId, setSessionId, setMessages]
  );

  const { sendMessage, lastMessage, readyState, reconnect } = useWebSocket(socketUrl, {
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
    onMessage: handleMessage,
    shouldReconnect: (closeEvent) => !fallbackAttempted,
    reconnectAttempts: 20,
    reconnectInterval: 3000,
  });

  const clearHistory = useCallback(() => {
    localStorage.removeItem('chatHistory');
    setMessages([{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }]);
  
    if (isConnected) {
      sendMessage(JSON.stringify({ action: 'deleteSession', data: { sessionId: sessionId } }));
      localStorage.removeItem('sessionId');
      setSessionId(null);
      // Instead of immediately creating a new session, we'll wait for the next connection
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
            sessionId: sessionId,
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
        console.log('WebSocket Ready!');
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
      setFallbackAttempted(false);
      if (sessionId) {
        validateOrCreateSession();
      } else {
        sendMessage(JSON.stringify({ action: 'createSession' }));
      }
    }
  }, [readyState, sessionId, validateOrCreateSession, sendMessage]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    console.log('Saved messages to localStorage:', messages);
  }, [messages]);

  return (
    <div className="App">
      <Navbar status={getStatus()} onReconnect={reconnect} onClearHistory={clearHistory} />
      <Chat sendMessage={sendMessageHandler} lastMessage={lastMessage} messages={messages} />
    </div>
  );
}

export default App;
