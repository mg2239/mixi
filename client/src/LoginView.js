import React from 'react';

class LoginView extends React.Component {
  constructor() {
    super();
    let access = this.getAccessToken();
    let refresh = this.getRefreshToken();
    this.state = {
      access,
      refresh,
    }
  }

  async getAccessToken() {
    let access = await fetch('http://localhost:5000/token').then((res) => res.access);
    console.log('hello' + access)
    return access;
  }

  async getRefreshToken() {
    let access = await fetch('/token').then((res) => res.refresh);
    return access;
  }

  render() {
    return (
      <div class="container">
        <div style={{ "text-align": "center", "padding-top": "4rem" }}>
          <h1>Sortify</h1>
          <h5>Organizes tracks in your Spotify playlists by key and BPM</h5>
          <a href="http://localhost:5000/login">
            <button class="button-primary">Log in with Spotify</button>
          </a>
          <p>built by <a href="https://github.com/mg2239" target="_blank" rel="noopener noreferrer">matt</a> on github</p>
          <p value={this.getAccessToken()}></p>
          <p value={this.getRefreshToken()}></p>
        </div>
      </div >
    );
  }
}

export default LoginView;
