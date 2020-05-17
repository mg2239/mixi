import React, { useState, useEffect } from 'react';
import querystring from 'query-string';
import PlaylistInput from './PlaylistInput';
import logo from '../img/mixi-logo.png';

const isProd = window.location.hostname !== 'localhost';
const clientID = process.env.REACT_APP_CLIENT_ID;
const redirectURI = isProd ? window.location.href : 'http://localhost:3000';
const spotifyAuth = `https://accounts.spotify.com/authorize?${
  querystring.stringify({
    client_id: clientID,
    redirect_uri: redirectURI,
    response_type: 'token',
    show_dialog: true,
  })}`;

type HashType = {
  // eslint-disable-next-line camelcase
  access_token?: string,
};

const hash: HashType = window.location.hash
  .substring(1)
  .split('&')
  .reduce((acc: { [key: string]: string }, item) => {
    const newAcc = acc;
    const parts = item.split('=');
    newAcc[parts[0]] = decodeURIComponent(parts[1]);
    return newAcc;
  }, {});

window.location.hash = '';

export default function Home() {
  const [token, setToken] = useState('');

  useEffect(() => {
    if (hash.access_token) {
      setToken(hash.access_token);
    }
  }, []);

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
        <PlaylistInput accessToken={token} />
      )}
    </div>
  );
}
