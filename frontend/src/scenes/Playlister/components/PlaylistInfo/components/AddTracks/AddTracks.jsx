import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Api from '../../../../../../services/api';
import Button from '../../../../../../components/Button';
import './AddTracks.css';

class AddTracks extends Component {
  constructor(props) {
    super(props);
    this.state = { isAdding: false };
    this.closeModal = this.closeModal.bind(this);
    this.addTracks = this.addTracks.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addTracks() {
    this.setState({ isAdding: true });
    const tracks = [];

    const regex = /(?:spotify:track:([A-z0-9]*\w))|(?:https:\/\/open.spotify.com\/track\/([A-z0-9]*\w))+/g;
    let match = regex.exec(this.state.value);

    while (match !== null) {
      const id = match[1] || match[2];
      tracks.push(id);
      match = regex.exec(this.state.value);
    }

    if (tracks.length === 0) {
      this.props.closeHandler(false);
      this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}`);
      return;
    }

    Api.addTracks(localStorage.getItem('token'), this.props.match.params.playlist_id, tracks)
      .then((response) => {
        if (response.data.added > 0) { // Whether tracks were added
          this.props.closeHandler(true);
        } else {
          this.props.closeHandler(false);
        }
        this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}`);
      })
      .catch(() => {
        // Error happened
        this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}`);
      });
  }

  closeModal() {
    this.props.closeHandler(false);
    this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}`);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className="add-modal">
        <div className="add-modal__title">
          <span className="add-modal__title--top">
          ADD TRACKS
          </span>
          <span className="add-modal__title--sub">
            SEPARATED BY SPACES OR NEW LINE
          </span>
        </div>
        <div className="add-modal__input">
          <textarea id="add-textarea" value={this.state.value} onChange={this.handleChange} />
        </div>
        <div className="add-modal__button--add">
          <Button disabled={this.state.isAdding} color="#1db954" label="ADD" clickHandler={this.addTracks} />
        </div>
        <div className="add-modal__button--close">
          <Button disabled={this.state.isAdding} color="#ff3f51" label="CLOSE" clickHandler={this.closeModal} />
        </div>
      </div>
    );
  }
}

AddTracks.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ playlist_id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape([]).isRequired,
  closeHandler: PropTypes.func,
};

AddTracks.defaultProps = {
  closeHandler: () => {},
};

export default AddTracks;
