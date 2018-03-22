import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from "./scenes/Login";
import Callback from "./scenes/Callback";
import Playlister from "./scenes/Playlister";

class BetterPlaylist extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/callback" component={Callback}/>
          <Route path="/home" component={Playlister}/>
          <Route path="*" render={() => (<Redirect to="/home"/>)}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default BetterPlaylist;
