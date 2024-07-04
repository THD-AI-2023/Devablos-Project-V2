import React, { useState, useEffect } from 'react';
import './Navbar.css';
import WebSocketStatus from './WebSocketStatus';
import logo from '../logo.svg';

const NavbarDesktop = ({ status, onReconnect, onClearHistory, useWebSocketProtocol, onToggleProtocol }) => {
  return (
    <div className="navbar-desktop">
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

const NavbarMobile = ({ status, onReconnect, onClearHistory, useWebSocketProtocol, onToggleProtocol }) => {
  return (
    <div className="navbar-mobile">
      <div className="navbar-top">
        <img src={logo} alt="Devablos Project Logo" className="logo" />
        <div className="status-container">
          <WebSocketStatus status={status} reconnect={onReconnect} />
        </div>
      </div>
      <div className="navbar-bottom">
        <button className="toggle-protocol" onClick={onToggleProtocol}>
          {useWebSocketProtocol ? 'WebSockets' : 'HTTPS'}
        </button>
        <button className="clear-chat" onClick={onClearHistory}>🗑️ Clear Chat</button>
      </div>
    </div>
  );
};

const Navbar = ({ status, onReconnect, onClearHistory, useWebSocketProtocol, onToggleProtocol }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile ? (
    <NavbarMobile
      status={status}
      onReconnect={onReconnect}
      onClearHistory={onClearHistory}
      useWebSocketProtocol={useWebSocketProtocol}
      onToggleProtocol={onToggleProtocol}
    />
  ) : (
    <NavbarDesktop
      status={status}
      onReconnect={onReconnect}
      onClearHistory={onClearHistory}
      useWebSocketProtocol={useWebSocketProtocol}
      onToggleProtocol={onToggleProtocol}
    />
  );
};

export default Navbar;
