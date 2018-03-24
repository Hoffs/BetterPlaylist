import React from 'react';
import PropTypes from 'prop-types';
import './TrackItem.css';

const millisToMinutesAndSeconds = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const TrackItem = props => (
  <div className="track-item">
    <div className="track-item__name">
      {props.name}
    </div>
    <div className="track-item__artist">
      {props.artist}
    </div>
    <div className="track-item__album">
      {props.album}
    </div>
    <div className="track-item__duration">
      {millisToMinutesAndSeconds(props.duration)}
    </div>
  </div>
); // TODO: Add delete

TrackItem.propTypes = {
  name: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  artist: PropTypes.string.isRequired,
  album: PropTypes.string.isRequired,
};

export default TrackItem;
