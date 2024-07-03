import React from 'react';
import './Navbar.css';
import WebSocketStatus from './WebSocketStatus';
import logo from '../logo.svg';

const Navbar = ({ status, onReconnect, onClearHistory, useWebSocketProtocol, onToggleProtocol }) => {
  return (
    <div className="navbar">
      <img src={logo} alt="Devablos Project Logo" className="logo" />
      <div className="status-container">
        <WebSocketStatus status={status} reconnect={onReconnect} />
        <button className="toggle-protocol" onClick={onToggleProtocol}>
          {useWebSocketProtocol ? 'WebSockets' : 'HTTPS'}
        </button>
      </div>
      <button className="clear-chat" onClick={onClearHistory}>🗑️ Clear Chat</button>
    </div>
  );
};

export default Navbar;
