import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserBar from './components/UserBar';
import PlaylistList from './components/PlaylistList';
import PlaylistInfo from './components/PlaylistInfo';
import './Playlister.css';

class Playlister extends Component {
  constructor(props) {
    super(props);
    if (!localStorage.getItem('token')) {
      this.props.history.push('/login');
    }
  }

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
      <div className="playlister-container" >
        <UserBar />
        <PlaylistList />
        <Route path="/home/playlist/:playlist_id" component={PlaylistInfo} />
      </div>
    );
  }
}


Playlister.propTypes = {
  history: PropTypes.shape([]).isRequired,
};

export default Playlister;
