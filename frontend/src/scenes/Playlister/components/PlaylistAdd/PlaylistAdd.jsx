import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../components/Button';
import './PlaylistAdd.css';

class PlaylistAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      name: '',
      nameError: '',
      description: '',
      descriptionError: '',
      isValidName: false,
      isValidDescription: false,
    };
    this.closeModal = this.closeModal.bind(this);
    this.addPlaylist = this.addPlaylist.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
  }

  addPlaylist() {
    this.setState({ isAdding: true });

    this.props.onAdd(this.state.name, this.state.description)
      .then((status) => {
        if (status) {
          // Maybe return added notification ?
        }

        this.props.history.push('/home/');
      })
      .catch(() => this.props.history.push('/home/'));
  }

  closeModal() {
    this.props.history.push('/home/');
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
    if (event.target.value.length < 5 || event.target.value.length > 100) {
      this.setState({
        nameError: 'Name has to be between 5 and 100 characters.',
        isValidName: false,
      });
    } else {
      this.setState({ isValidName: true });
    }
  }

  handleChangeDescription(event) {
    this.setState({ description: event.target.value });
    if (event.target.value.length < 5 || event.target.value.length > 300) {
      this.setState({
        descriptionError: 'Description has to be between 5 and 300 characters.',
        isValidDescription: false,
      });
    } else {
      this.setState({ isValidDescription: true });
    }
  }

  render() {
    return (
      <div className="playlist-modal">
        <div className="playlist-modal__title">
          <span>
            ADD PLAYLIST
          </span>
        </div>
        <div className="playlist-modal__input">
          <span className="playlist-modal__input__name">
            NAME
          </span>
          <input id="playlist-name" value={this.state.name} onChange={this.handleChangeName} />
          <span className="playlist-modal__errors">
            {this.state.isValidName ? '' : this.state.nameError}
          </span>
          <span className="playlist-modal__input__description">
            DESCRIPTION
          </span>
          <textarea
            id="playlist-decription"
            value={this.state.description}
            onChange={this.handleChangeDescription}
          />
          <span className="playlist-modal__errors">
            {this.state.isValidDescription ? '' : this.state.descriptionError}
          </span>
        </div>

        <div className="playlist-modal__button--add">
          <Button
            disabled={this.state.isAdding ||
              !(this.state.isValidDescription && this.state.isValidName)}
            color="#1db954"
            label="ADD"
            clickHandler={this.addPlaylist}
          />
        </div>
        <div className="playlist-modal__button--close">
          <Button
            disabled={this.state.isAdding}
            color="#ff3f51"
            label="CLOSE"
            clickHandler={this.closeModal}
          />
        </div>
      </div>
    );
  }
}

PlaylistAdd.propTypes = {
  history: PropTypes.shape([]).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default PlaylistAdd;
