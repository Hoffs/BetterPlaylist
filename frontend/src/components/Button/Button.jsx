import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

const Color = require('color');

const styleTemplate = {
  backgroundColor: 'transparent',
  color: 'inherit',
  borderRadius: '5px',
  padding: '0.5em 1.4em',
  fontSize: '1em',
  borderStyle: 'solid',
  borderWidth: '2px',
  borderColor: '#fff',
  transition: '0.2s',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: Color('#fff').fade(0.5).hsl(),
  },
  ':disabled': {
    backgroundColor: 'hsla(0, 0%, 11%, 0.54)',
    borderColor: 'hsl(0, 0%, 10%)',
    cursor: 'not-allowed',
    color: 'hsl(0, 0%, 30%)',
  },
};

const Button = (props) => {
  const style = Object.assign({}, styleTemplate);
  if (props.fontSize) {
    style.fontSize = props.fontSize;
  }
  if (props.color) {
    style.borderColor = props.color;
    style[':hover'].backgroundColor = Color(props.color).fade(0.4).hsl();
  }
  return (
    <button
      disabled={props.disabled}
      style={style}
      onClick={props.clickHandler}
    >
      {props.label}
    </button>
  );
};

Button.propTypes = {
  fontSize: PropTypes.string,
  color: PropTypes.string.isRequired,
  clickHandler: PropTypes.func,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  fontSize: '1em',
  disabled: false,
  clickHandler: () => {},
};

export default Radium(Button);
