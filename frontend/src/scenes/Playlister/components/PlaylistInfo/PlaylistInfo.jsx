import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Api from '../../../../services/api';
import PlaylistHeader from './components/PlaylistHeader';
import TrackList from './components/TrackList';
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
  }

  componentDidMount() {
    this.getPlaylistInfo(this.props.match.params.playlist_id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.match.params.playlist_id !== this.props.match.params.playlist_id) {
      this.getPlaylistInfo(newProps.match.params.playlist_id);
    }
  }

  getPlaylistInfo(playlistId) {
    const token = localStorage.getItem('token');
    Api.playlistInfo(token, playlistId)
      .then(info => this.setState({ name: info.name, description: info.description }))
      .catch(() => this.props.history.push('/home')); // TODO: Maybe show notification if error occurs

    Api.playlistTracks(token, playlistId)
      .then(tracks => this.setState({ tracks }))
      .catch(() => this.props.history.push('/home')); // TODO: Maybe show notification if error occurs

    this.setState({ playlist: playlistId });
  }

  render() {
    return (
      <div playlist-id={this.state.playlist} className="playlist-container">
        <PlaylistHeader name={this.state.name} description={this.state.description} />
        <TrackList tracks={this.state.tracks} />
      </div>
    );
  }
}

PlaylistInfo.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ playlist_id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape([]).isRequired,
};

export default PlaylistInfo;
