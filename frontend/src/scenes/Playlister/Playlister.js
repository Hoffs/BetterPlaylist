import React, { Component } from 'react';

class Playlister extends Component {

  componentWillMount() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login');
    }
  }

  componentWillUpdate() {
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login');
    }
  }


  render() {
    return (
      <div> Hello playlister </div>
    );
  }
}

export default Playlister;
