const querystring = require('query-string');
const fetch = require('node-fetch');
const token = 'BQDF12D5ql_x1N-_zHDfzCEkR_eONZePkRXzRIVSCRwXPshj-8Ah5CjYxsMvVSwjrR7PSPXYGPvBc2K6A0oILaoFc9Sf_jmIwgV443hHHf2LepyeWhPBgQWwSCzOMIeUzd03zeopncLeRWFN7ZdyQG8-'
const playlistId = '5IKnmrC7kpOxgs4nJepT0E'

async function getPlaylistJSON() {
  let res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?`
    + querystring.stringify({
      fields: 'items(track(artists(name),album.images,name,id))',
      limit: 100,
      offset: 0,
      market: 'US'
    }), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  let data = await res.text()
  return data;
}

async function main() {
  console.log(await getPlaylistJSON())
}
main()