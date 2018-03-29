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
      <button className="track-container__add__button" onClick={props.addHandler}>
        ADD TRACKS
      </button>
    </div>
    <div className="track-container__search">
      <span>SEARCH:</span>
      <input
        onKeyPress={e => ((e.key === 'Enter') ? props.searchHandler(e.target.value) : null)}
        onBlur={e => props.searchHandler(e.target.value)}
      />
    </div>
    <div className="track-container__tracks">
      {props.tracks.map(track => (<TrackItem
        key={track.id}
        id={track.id}
        name={track.name}
        duration={track.duration}
        album={track.album}
        artist={track.artist}
        onDelete={props.deleteHandler}
      />))}
    </div>
  </div>
);

TrackList.propTypes = {
  tracks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    position: PropTypes.number,
    name: PropTypes.string,
    duration: PropTypes.number,
    album: PropTypes.string,
    artist: PropTypes.string,
  })).isRequired,
  addHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  searchHandler: PropTypes.func.isRequired,
};

export default TrackList;
