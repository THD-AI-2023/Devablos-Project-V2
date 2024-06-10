import React, { useState } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';

const Chat = ({ sendMessage, messages }) => {
  const addMessage = (message) => {
    if (message) {
      sendMessage(message);
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
