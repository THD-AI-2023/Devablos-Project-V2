import React from 'react';
import './Navbar.css';
import WebSocketStatus from './WebSocketStatus';
import logo from '../logo.svg';

const Navbar = ({ readyState, reconnect, clearHistory }) => {
  return (
    <div className="navbar">
      <img src={logo} alt="Devablos Project Logo" className="logo" />
      <WebSocketStatus readyState={readyState} reconnect={reconnect} />
      <button className="clear-chat" onClick={clearHistory}>🗑️ Clear Chat</button>
    </div>
  );
};

export default Navbar;
