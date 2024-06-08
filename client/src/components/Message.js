import React from 'react';
import './Message.css';

const Message = ({ text, isBot }) => {
  return (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      {isBot ? '✨' : '😊'} {text}
    </div>
  );
};

export default Message;
