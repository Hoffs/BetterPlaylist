import React from 'react';
import PropTypes from 'prop-types';
import './PlaylistHeader.css';

const PlaylistHeader = props => (
  <div className="header-container">
    <div className="header-container__name">
      {props.name}
      <button onClick={props.onEdit} className="header-container__name__edit">
        EDIT
      </button>
      <button onClick={props.onExport} className="header-container__name__export">
        EXPORT
      </button>
    </div>
    <div className="header-container__description">
      {props.description}
    </div>
  </div>
);

PlaylistHeader.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  onEdit: PropTypes.func,
  onExport: PropTypes.func,
};

PlaylistHeader.defaultProps = {
  name: 'Loading...',
  description: 'Loading...',
  onEdit: () => {},
  onExport: () => {},
};

export default PlaylistHeader;
