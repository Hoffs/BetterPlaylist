import React, { Component } from 'react';
import { parse } from 'query-string';
import PropTypes from 'prop-types';
import './Callback.css';
import spotifyLogo from '../../static/spotify_logo.png';
import Api from '../../services/api';

class Callback extends Component {
  constructor(props) {
    super(props);
    const { code } = parse(this.props.location.search);
    this.tryAuthenticate(code);
  }

  async tryAuthenticate(code) {
    const token = await Api.authenticate(code);
    if (token) {
      localStorage.setItem('token', token);
      this.props.history.push('/home');
    } else {
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <div id="callback-container">
        <div className="callback-panel">
          <span className="callback-panel__title">
            Connect with Spotify
          </span>
          <span className="callback-panel__logo">
            <img src={spotifyLogo} alt="Spotify Logo" />
          </span>
          <span className="callback-panel__description">
            Connecting...
          </span>
          <span className="callback-panel__bar" />
        </div>
      </div>
    );
  }
}

Callback.propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Callback;
