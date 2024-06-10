import React from 'react';
import './WebSocketStatus.css';

const WebSocketStatus = ({ status, reconnect }) => {
  return (
    <span className="status" onClick={reconnect}>
      {status}
    </span>
  );
};

export default WebSocketStatus;
