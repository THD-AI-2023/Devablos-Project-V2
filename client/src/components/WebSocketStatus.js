import React from 'react';
import { ReadyState } from 'react-use-websocket';
import './WebSocketStatus.css';

const WebSocketStatus = ({ readyState, reconnect }) => {
  const getStatus = () => {
    switch (readyState) {
      case ReadyState.CONNECTING:
        return '🔄 Connecting';
      case ReadyState.OPEN:
        return '🟢 Connected';
      case ReadyState.CLOSING:
      case ReadyState.CLOSED:
      default:
        return '🔴 Fallback to HTTPS';
    }
  };

  return (
    <span className="status" onClick={reconnect}>
      {getStatus()}
    </span>
  );
};

export default WebSocketStatus;
