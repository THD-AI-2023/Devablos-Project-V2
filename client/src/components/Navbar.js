import React from 'react';
import './Navbar.css';
import WebSocketStatus from './WebSocketStatus';
import logo from '../logo.svg';

const Navbar = ({ status, onReconnect, onClearHistory }) => {
  return (
    <div className="navbar">
      <img src={logo} alt="Devablos Project Logo" className="logo" />
      <WebSocketStatus status={status} reconnect={onReconnect} />
      <button className="clear-chat" onClick={onClearHistory}>🗑️ Clear Chat</button>
    </div>
  );
};

export default Navbar;
