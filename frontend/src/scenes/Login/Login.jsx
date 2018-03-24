import React from 'react';
import './Login.css';
import ConnectButton from './components/ConnectButton';
import spotifyLogo from '../../static/spotify_logo.png';

const Login = () => (
  <div id="login-container">
    <div className="login-panel">
      <span className="login-panel__title">
        Connect with Spotify
      </span>
      <span className="login-panel__logo">
        <img src={spotifyLogo} alt="Spotify Logo" />
      </span>
      <span className="login-panel__button">
        <ConnectButton />
      </span>
      <span className="login-panel__bar" />
    </div>
  </div>
);

export default Login;
