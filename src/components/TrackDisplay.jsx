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
    };
    this.setParentState = setState;
    this.trackInfo = {};
    this.trackIds = [];
    this.allTracks = [];
  }

  componentDidMount() {
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
      .then(() => this.createTracks())
      .then(() => this.setState({ isGenerated: true }))
      .catch(() => this.setParentState({ isSubmitted: false, playlistDNE: true }));
  }

  fillMetadata(json) {
    const { items } = json;
    items.forEach((i) => {
      const { track } = i;
      const {
        album, artists, id, name, external_urls,
      } = track;
      const img = album.images[1].url;
      const artist = artists[0].name;
      const link = external_urls.spotify;
      this.trackInfo[id] = {
        artist, name, img, link,
      };
    });
  }

  async fillInfo() {
    this.trackIds = Object.keys(this.trackInfo);
    const { access } = this.state;
    // Doesn't always resolve promise before tracks are loaded, so will be awaited for now
    await fetch(`https://api.spotify.com/v1/audio-features?${
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
          this.trackInfo[id].bpm = tempo;
        });
      })
      .catch((err) => console.log(err));
  }

  createTracks() {
    this.trackIds.forEach((id) => {
      this.allTracks.push(
        <Track
          key={id}
          title={this.trackInfo[id].name}
          artist={this.trackInfo[id].artist}
          link={this.trackInfo[id].link}
          scale={this.trackInfo[id].scale}
          mode={this.trackInfo[id].mode}
          bpm={this.trackInfo[id].bpm}
          img={this.trackInfo[id].img}
        />,
      );
    });
  }

  render() {
    const { isGenerated } = this.state;
    return (
      <>
        {isGenerated && (
          <>
            <h5>Processing playlist...</h5>
            <div className="loader" />
          </>
        )}
        {isGenerated && this.allTracks}
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
