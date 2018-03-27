import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserBar from './components/UserBar';
import PlaylistList from './components/PlaylistList';
import PlaylistInfo from './components/PlaylistInfo';
import PlaylistAdd from './components/PlaylistAdd';
import Fader from '../../components/Fader';
import Api from '../../services/api';
import './Playlister.css';

class Playlister extends Component {
  constructor(props) {
    super(props);
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login');
    }

    this.state = { playlists: [] };

    this.playlistDeleteHandler = this.playlistDeleteHandler.bind(this);
    this.playlistAddHandler = this.playlistAddHandler.bind(this);

    Api.playlists(localStorage.getItem('token'))
      .then(data => this.setState({ playlists: data }));
  }

  componentWillMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login');
    }
  }

  componentWillUpdate() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login');
    }
  }

  async playlistDeleteHandler(playlistId) {
    const response = await Api.removePlaylist(localStorage.getItem('token'), playlistId);
    if (response) {
      const newPlaylists = Object.assign([], this.state.playlists);
      const filtered = newPlaylists.filter(playlist => playlist.id !== playlistId);
      this.setState({ playlists: filtered });
      return true;
    }

    return false;
  }

  async playlistAddHandler(name, description) {
    const response = await Api.addPlaylist(localStorage.getItem('token'), name, description);
    if (response.id) {
      const newPlaylists = Object.assign([], this.state.playlists);
      newPlaylists.push(response);
      this.setState({ playlists: newPlaylists });
      return true;
    }

    return false;
  }

  render() {
    return (
      <div className="playlister-container" >
        <UserBar />
        <PlaylistList playlists={this.state.playlists} onDelete={this.playlistDeleteHandler} />
        <Route path="/home/add" component={Fader} />
        <Route
          path="/home/add"
          render={rProps => <PlaylistAdd {...rProps} onAdd={this.playlistAddHandler} />}
        />
        <Route path="/home/playlist/:playlist_id" component={PlaylistInfo} />
      </div>
    );
  }
}


Playlister.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default Playlister;
