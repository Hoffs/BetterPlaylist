import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../../../../components/Button';
import './PlaylistExport.css';

class PlaylistExport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExporting: false,
      name: this.props.name,
      nameError: '',
      isValidName: true,
    };
    this.closeModal = this.closeModal.bind(this);
    this.exportPlaylist = this.exportPlaylist.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
  }

  exportPlaylist() {
    this.setState({ isExporting: true });
    this.props.onExport(this.state.name)
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

  render() {
    return (
      <div className="export-modal">
        <div className="export-modal__title">
          <span>
            EXPORT PLAYLIST
          </span>
        </div>
        <div className="export-modal__input">
          <span className="export-modal__input__name">
            NAME
          </span>
          <input id="export-name" value={this.state.name} onChange={this.handleChangeName} />
          <span className="export-modal__errors">
            {this.state.isValidName ? '' : this.state.nameError}
          </span>
        </div>

        <div className="export-modal__button--export">
          <Button
            disabled={this.state.isExporting || !this.state.isValidName}
            color="#1db954"
            label="EXPORT"
            clickHandler={this.exportPlaylist}
          />
        </div>
        <div className="export-modal__button--close">
          <Button
            disabled={this.state.isExporting}
            color="#ff3f51"
            label="CLOSE"
            clickHandler={this.closeModal}
          />
        </div>
      </div>
    );
  }
}

PlaylistExport.propTypes = {
  match: PropTypes.shape({ params: PropTypes.shape({ playlist_id: PropTypes.string }) }).isRequired,
  history: PropTypes.shape([]).isRequired,
  onExport: PropTypes.func,
  name: PropTypes.string.isRequired,
};

PlaylistExport.defaultProps = {
  onExport: () => {},
};

export default PlaylistExport;
