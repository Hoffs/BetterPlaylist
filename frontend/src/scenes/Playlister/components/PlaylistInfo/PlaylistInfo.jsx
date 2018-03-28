import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Fader from '../../../../components/Fader';
import Api from '../../../../services/api';
import PlaylistHeader from './components/PlaylistHeader';
import TrackList from './components/TrackList';
import AddTracks from './components/AddTracks';
import PlaylistEdit from './components/PlaylistEdit';
import './PlaylistInfo.css';
import PlaylistExport from './components/PlaylistExport/PlaylistExport';

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
    this.onPlaylistEdit = this.onPlaylistEdit.bind(this);
    this.onTrackDelete = this.onTrackDelete.bind(this);
    this.onPlaylistExport = this.onPlaylistExport.bind(this);
    this.playlistEditHandler = this.playlistEditHandler.bind(this);
    this.playlistExportHandler = this.playlistExportHandler.bind(this);
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

  onPlaylistEdit() {
    this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}/edit`);
  }

  onPlaylistExport() {
    this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}/export`);
  }

  onTrackDelete(trackId) {
    Api.removeTracks(localStorage.getItem('token'), this.props.match.params.playlist_id, trackId)
      .then(({ id }) => {
        if (id === this.props.match.params.playlist_id) {
          const newTracks = Object.assign([], this.state.tracks);
          const filtered = newTracks.filter(track => track.id !== trackId);
          this.setState({ tracks: filtered });
        }
      })
      .catch(() => { /* Maybe show error */ });
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

  async playlistEditHandler(name, description) {
    if (name === this.state.name && description === this.state.description) {
      return false;
    }

    const response = await Api.editPlaylist(localStorage.getItem('token'), this.props.match.params.playlist_id, name, description);
    if (response.id) {
      this.setState({ name: response.name, description: response.description });
      return true;
    }
    return false;
  }

  async playlistExportHandler(name) {
    const response = await Api.exportPlaylist(localStorage.getItem('token'), this.props.match.params.playlist_id, name);
    if (response.spotify_uri) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div playlist-id={this.state.playlist} className="playlist-container">
        <PlaylistHeader
          name={this.state.name}
          description={this.state.description}
          onEdit={this.onPlaylistEdit}
          onExport={this.onPlaylistExport}
        />
        <TrackList
          tracks={this.state.tracks}
          addHandler={this.onAddTrack}
          deleteHandler={this.onTrackDelete}
        />
        <Route path="/home/playlist/:playlist_id/add" component={Fader} />
        <Route
          path="/home/playlist/:playlist_id/add"
          render={rProps => <AddTracks {...rProps} closeHandler={this.onTracksAdded} />}
        />
        <Route path="/home/playlist/:playlist_id/edit" component={Fader} />
        <Route
          path="/home/playlist/:playlist_id/edit"
          render={rProps => (<PlaylistEdit
            {...rProps}
            name={this.state.name}
            description={this.state.description}
            onEdit={this.playlistEditHandler}
          />)}
        />
        <Route path="/home/playlist/:playlist_id/export" component={Fader} />
        <Route
          path="/home/playlist/:playlist_id/export"
          render={rProps => (<PlaylistExport
            {...rProps}
            name={this.state.name}
            onExport={this.playlistExportHandler}
          />)}
        />
      </div>
    );
  }
}

PlaylistInfo.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ playlist_id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default PlaylistInfo;
