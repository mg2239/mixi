import React from 'react';

type Props = {
  title: string
  artists: string
  link: string
  img: string
  songMode: number
  songBPM: number
  songKey: number
}

function convertKey(key: number, mode: number) {
  const numToKeyMaj = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const numToKeyMin = ['Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];
  if (mode) {
    return numToKeyMin[key];
  }
  return numToKeyMaj[key];
}

export default function Track({ title, artists, link, img, songMode, songBPM, songKey }: Props) {
  const mode = songMode;
  const bpm = songBPM;
  const key = convertKey(songKey, mode);
  return (
    <div className="track">
      <div style={{ height: '100%', width: '100%' }}>
        <div className="row">
          <div className="nine columns" style={{ display: 'inline-flex' }}>
            <img src={img} className="track-img" alt="" />
            <div>
              <a href={link} className="track-title" target="_blank" rel="noopener noreferrer">{title}</a>
              <p className="track-artist">{artists}</p>
            </div>
          </div>
          <div className="three columns">
            <div className="one-half column">
              <p className="track-key">{key}</p>
            </div>
            <div className="one-half column">
              <p className="track-bpm">{bpm}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
