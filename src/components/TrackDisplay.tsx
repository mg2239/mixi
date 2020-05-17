/* eslint-disable no-console */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import Track from './Track';

class TrackDisplay extends React.Component {
  constructor(props) {
    super();
    const { access, playlist, setState } = props;
    const playlistId = playlist.substring(17);
    this.state = {
      access,
      playlistId,
      isGenerated: false,
      bpmKey: false, // false if sorting by bpm, true if sorting by key
    };
    this.setParentState = setState;
    this.trackInfo = {};
    this.trackIds = [];
  }

  componentDidMount() {
    Promise((resolve) => resolve(this.fillTracks())).then(this.createTracks());
  }

  componentDidUpdate() {
    const { isGenerated } = this.state;
    if (!isGenerated) {
      this.createTracks();
    }
  }

  fillMetadata(json) {
    const { items } = json;
    items.forEach((i) => {
      const { track } = i;
      let { artists } = track;
      const {
        album, id, name, external_urls,
      } = track;
      const img = album.images[1].url;
      artists = artists.map((a) => a.name).join(', ');
      const link = external_urls.spotify;
      this.trackInfo[id] = {
        artists, name, img, link,
      };
    });
  }

  fillTracks() {
    const { playlistId, access } = this.state;
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?${
      querystring.stringify({
        fields: 'items(track(artists,album.images,name,id,external_urls))',
        limit: 100,
        offset: 0,
        market: 'US',
      })}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((json) => this.fillMetadata(json))
      .then(() => this.fillInfo())
      .catch((err) => console.log(err));
  }

  fillInfo() {
    this.trackIds = Object.keys(this.trackInfo);
    const { access } = this.state;
    // Doesn't always resolve promise before tracks are loaded, so will be awaited for now
    fetch(`https://api.spotify.com/v1/audio-features?${
      querystring.stringify({
        ids: this.trackIds.join(','),
      })}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { audio_features } = json;
        audio_features.forEach((track) => {
          const {
            id, key, mode, tempo,
          } = track;
          this.trackInfo[id].scale = key;
          this.trackInfo[id].mode = mode;
          this.trackInfo[id].bpm = Math.trunc(tempo + 0.5);
        });
      })
      .catch((err) => console.log(err));
  }

  createTracks() {
    this.allTracks = [];
    this.sortTracks();
    this.trackIds.forEach((id) => {
      this.allTracks.push(
        <Track
          key={id}
          title={this.trackInfo[id].name}
          artists={this.trackInfo[id].artists}
          link={this.trackInfo[id].link}
          scale={this.trackInfo[id].scale}
          mode={this.trackInfo[id].mode}
          bpm={this.trackInfo[id].bpm}
          img={this.trackInfo[id].img}
        />,
      );
    });
    this.setState({ isGenerated: true });
  }

  sortTracks() {
    const { bpmKey } = this.state;
    if (!bpmKey) {
      // Sort by BPM
      this.trackIds.sort((a, b) => this.trackInfo[a].bpm - this.trackInfo[b].bpm);
    } else {
      // Sort by key (C, Cm, D, Dm,...)
      this.trackIds.sort((a, b) => {
        const keyComp = this.trackInfo[a].scale - this.trackInfo[b].scale;
        const modeComp = this.trackInfo[a].mode - this.trackInfo[b].mode;
        // If a's key != b's key, the "lower" key (closer to C) is smaller
        if (keyComp !== 0) {
          return keyComp;
        }
        // If a's key = b's key, the major key is smaller
        return modeComp;
      });
    }
  }

  changeSort(newBpmKey) {
    const { bpmKey } = this.state;
    if (bpmKey !== newBpmKey) {
      this.setState({ isGenerated: false, bpmKey: newBpmKey });
    }
  }

  render() {
    const { isGenerated } = this.state;
    return (
      <>
        {!isGenerated && (
          <>
            <h5>Processing playlist...</h5>
            <div className="loader" />
          </>
        )}
        {isGenerated && (
          <>
            <div id="toggle-display">
              <button className="button-primary toggle-btn" type="button" onClick={() => this.changeSort(true)}>
                Sort by key
              </button>
              <button className="button-primary toggle-btn" type="button" onClick={() => this.changeSort(false)}>
                Sort by BPM
              </button>
            </div>
            <div id="track-grid-header">
              <div style={{ height: '100%', width: '100%' }}>
                <div className="row">
                  <div className="nine columns">
                    <p id="track-grid-title">Track</p>
                  </div>
                  <div className="three columns">
                    <div className="one-half column">
                      <p id="track-grid-key">Key</p>
                    </div>
                    <div className="one-half column">
                      <p id="track-grid-bpm">BPM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.allTracks}
          </>
        )}
      </>
    );
  }
}

TrackDisplay.propTypes = {
  access: PropTypes.string.isRequired,
  playlist: PropTypes.string.isRequired,
  setState: PropTypes.func.isRequired,
};

export default TrackDisplay;
