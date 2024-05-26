import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';

const socket = io(process.env.REACT_APP_SERVER_URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      addMessage(message, true);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const addMessage = (message, isBot = false) => {
    if (message) {
      setMessages((prevMessages) => [...prevMessages, { text: message, isBot }]);
    }
  };

  const sendMessage = (message) => {
    socket.emit('sendMessage', message);
    addMessage(message, false);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} isBot={msg.isBot} />
        ))}
      </div>
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default Chat;
