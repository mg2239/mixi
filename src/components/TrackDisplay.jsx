import React from 'react';
import Track from './Track';
import querystring from 'query-string';

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
      bpmKey: 0
    }
  }

  componentDidMount() {
    fetch(`https://api.spotify.com/v1/playlists/${this.state.playlistId}/tracks?`
      + querystring.stringify({
        fields: 'items(track(artists(name),album.images,name,id))',
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
      .then((js) => console.log(js))
      .catch((err) => console.log(err))
  }

  render() {
    return <>
      {!this.state.isGenerated && <h5>Processing...</h5>}
      {this.state.isGenerated && allTracks}
    </>
  }
}

export default TrackDisplay;