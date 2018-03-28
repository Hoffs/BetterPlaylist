import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TrackItem.css';

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

class TrackItem extends Component {
  constructor(props) {
    super(props);
    this.state = { hovered: false, disabled: false };
    this.onDeleteClicked = this.onDeleteClicked.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  onDeleteClicked() {
    if (this.state.disabled) return;
    this.setState({ disabled: true });
    this.props.onDelete(this.props.id);
    this.timeoutId = setTimeout(() => this.setState({ disabled: false }), 3000);
  }

  render() {
    return (
      <div
        className="track-item"
        onMouseOver={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        onFocus={() => this.setState({ hovered: true })}
        onBlur={() => this.setState({ hovered: false })}
      >
        <div className="track-item__name">
          {this.props.name}
        </div>
        <div className="track-item__artist">
          {this.props.artist}
        </div>
        <div className="track-item__album">
          {this.props.album}
        </div>
        <div className="track-item__duration">
          <span>
            {millisToMinutesAndSeconds(this.props.duration)}
          </span>
          {this.state.hovered ? <button className="track-item__delete" onClick={this.onDeleteClicked}><i>clear</i></button> : ''}
        </div>
      </div>
    );
  }
}

TrackItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  artist: PropTypes.string.isRequired,
  album: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TrackItem;
