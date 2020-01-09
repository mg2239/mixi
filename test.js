const querystring = require('query-string');
const fetch = require('node-fetch');
const token = 'BQANQyHkbGe1KeEcpdqjtOJXyQBi7-xnMDSWptXK_DD28gP_qinWTRe1fJ2VZeDhQPrx2GGUTIwlgDHGWQhHGOcoxpEPPVyEs2FOnZ1R_d3ab-n8RIwY4tnciai-n3dzFXjABlTGQhnqJ8n7YdrKzDfN'
const playlistId = '5IKnmrC7kpOxgs4nJepT0E'

let trackInfo = {};
let trackIds = [];

function fillMetadata(items) {
  items.forEach((i) => {
    let { track } = i;
    let { album, artists, id, name } = track;
    let image = album.images[1].url
    let artist = artists[0].name
    trackInfo[id] = { artist, name, image }
  })
}

function fillInfo() {
  trackIds = Object.keys(trackInfo)
  fetch(`https://api.spotify.com/v1/audio-features?`
    + querystring.stringify({
      ids: trackIds.join(',')
    }), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then((res) => res.json())
    .then((json) => {
      let { audio_features } = json;
      audio_features.forEach((track) => {
        let { id, key, mode, tempo } = track;
        trackInfo[id]['key'] = key;
        trackInfo[id]['mode'] = mode;
        trackInfo[id]['bpm'] = tempo;
      })
      console.log(trackInfo)
    })
    .catch((err) => console.log(err));
}

fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?`
  + querystring.stringify({
    fields: 'items(track(artists,album.images,name,id))',
    limit: 100,
    offset: 0,
    market: 'US'
  }), {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then((res) => res.json())
  .then((json) => {
    fillMetadata(json.items)
    fillInfo()
  })
  .catch((err) => console.log(err))