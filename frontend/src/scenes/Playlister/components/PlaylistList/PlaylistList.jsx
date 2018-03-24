import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Api from '../../../../services/api';
import './PlaylistList.css';
import PlaylistItem from './components/PlaylistItem';

class PlaylistList extends Component {
  constructor(props) {
    super(props);
    this.state = { playlists: [] };
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    Api.playlists(localStorage.getItem('token'))
      .then(data => this.setState({ playlists: data }));
  }

  selectPlaylist(e, itemId) {
    if (this.props.location.pathname.indexOf(itemId) === -1) {
      this.props.history.push(`/home/playlist/${itemId}`);
    }
  }

  deletePlaylist(e, itemId) {
    if (this.props.location.pathname.indexOf(itemId) !== -1) {
      this.props.history.push('/home/');
    }
    const newPlaylists = Object.assign([], this.state.playlists);
    const filtered = newPlaylists.filter(playlist => playlist.id !== itemId);
    this.setState({ playlists: filtered });
    // TODO: Call api
  }


  render() {
    return (
      <div className="list-container">
        <span className="list-container__title">
          Playlists:
        </span>
        <ul className="list-container__list">
          {this.state.playlists.map(playlist =>
            (<PlaylistItem
              key={playlist.id}
              id={playlist.id}
              name={playlist.name}
              selected={this.props.location.pathname.indexOf(playlist.id) !== -1}
              selectHandler={this.selectPlaylist}
              deleteHandler={this.deletePlaylist}
            />))}
        </ul>
      </div>
    );
  }
}

PlaylistList.propTypes = {
  history: PropTypes.shape([]).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
};

export default withRouter(PlaylistList);
