import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';
import useWebSocket from 'react-use-websocket';

const WS_URL = process.env.REACT_APP_WS_URL || `ws://${window.location.hostname}/ws`;

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }
  ]);
  const { sendMessage, lastMessage } = useWebSocket(WS_URL, {
    onOpen: () => console.log('WebSocket connection established.'),
    onError: (error) => console.error('WebSocket error:', error),
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const { data } = lastMessage;
      const parsedData = JSON.parse(data);
      const newMessage = { role: 'assistant', content: parsedData.message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  }, [lastMessage]);

  const addMessage = (message) => {
    if (message) {
      const newMessage = { role: 'user', content: message };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      sendMessage(JSON.stringify({ message }));
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          msg.role !== 'system' && <Message key={index} text={msg.content} isBot={msg.role === 'assistant'} />
        ))}
      </div>
      <ChatInput addMessage={addMessage} />
    </div>
  );
};

export default Chat;
