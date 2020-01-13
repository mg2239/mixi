import React from 'react';
import PropTypes from 'prop-types';

function convertKey(scale, mode) {
  const numToKeyMaj = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const numToKeyMin = ['Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'Bbm', 'Bm'];
  if (mode) {
    return numToKeyMin[scale];
  }
  return numToKeyMaj[scale];
}

class Track extends React.Component {
  constructor(props) {
    super();
    const {
      title, artists, link, mode, img, bpm,
    } = props;
    let { scale } = props;
    scale = convertKey(scale, mode);
    this.state = {
      title, artists, link, scale, bpm, img,
    };
  }

  render() {
    const {
      img, link, artists, title, scale, bpm,
    } = this.state;
    return (
      <div className="track">
        <img src={img} className="track-img" alt="" />
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="nine columns">
              <a href={link} className="track-title" target="_blank" rel="noopener noreferrer">{title}</a>
              <p className="track-artist">{artists}</p>
            </div>
            <div className="three columns">
              <div className="one-half column">
                <p className="track-key">{scale}</p>
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
}

Track.propTypes = {
  title: PropTypes.string.isRequired,
  artists: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  mode: PropTypes.number.isRequired,
  bpm: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
};

export default Track;
