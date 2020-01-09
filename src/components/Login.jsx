import React from 'react';
import querystring from 'query-string';
import Auth from './Auth';
import logo from '../img/mixi-logo.png';

const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = "http://localhost:3000";
const spotifyAuth =
  'https://accounts.spotify.com/authorize?'
  + querystring.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    show_dialog: true
  });

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
        <a href="/">
          <img src={logo} alt="mixi logo" style={{ width: "150px" }}></img>
        </a>
        <h1 style={{ fontWeight: "bold" }}>Mixi</h1>
        {!this.state.token && <>
          <h5>Make mixes faster by sorting your Spotify playlist tracks by key and BPM!</h5>
          <a href={spotifyAuth}>
            <button className="button-primary">Access with Spotify</button>
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
