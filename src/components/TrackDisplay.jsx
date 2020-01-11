import React from 'react';
import Track from './Track';
import querystring from 'query-string';

class TrackDisplay extends React.Component {
  constructor(props) {
    super();
    let { access, playlist, setState } = props;
    let playlistId = playlist.substring(17);
    this.state = {
      access,
      playlistId,
      isGenerated: false,
      bpmKey: 0
    }
    this.setParentState = setState;
    this.trackInfo = {};
    this.trackIds = [];
    this.allTracks = [];
  }

  componentDidMount() {
    fetch(`https://api.spotify.com/v1/playlists/${this.state.playlistId}/tracks?`
      + querystring.stringify({
        fields: 'items(track(artists,album.images,name,id,external_urls))',
        limit: 100,
        offset: 0,
        market: 'US'
      }), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.access}`
      }
    })
      .then((res) => res.json())
      .then((json) => this.fillMetadata(json))
      .then(() => this.fillInfo())
      .then(() => this.createTracks())
      .then(() => this.setState({ isGenerated: true }))
      .catch(() => this.setParentState({ isSubmitted: false, playlistDNE: true }))
  }

  fillMetadata(json) {
    console.log(json)
    let { items } = json;
    items.forEach((i) => {
      let { track } = i;
      let { album, artists, id, name, external_urls } = track;
      let img = album.images[1].url
      let artist = artists[0].name
      let link = external_urls.spotify;
      this.trackInfo[id] = { artist, name, img, link }
    })
  }

  async fillInfo() {
    this.trackIds = Object.keys(this.trackInfo)
    // Doesn't always resolve promise before tracks are loaded, so will be awaited for now
    await fetch(`https://api.spotify.com/v1/audio-features?`
      + querystring.stringify({
        ids: this.trackIds.join(',')
      }), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.access}`
      }
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('audio ' + json)
        let { audio_features } = json;
        audio_features.forEach((track) => {
          let { id, key, mode, tempo } = track;
          this.trackInfo[id]['scale'] = key;
          this.trackInfo[id]['mode'] = mode;
          this.trackInfo[id]['bpm'] = tempo;
        })
      })
      .catch((err) => console.log(err));
  }

  createTracks() {
    this.trackIds.forEach((id) => {
      this.allTracks.push(
        <Track
          key={id}
          title={this.trackInfo[id]['name']}
          artist={this.trackInfo[id]['artist']}
          link={this.trackInfo[id]['link']}
          scale={this.trackInfo[id]['scale']}
          mode={this.trackInfo[id]['mode']}
          bpm={this.trackInfo[id]['bpm']}
          img={this.trackInfo[id]['img']} />
      )
    })
  }

  render() {
    return <>
      {!this.state.isGenerated && <>
        <h5>Processing playlist...</h5>
        <div className="loader"></div>
      </>}
      {this.state.isGenerated && this.allTracks}
    </>
  }
}

export default TrackDisplay;