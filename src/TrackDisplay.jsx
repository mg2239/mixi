import React from 'react';
import Track from './Track';

const getPlaylistTracksURL = 'https://api.spotify.com/v1/playlists/'
const getTrackInfoURL = 'https://api.spotify.com/v1/audio-features/'

let allTracks = <Track title="test" artist="me" link="#" key="A" bpm="130" />

class TrackDisplay extends React.Component {
  constructor(props) {
    super();
    let { access, playlist } = props;
    let playlistId = playlist.substring(17);
    this.state = {
      access,
      playlistId,
      isGenerated: true,
      BPMkey: 0,
      trackList: []
    }
  }

  componentDidMount() {
    let playlistTracks =
      fetch(getPlaylistTracksURL
        + this.state.playlistId
        + '?fields=items(track)')
  }

  render() {
    return <>
      {!this.state.isGenerated && <h5>Processing...</h5>}
      {this.state.isGenerated && allTracks}
    </>
  }
}

export default TrackDisplay;