import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../../components/Button';
import './PlaylistEdit.css';

class PlaylistEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      name: this.props.name,
      nameError: '',
      description: this.props.description,
      descriptionError: '',
      isValidName: true,
      isValidDescription: true,
    };
    this.closeModal = this.closeModal.bind(this);
    this.editPlaylist = this.editPlaylist.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
  }

  editPlaylist() {
    this.setState({ isAdding: true });
    this.props.onEdit(this.state.name, this.state.description)
      .then((status) => {
        if (status) {
          // Maybe return added notification ?
        }

        this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}`);
      })
      .catch(() => this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}`));
  }

  closeModal() {
    this.props.history.push(`/home/playlist/${this.props.match.params.playlist_id}`);
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
      <div className="edit-modal">
        <div className="edit-modal__title">
          <span>
            EDIT PLAYLIST
          </span>
        </div>
        <div className="edit-modal__input">
          <span className="edit-modal__input__name">
            NAME
          </span>
          <input id="edit-name" value={this.state.name} onChange={this.handleChangeName} />
          <span className="edit-modal__errors">
            {this.state.isValidName ? '' : this.state.nameError}
          </span>
          <span className="edit-modal__input__description">
            DESCRIPTION
          </span>
          <textarea
            id="edit-decription"
            value={this.state.description}
            onChange={this.handleChangeDescription}
          />
          <span className="edit-modal__errors">
            {this.state.isValidDescription ? '' : this.state.descriptionError}
          </span>
        </div>

        <div className="edit-modal__button--add">
          <Button
            disabled={this.state.isAdding ||
              !(this.state.isValidDescription && this.state.isValidName)}
            color="#1db954"
            label="EDIT"
            clickHandler={this.editPlaylist}
          />
        </div>
        <div className="edit-modal__button--close">
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

PlaylistEdit.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ playlist_id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape([]).isRequired,
  onEdit: PropTypes.func,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

PlaylistEdit.defaultProps = {
  onEdit: () => {},
};

export default PlaylistEdit;
