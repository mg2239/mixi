import React from 'react';
import querystring from 'query-string';
import Auth from './Auth';
import logo from '../img/mixi-logo.png';

const isProd = true;
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = isProd ? 'https://mixiforspotify.web.app/' : 'http://localhost:3000';
const spotifyAuth = `https://accounts.spotify.com/authorize?${
  querystring.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    show_dialog: true,
  })}`;

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce((initial, item) => {
    if (item) {
      const parts = item.split('=');
      // eslint-disable-next-line no-param-reassign
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = '';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      token: null,
    };
  }

  componentDidMount() {
    const token = hash.access_token;
    if (token) {
      this.setState({ token });
    }
  }

  render() {
    const { token } = this.state;
    return (
      <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ width: '150px', margin: 'auto' }}>
          <img src={logo} alt="mixi logo" style={{ width: '150px' }} />
          <a href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontWeight: 'bold', color: 'black' }}>Mixi</h1>
          </a>
        </div>
        {!token && (
          <>
            <h5>Make mixes faster by sorting your Spotify playlist tracks by key and BPM!</h5>
            <a href={spotifyAuth}>
              <button className="button-primary" type="button">Access with Spotify</button>
            </a>
            <p>
              built by
              {' '}
              <a href="https://github.com/mg2239" target="_blank" rel="noopener noreferrer">matt</a>
              {' '}
              on github
            </p>
          </>
        )}
        {token && (
          <Auth access={token} />
        )}
      </div>
    );
  }
}

export default Login;
