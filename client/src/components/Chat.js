// src/components/Chat.js
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message, isBot = false) => {
    if (message) {
      setMessages((prevMessages) => [...prevMessages, { text: message, isBot }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} isBot={msg.isBot} />
        ))}
      </div>
      <ChatInput addMessage={addMessage} />
    </div>
  );
};

export default Chat;
