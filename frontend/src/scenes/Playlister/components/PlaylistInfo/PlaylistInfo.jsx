import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Fader from '../../../../components/Fader';
import Api from '../../../../services/api';
import PlaylistHeader from './components/PlaylistHeader';
import TrackList from './components/TrackList';
import AddTracks from './components/AddTracks';
import './PlaylistInfo.css';

class PlaylistInfo extends Component {
  constructor(props) {
    super(props);
    // Fetch info
    this.state = {
      playlist: null,
      name: null,
      description: null,
      tracks: [],
    };
    this.onAddTrack = this.onAddTrack.bind(this);
    this.onTracksAdded = this.onTracksAdded.bind(this);
  }

  componentDidMount() {
    this.getPlaylistInfo(this.props.match.params.playlist_id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.playlist_id !== this.props.match.params.playlist_id) {
      this.getPlaylistInfo(newProps.match.params.playlist_id);
    }
  }

  onAddTrack() {
    this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}/add`);
  }

  onTracksAdded(didAdd) {
    if (didAdd) {
      Api.playlistTracks(localStorage.getItem('token'), this.props.match.params.playlist_id)
        .then((tracks) => {
          if (tracks.id === this.state.playlist) {
            this.setState({ tracks: tracks.data });
          }
        })
        .catch(() => this.props.history.push('/home')); // TODO: Maybe show notification if error occurs
    }
  }

  getPlaylistInfo(playlistId) {
    const token = localStorage.getItem('token');
    this.setState({
      playlist: playlistId,
      name: 'Loading...',
      description: 'Loading...',
      tracks: [],
    });

    Api.playlistInfo(token, playlistId)
      .then((info) => {
        if (info.id === this.state.playlist) {
          this.setState({ name: info.data.name, description: info.data.description });
        }
      })
      .catch(() => this.props.history.push('/home')); // TODO: Maybe show notification if error occurs

    Api.playlistTracks(token, playlistId)
      .then((tracks) => {
        if (tracks.id === this.state.playlist) {
          this.setState({ tracks: tracks.data });
        }
      })
      .catch(() => this.props.history.push('/home')); // TODO: Maybe show notification if error occurs
  }

  render() {
    return (
      <div playlist-id={this.state.playlist} className="playlist-container">
        <PlaylistHeader name={this.state.name} description={this.state.description} />
        <TrackList tracks={this.state.tracks} addHandler={this.onAddTrack} />
        <Route path="/home/playlist/:playlist_id/add" component={Fader} />
        <Route path="/home/playlist/:playlist_id/add" render={rProps => <AddTracks {...rProps} closeHandler={this.onTracksAdded} />} />
      </div>
    );
  }
}

PlaylistInfo.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ playlist_id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default PlaylistInfo;
