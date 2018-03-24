import React from 'react';
import PropTypes from 'prop-types';
import TrackItem from './components/TrackItem';
import './TrackList.css';

const TrackList = props => (
  <div className="track-container">
    <div className="track-container__legend-name">
      TITLE
    </div>
    <div className="track-container__legend-artist">
      ARTIST
    </div>
    <div className="track-container__legend-album">
      ALBUM
    </div>
    <div className="track-container__legend-duration">
      DURATION
    </div>
    <div className="track-container__add">
      ADD
    </div>
    <div className="track-container__tracks">
      {props.tracks.map(track => (<TrackItem
        key={track.id}
        name={track.name}
        duration={track.duration}
        album={track.album}
        artist={track.artist}
      />))}
    </div>
  </div>
);

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    duration: PropTypes.number,
    album: PropTypes.string,
    artist: PropTypes.string,
  })).isRequired,
};

export default TrackList;
