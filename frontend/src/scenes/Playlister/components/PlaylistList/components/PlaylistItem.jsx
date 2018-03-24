import React from 'react';
import PropTypes from 'prop-types';
import './PlaylistItem.css';

const PlaylistItem = props => (
  <li is-selected={props.selected.toString()} className="playlist-item" data-id={props.id} >
    <button className="styled-button playlist-item__select" onClick={e => props.selectHandler(e, props.id)}>{props.name}</button>
    <button className="styled-button playlist-item__delete" onClick={e => props.deleteHandler(e, props.id)}>Delete</button>
  </li>
);

PlaylistItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  selectHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

PlaylistItem.defaultProps = {
  selected: false,
};

export default PlaylistItem;
