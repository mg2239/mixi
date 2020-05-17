/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import querystring from 'query-string';
import Track from './Track';

enum Sort { bpm, key }

type Props = {
  accessToken: string
  playlist: string
}

export default function TrackDisplay({ accessToken, playlist }: Props) {
  const playlistID = playlist.substring(17);
  const [isGenerated, setGenerated] = useState(false);
  const [sort, setSort] = useState(Sort.bpm);
  const trackInfo = {};
  let trackIDs = [];

  async function generateTracks() {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks?${
      querystring.stringify({
        fields: 'items(track(artists,album.images,name,id,external_urls))',
        limit: 100,
        offset: 0,
        market: 'US',
      })}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(async (json) => {
        fillMetadata(json);
        await fillInfo();
        sortTracks();
      })
      .catch((err) => console.log(err));
  }

  function fillMetadata(json) {
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
      trackInfo[id] = {
        artists, name, img, link,
      };
    });
  }

  async function fillInfo() {
    trackIDs = Object.keys(trackInfo);
    // Doesn't always resolve promise before tracks are loaded, so will be awaited for now
    await fetch(`https://api.spotify.com/v1/audio-features?${
      querystring.stringify({
        ids: trackIDs.join(','),
      })}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { audio_features } = json;
        audio_features.forEach((track) => {
          const {
            id, key, mode, tempo,
          } = track;
          trackInfo[id].key = key;
          trackInfo[id].mode = mode;
          trackInfo[id].bpm = Math.trunc(tempo + 0.5);
        });
      })
      .catch((err) => console.log(err));
  }

  function sortTracks() {
    if (sort === Sort.bpm) {
      // Sort by BPM
      trackIDs.sort((a, b) => trackInfo[a].bpm - trackInfo[b].bpm);
    } else {
      // Sort by key (C, Cm, D, Dm,...)
      trackIDs.sort((a, b) => {
        const keyComp = trackInfo[a].key - trackInfo[b].key;
        const modeComp = trackInfo[a].mode - trackInfo[b].mode;
        // If a's key != b's key, the "lower" key (closer to C) is smaller
        // else if a's key = b's key, the major key is smaller
        return keyComp || modeComp;
      });
    }
  }

  function changeSort(newSort) {
    if (sort !== newSort) {
      setGenerated(false);
      setSort(newSort);
      sortTracks();
    }
  }

  useEffect(() => {
    if (!isGenerated) {
      generateTracks();
      setGenerated(true);
    }
  }, [isGenerated]);

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
            <button className="button-primary toggle-btn" type="button" onClick={() => changeSort(Sort.key)}>
              Sort by key
            </button>
            <button className="button-primary toggle-btn" type="button" onClick={() => changeSort(Sort.bpm)}>
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
          {trackIDs.forEach((id) => (
            <Track
              key={id}
              title={trackInfo[id].name}
              artists={trackInfo[id].artists}
              link={trackInfo[id].link}
              img={trackInfo[id].img}
              songKey={trackInfo[id].key}
              songMode={trackInfo[id].mode}
              songBPM={trackInfo[id].bpm}
            />
          ))}
        </>
      )}
    </>
  );
}
