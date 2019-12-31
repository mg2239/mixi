import React from 'react';
import AuthView from './AuthView'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

class LoginView extends React.Component {
  render() {
    return (
      <Router>
        <div style={{ "text-align": "center", "padding-top": "4rem" }}>
          <h1>Sortify</h1>
          <Switch>
            <Route exact path="/">
              <h5>Organizes tracks in your Spotify playlists by key and BPM</h5>
              <a href="http://localhost:5000/login">
                <button class="button-primary">Log in with Spotify</button>
              </a>
              <p>built by <a href="https://github.com/mg2239" target="_blank" rel="noopener noreferrer">matt</a> on github</p>
            </Route>
            <Route path="/:access" component={AuthView} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default LoginView;
