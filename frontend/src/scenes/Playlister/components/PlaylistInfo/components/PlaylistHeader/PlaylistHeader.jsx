import React from 'react';
import PropTypes from 'prop-types';
import './PlaylistHeader.css';

const PlaylistHeader = props => (
  <div className="header-container">
    <div className="header-container__name">
      {props.name}
    </div>
    <div className="header-container__description">
      {props.description}
    </div>
  </div>
);

PlaylistHeader.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
};

PlaylistHeader.defaultProps = {
  name: 'Loading...',
  description: 'Loading...',
};

export default PlaylistHeader;
