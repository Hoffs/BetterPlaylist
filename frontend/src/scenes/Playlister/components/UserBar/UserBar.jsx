import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Api from '../../../../services/api';
import './UserBar.css';

class UserBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'none',
      display: 'none',
      image: '',
    };
  }

  componentDidMount() {
    Api.userInfo(localStorage.getItem('token'))
      .then((data) => {
        if (!data) {
          return;
        }
        this.setState({
          id: data.spotifyId,
          display: data.displayName,
          image: data.imageUrl,
        });
      });
  }

  render() {
    return (
      <div className="user-container">
        <img className="user-container__image" src={this.state.image} alt="User avatar" />
        <div className="user-container__display">{this.state.display}</div>
        <div className="user-container__id">{this.state.id}</div>
        <div className="user-container__logout">
          <button onClick={this.props.onLogout}>LOGOUT</button>
        </div>
        <span className="user-container__line" />
      </div>
    );
  }
}

UserBar.propTypes = {
  onLogout: PropTypes.func,
};

UserBar.defaultProps = {
  onLogout: () => {},
};

export default UserBar;
