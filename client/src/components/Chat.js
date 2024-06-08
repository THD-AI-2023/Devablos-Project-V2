import React, { useState, useEffect } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import './Chat.css';

const Chat = ({ sendMessage, lastMessage }) => {
  const sessionId = 'user-session-id'; // Ideally, generate or retrieve a unique session ID for each user
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [{ role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' }];
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const parsedData = JSON.parse(lastMessage.data);
        console.log('Parsed data from WebSocket:', parsedData);
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

  const addMessage = (message) => {
    if (message) {
      const newMessage = { role: 'user', content: message };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem('chatHistory', JSON.stringify(updatedMessages));
      console.log('Sending message via WebSocket:', updatedMessages);
      sendMessage(JSON.stringify({
        action: 'chatResponse',
        data: {
          model: 'gpt-3.5-turbo',
          messages: updatedMessages,
          sessionId: sessionId,
        },
      }));
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
