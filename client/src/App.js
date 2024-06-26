import React, { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Chat from './components/Chat';
import Navbar from './components/Navbar';
import './App.css';

const WS_URL = process.env.REACT_APP_WS_URL || `ws://${window.location.hostname}:5001/ws`;
const HTTPS_URL = process.env.REACT_APP_SERVER_URL || `http://${window.location.hostname}:5000`;

function App() {
  const [socketUrl, setSocketUrl] = useState(WS_URL);
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }];
  });
  const [isConnected, setIsConnected] = useState(false);

  const { sendMessage, lastMessage, readyState, reconnect } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onOpen: () => {
      setIsConnected(true);
      if (sessionId) {
        sendMessage(JSON.stringify({ action: 'validateSession', data: { sessionId, messages } }));
      } else {
        sendMessage(JSON.stringify({ action: 'createSession', data: { messages } }));
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
        } else {
          setMessages(parsedData.messages || []);
          localStorage.setItem('chatHistory', JSON.stringify(parsedData.messages || []));
        }
      } else if (parsedData.action === 'chatHistory') {
        setMessages(parsedData.messages);
        localStorage.setItem('chatHistory', JSON.stringify(parsedData.messages));
      } else {
        console.log('WebSocket message received:', message);
      }
    },
    onError: (error) => console.error('WebSocket error:', error)
  });

  const clearHistory = () => {
    localStorage.removeItem('chatHistory');
    if (isConnected && sessionId) {
      sendMessage(JSON.stringify({ action: 'clearHistory', data: { sessionId } }));
    }
    setMessages([{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }]);
  };

  const sendMessageHandler = async (message) => {
    const newMessage = { role: 'user', content: message };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));

    if (isConnected) {
      sendMessage(JSON.stringify({
        action: 'chatResponse',
        data: {
          model: 'gpt-3.5-turbo',
          messages: updatedMessages,
          sessionId: sessionId,
        },
      }));
    } else {
      // Fallback to HTTPS
      try {
        const response = await fetch(`${HTTPS_URL}/api/openai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: updatedMessages,
          }),
        });
        const data = await response.json();
        const botMessage = { role: 'assistant', content: data.choices[0].message.content };
        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);
        localStorage.setItem('chatHistory', JSON.stringify(finalMessages));
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
