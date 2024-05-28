import React, { useState } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }
  ]);

  const addMessage = async (message, isBot = false) => {
    if (message) {
      const newMessage = { role: isBot ? 'assistant' : 'user', content: message };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      if (!isBot) {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/openai/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: newMessages }),
          });
          const data = await response.json();
          if (data && data.choices && data.choices[0].message) {
            const botMessage = data.choices[0].message.content;
            setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: botMessage }]);
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
          msg.role !== 'system' && <Message key={index} text={msg.content} isBot={msg.role === 'assistant'} />
        ))}
      </div>
      <ChatInput addMessage={addMessage} />
    </div>
  );
};

export default Chat;
