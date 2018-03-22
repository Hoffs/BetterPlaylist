import React from 'react';
import Radium from 'radium';
const Color = require('color');

const style = {
  'background-color': 'transparent',
  'color': 'inherit',
  'border-radius': '5px',
  'padding': '0.5em 1.4em',
  'font-size': '1em',
  'border-style': 'solid',
  'border-width': '2px',
  'border-color': '#fff',
  'transition': '0.2s',
  'cursor': 'pointer',
  ':hover' : {
    'background-color': Color('#fff').fade(0.5).hsl(),
  }
}

const Button = (props) => {
  style['font-size'] = props.fontSize;
  style['border-color'] = props.color;
  style[':hover']['background-color'] = Color(props.color).fade(0.4).hsl();
  return (
    <button style={style} onClick={props.clickHandler}>{props.label}</button>
  );
}

export default Radium(Button);
