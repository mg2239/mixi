import React from 'react';
import Auth from './Auth';

const spotifyAuth = 'https://accounts.spotify.com/authorize';
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = "http://localhost:3000";
const scope = "user-read-email";

const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = "";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      token: null
    }
  }

  componentDidMount() {
    let token = hash.access_token;
    if (token) {
      this.setState({ token });
    }
  }

  render() {
    return (
      <div style={{ textAlign: "center", paddingTop: "4rem" }}>
        <h1>Mixi</h1>
        {!this.state.token && <>
          <h5>Organize tracks in your Spotify playlists by key and BPM!</h5>
          <a href={`${spotifyAuth}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token&show_dialog=true`}>
            <button className="button-primary">Log in with Spotify</button>
          </a>
          <p>built by <a href="https://github.com/mg2239" target="_blank" rel="noopener noreferrer">matt</a> on github</p>
        </>}
        {this.state.token && (
          <Auth access={this.state.token} />
        )}
      </div>
    )
  }
}

export default Login;
