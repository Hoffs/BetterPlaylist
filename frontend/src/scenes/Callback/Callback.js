import React, { Component } from 'react';
import { parse } from 'query-string';
import './Callback.css';

class Callback extends Component {
  constructor(props) {
    super(props);
    const code = parse(this.props.location.search).code;
    this.tryAuthenticate(code);
  }

  tryAuthenticate(code) {
    // TODO
  }

  render() {
    return (
      <div> Hello callback </div>
    );
  }
}

export default Callback;
