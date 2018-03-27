import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './PlaylistList.css';
import PlaylistItem from './components/PlaylistItem/';

class PlaylistList extends Component {
  constructor(props) {
    super(props);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
  }

  selectPlaylist(e, itemId) {
    if (this.props.location.pathname.indexOf(itemId) === -1) {
      this.props.history.push(`/home/playlist/${itemId}`);
    }
  }

  deletePlaylist(e, itemId) { // Pretty bad solution
    this.props.onDelete(itemId)
      .then((didDelete) => {
        if (didDelete) {
          // Maybe dispaly notification
        }
        if (this.props.location.pathname.indexOf(itemId) !== -1) {
          this.props.history.push('/home/');
        }
      })
      .catch(() => this.props.history.push('/home/'));
  }

  addPlaylist() {
    this.props.history.push('/home/add');
  }


  render() {
    return (
      <div className="list-container">
        <div className="list-container__header">
          <span className="list-container__header__title">
            PLAYLISTS
          </span>
          <button onClick={this.addPlaylist} className="list-container__header__add">
            ADD
          </button>
        </div>
        <ul className="list-container__list">
          {this.props.playlists.map(playlist =>
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
  playlists: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withRouter(PlaylistList);
