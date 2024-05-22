// src/components/ChatInput.js
import React, { useState } from 'react';

const ChatInput = ({ addMessage }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      addMessage(input.trim());
      setInput('');
      setTimeout(() => {
        addMessage('How can I help you today?', true); // Bot response after a delay
      }, 500);
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;
