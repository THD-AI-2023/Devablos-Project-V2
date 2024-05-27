import React, { useState } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);

  const addMessage = async (message, isBot = false) => {
    if (message) {
      setMessages((prevMessages) => [...prevMessages, { text: message, isBot }]);
      if (!isBot) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/openai/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: [...messages, { text: message, isBot }] }),
          });
          const data = await response.json();
          if (data && data.choices && data.choices[0].message) {
            setMessages((prevMessages) => [...prevMessages, { text: data.choices[0].message.content, isBot: true }]);
          }
        } catch (error) {
          console.error('Error fetching response:', error);
        }
      }
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
